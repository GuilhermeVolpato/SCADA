# Requisitos Funcionais

Formato: histórias de usuário (`Como <persona>, quero <ação>, para que <benefício>`), rastreadas até a persona de origem (ver [`01-Contexto/personas-stakeholders.md`](../01-Contexto/personas-stakeholders.md)) e até o componente que implementa (ou implementaria) o requisito.

Status: ✅ Implementado · 🟡 Parcial · ⚪ Planejado — ver critério em [`claude/README.md`](../README.md).

## Coleta de dados (borda)

**RF-01 — Coleta de variáveis ambientais**
Como Diego (operador), quero que o sistema colete temperatura, umidade e presença de gás inflamável continuamente, para que uma condição de risco ambiental seja detectada sem depender de ronda manual.
**Status:** ✅ Implementado — nó `ambiente` (ESP32 + DHT11 + MQ-2), ver [`04-Solucao/embarcado.md`](../04-Solucao/embarcado.md).

**RF-02 — Coleta de variáveis de segurança**
Como Diego (operador), quero que o sistema detecte movimento e fogo em áreas monitoradas, para que uma intrusão ou princípio de incêndio gere alerta imediato.
**Status:** ✅ Implementado — nó `seguranca` (ESP32 + PIR + sensor de chama).

**RF-03 — Identificação inequívoca da origem do dado**
Como Diego (operador), quero que cada leitura publicada indique claramente de qual área e sensor ela vem, para que eu não precise adivinhar onde agir.
**Status:** ✅ Implementado — convenção de tópicos MQTT `miniscada/<área>/<sensor>` (ex.: `miniscada/ambiente/gas`, `miniscada/seguranca/fogo`).

## Persistência e histórico

**RF-04 — Persistência histórica das leituras**
Como Marcos (segurança do trabalho), quero que toda leitura relevante fique registrada com data/hora, para que eu tenha evidência auditável de conformidade (NR-12/23/33).
**Status:** ⚪ Planejado — existe infraestrutura (PostgreSQL + TypeORM configurados no backend), mas não existe ainda uma entidade/tabela de telemetria; o endpoint `POST /telemetry` hoje **republica a leitura em MQTT e não a grava em banco** (ver [`04-Solucao/backend.md`](../04-Solucao/backend.md)).

**RF-05 — Consulta de histórico de eventos**
Como Marcos (segurança do trabalho), quero consultar o histórico de leituras/alertas de um período, para que eu possa gerar relatórios de conformidade.
**Status:** ⚪ Planejado — endpoint `GET /dashboard/history` existe, mas retorna um payload estático (stub), não uma consulta real ao banco.

## Visualização e alertas

**RF-06 — Visualização em tempo real no dashboard**
Como Renata (gerente de operações), quero ver o estado atual de todos os sensores em uma única tela, para que eu tenha visibilidade da planta sem precisar caminhar até cada nó.
**Status:** ✅ Implementado — `frontend/src/app/dashboard/page.tsx` consome `/api/sensors` a cada 2s. **Nota de arquitetura:** essa rota conecta o frontend **diretamente** ao broker MQTT (via WebSocket), sem passar pelo backend NestJS — ver discussão em [`03-Projeto-Solucao/decisoes-arquiteturais.md`](../03-Projeto-Solucao/decisoes-arquiteturais.md#adr-005).

**RF-07 — API backend centralizada para ingestão/consulta de telemetria**
Como arquiteto do sistema, quero uma API backend única como fonte de verdade da telemetria (em vez do frontend falar direto com o broker), para que regras de negócio, autenticação e persistência fiquem centralizadas.
**Status:** 🟡 Parcial — módulos `mqtt`, `telemetry` e `dashboard` existem no NestJS e assinam os tópicos corretamente, mas ainda não são o caminho real usado pelo frontend (ver RF-06).

**RF-08 — Autenticação de usuários**
Como Renata (gerente), quero que o acesso ao dashboard exija autenticação, para que dados operacionais sensíveis não fiquem publicamente acessíveis.
**Status:** 🟡 Parcial — existe `AuthGuard` e `UserEntity` no backend, mas o guard hoje só verifica a **presença** do header `Authorization`, sem validar um token de fato; não há endpoint de login/emissão de token implementado.

**RF-09 — Estimativa de proximidade entre nós via BLE**
Como Diego (operador), quero saber a proximidade física entre o nó de segurança e o beacon do nó de ambiente (RSSI), para que incidentes possam ser localizados espacialmente dentro da planta.
**Status:** ⚪ Planejado — mencionado no README raiz do repositório; o código de beacon/scanner BLE existe apenas comentado (`TODO`) em `embedded/src/esp32-ambiente/ambiente/ambiente.cpp`.

**RF-10 — Páginas de detalhamento de sensores e relatórios**
Como Marcos (segurança do trabalho), quero páginas dedicadas de detalhamento por sensor e de relatórios exportáveis, para além do resumo do dashboard.
**Status:** ⚪ Planejado — rotas `/sensors` e `/reports` existem no frontend como placeholders estáticos, sem dados reais.

## Roteiro (fora do MVP atual)

- Aplicativo mobile (`mobile/`) — hoje é apenas uma anotação de intenção no README da pasta.
- Integração com protocolos industriais legados (Modbus/OPC-UA) — ver nota sobre o backend `.NET` em decisões arquiteturais.
