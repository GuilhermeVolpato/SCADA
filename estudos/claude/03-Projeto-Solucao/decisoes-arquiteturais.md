# Decisões Arquiteturais (ADRs)

Formato: Contexto → Decisão → Consequências. Uma ADR não documenta só "o que foi feito", mas a alternativa que foi preterida e por quê — é isso que separa uma decisão de arquitetura de uma escolha arbitrária.

---

## ADR-001 — MQTT como protocolo de telemetria (em vez de HTTP polling direto do nó)

**Contexto:** os nós ESP32 precisam enviar leituras periódicas para um sistema central, com rede Wi-Fi eventualmente instável e múltiplos consumidores potenciais (backend, frontend) do mesmo dado.

**Decisão:** usar MQTT com um broker central, publicando por tópico (`miniscada/<área>/<sensor>`), em vez de cada nó fazer requisições HTTP diretas a um endpoint de API.

**Consequências:**
- ✅ Desacopla produtores de consumidores — o nó não precisa saber quem consome; hoje há dois consumidores (backend e frontend) sem que o firmware tenha mudado.
- ✅ `PubSubClient` reconecta automaticamente (`reconnectMQTT()`), lidando melhor com instabilidade de rede do que uma sequência de requisições HTTP síncronas.
- ⚠️ Introduz um componente de infraestrutura a mais (o broker) que precisa estar disponível — é um ponto único de falha na cadeia de telemetria (ver RNF-02/03).

---

## ADR-002 — Dois nós ESP32 especializados, em vez de um nó único com todos os sensores

**Contexto:** o sistema precisa monitorar variáveis ambientais (temperatura, umidade, gás) e de segurança (movimento, fogo), fisicamente em pontos que podem não coincidir na planta.

**Decisão:** dividir em dois firmwares/nós independentes (`ambiente` e `seguranca`), cada um como `environment` isolado no PlatformIO, compilando apenas seu próprio código + `src/shared/`.

**Consequências:**
- ✅ Cada nó pode ser posicionado onde faz sentido fisicamente (ex.: sensor de gás perto de uma fonte de risco química, PIR perto de uma entrada).
- ✅ Abre caminho natural para a funcionalidade de proximidade via BLE (RF-09): o nó `seguranca` escaneia o RSSI do beacon do nó `ambiente` para estimar distância entre eles — hoje planejado, não implementado.
- ⚠️ Duplica lógica de conexão Wi-Fi/MQTT entre os dois firmwares (mitigado parcialmente por `src/shared/NetworkManager.h`).

---

## ADR-003 — NestJS como backend principal; papel do backend `.NET` em aberto

**Contexto:** o repositório contém dois backends: `backend/` (.NET 10, ASP.NET Core minimal API) e `nest-node/` (NestJS/TypeScript). O histórico de commits mostra o backend `.NET` como ponto de partida inicial do projeto; o desenvolvimento ativo (módulos de MQTT, telemetry, dashboard, auth) migrou para `nest-node`.

**Decisão:** tratar `nest-node` como o backend de fato do sistema. O backend `.NET` permanece no repositório sem função ativa no momento — ainda contém apenas o template padrão (`WeatherForecast`) gerado pelo `dotnet new`.

**Consequências:**
- ✅ Evita ambiguidade sobre onde novas funcionalidades de backend devem ser implementadas.
- ⚠️ **Dívida de repositório:** manter um projeto scaffold sem função ativa gera confusão para quem lê o código pela primeira vez. Duas saídas razoáveis, ainda em aberto:
  1. Remover `backend/` do repositório até haver um caso de uso concreto para ele; ou
  2. Reposicionar deliberadamente o backend `.NET` como um **gateway de protocolo industrial** (ex.: um serviço dedicado a falar Modbus/OPC-UA com CLPs em plantas maiores — cenário citado no roadmap de [`stack-tecnologica.md`](./stack-tecnologica.md)), já que .NET tem bibliotecas maduras para esse domínio e separar esse gateway do backend de aplicação (NestJS) é defensável por si só.
- Esta ADR está deliberadamente marcada como decisão **não fechada** — registrar a ambiguidade é mais honesto do que fingir uma justificativa retroativa para um artefato que hoje é, na prática, órfão.

---

## ADR-004 — Broker gerenciado (nós de campo) + broker local (desenvolvimento)

**Contexto:** os nós ESP32 físicos precisam de um broker acessível pela internet pública (não estão na mesma rede da máquina de desenvolvimento). Ao mesmo tempo, desenvolver o backend/frontend não deveria depender de um broker de produção sempre disponível.

**Decisão:** usar HiveMQ Cloud (gerenciado) como broker de referência para os nós reais, e HiveMQ CE local via `docker-compose` para desenvolvimento do backend/frontend.

**Consequências:**
- ✅ Desenvolvimento local não depende de credenciais de produção nem de conectividade externa.
- ⚠️ Os dois ambientes podem divergir em configuração (versão do broker, políticas de autenticação) — não há automação hoje que garanta paridade entre eles.

---

## ADR-005 — Frontend lê o broker MQTT diretamente, sem passar pelo backend NestJS

**Contexto:** o dashboard (`frontend/src/app/dashboard/page.tsx`) precisa exibir leituras em near real-time. O backend NestJS já tem um módulo `mqtt` funcional que assina os mesmos tópicos.

**Decisão observada no código:** o frontend implementou seu **próprio** cliente MQTT (`frontend/src/app/server/mqtt.ts`), conectando via WebSocket diretamente ao broker HiveMQ, e expõe isso ao navegador via uma rota própria (`/api/sensors`) — sem envolver o backend NestJS nesse caminho.

**Por que isso é registrado como decisão e não como bug:** tecnicamente funciona e foi provavelmente o caminho mais rápido para ter um dashboard funcionando fim-a-fim durante o desenvolvimento. Mas é uma decisão com consequências arquiteturais reais que merecem estar explícitas:

**Consequências:**
- ⚠️ **Duplicação:** a lista de tópicos/sensores existe em dois lugares (`nest-node/src/modules/mqtt/sensors.ts` e `frontend/src/app/server/mqtt.ts`) — precisa ser mantida sincronizada manualmente.
- ⚠️ **Nenhuma regra de negócio, autenticação ou persistência no caminho real de dados:** como o frontend fala direto com o broker, os módulos `telemetry`/`dashboard`/`auth` do backend NestJS não afetam o que o usuário final vê hoje.
- ⚠️ **Credenciais do broker expostas ao processo do frontend:** o servidor Next.js precisa das credenciais MQTT (`SECRET_MQTT_*`) para conectar — mais um lugar com acesso direto ao broker, além do backend.
- **Caminho de consolidação recomendado:** migrar o frontend para consumir a API do backend NestJS (`GET /dashboard/live`, `/dashboard/history`) assim que RF-04/RF-07 estiverem implementados, eliminando a conexão MQTT duplicada no frontend. Isso não foi feito ainda porque o backend NestJS ainda não persiste nem consolida esse dado de verdade — fazer a migração antes disso seria trocar um caminho funcional por um que hoje devolve dados estáticos (ver `dashboard.service.ts`).

---

## ADR-006 — Validação de certificado TLS desabilitada no cliente MQTT do ESP32

**Contexto:** o ESP32 usa `WiFiClientSecure` para conectar ao broker via TLS. Validar a cadeia de certificado completa em um microcontrolador exige armazenar/atualizar o certificado raiz do broker no firmware, o que adiciona complexidade de manutenção (renovação de certificado do broker exige novo flash dos nós, caso a validação seja estrita).

**Decisão:** usar `espClient.setInsecure()`, que estabelece a conexão cifrada mas **não valida** o certificado apresentado pelo broker.

**Consequências:**
- ✅ Simplifica o firmware e evita quebra de conexão por certificado expirado/rotacionado do lado do broker.
- ⚠️ **Risco de segurança real e consciente:** a conexão fica vulnerável a um ataque ativo de *man-in-the-middle* com certificado forjado (não a escuta passiva, que a cifra ainda impede). Aceitável para um projeto de portfólio/desenvolvimento; **não seria aceitável em uma implantação real** monitorando segurança física de uma planta.
- **Mitigação recomendada antes de qualquer uso além de portfólio:** embutir o certificado raiz (ou fingerprint) do broker no firmware e usar `setCACert()`/`setFingerprint()` em vez de `setInsecure()`.
