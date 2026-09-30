# Requisitos Não Funcionais

Cada RNF inclui o estado real observado no código — não apenas a intenção — porque um requisito não funcional que não é verificável na implementação é só uma aspiração.

## Desempenho e latência

**RNF-01 — Latência de ponta a ponta (sensor → dashboard)**
Alvo: leitura visível no dashboard em poucos segundos após a coleta no sensor.
**Estado real:** o nó `ambiente` publica a cada ~2s (`delay(2000)` em `ambiente.cpp`); o nó `seguranca` a cada ~150ms; o frontend faz *polling* de `/api/sensors` a cada 2s. Ou seja, a latência hoje é dominada pelo intervalo de publicação do nó mais lento e pelo polling do frontend — não há *push* (WebSocket/SSE) do backend para o cliente. ✅ Atende ao alvo qualitativo ("poucos segundos"), mas o modelo de polling não escala bem para muitos nós/usuários simultâneos.

## Disponibilidade

**RNF-02 — Resiliência de conexão dos nós de borda**
Alvo: um nó ESP32 deve se reconectar automaticamente a Wi-Fi/MQTT após queda de rede, sem intervenção manual.
**Estado real:** ✅ implementado — `reconnectMQTT()` é chamado no `loop()` de ambos os nós sempre que `client.connected()` é falso (ver [`04-Solucao/embarcado.md`](../04-Solucao/embarcado.md)).

**RNF-03 — Continuidade do backend após reinício**
Alvo: o backend não deve perder o estado de "última leitura conhecida" de forma silenciosa.
**Estado real:** 🟡 parcial/risco — o `MqttService` do NestJS mantém as últimas mensagens em um `Map` **em memória**; um reinício do processo, ou rodar mais de uma instância do backend (escala horizontal), perde ou fragmenta esse estado. Isso é aceitável para um MVP de nó único, mas é uma limitação conhecida a resolver antes de qualquer ambiente com múltiplas instâncias — ver ADR-005 em [`decisoes-arquiteturais.md`](../03-Projeto-Solucao/decisoes-arquiteturais.md).

## Segurança

**RNF-04 — Transporte cifrado entre nó e broker**
Alvo: comunicação MQTT entre ESP32 e broker deve ser cifrada (TLS), já que os nós publicam pela internet pública (broker gerenciado) e não apenas em rede local.
**Estado real:** 🟡 parcial — o cliente usa `WiFiClientSecure` com `espClient.setInsecure()`, ou seja, a conexão é cifrada mas **a validação do certificado do broker está desabilitada**. Isso protege contra escuta passiva na rede, mas não contra um ataque ativo de *man-in-the-middle* com certificado forjado. **Risco aceito conscientemente no estágio atual** (portfólio/desenvolvimento), com plano de mitigação registrado em ADR-006.

**RNF-05 — Autenticação e autorização de acesso ao backend**
Alvo: endpoints que expõem dados operacionais devem exigir autenticação.
**Estado real:** 🟡 parcial — existe um `AuthGuard`, mas ele hoje valida apenas a presença do header, não a validade do token (ver RF-08). **Não deve ser considerado controle de acesso efetivo ainda.**

**RNF-06 — Segredos fora do controle de versão**
Alvo: credenciais (Wi-Fi, MQTT, banco de dados) nunca devem estar hardcoded em código versionado.
**Estado real:** ✅ atendido pelo padrão adotado — `embedded/src/shared/secrets.h` é ignorado via `.gitignore` (existe `secrets_example.h` como template); `nest-node/.env` e `frontend/.env` seguem a mesma lógica com `.env.example`/variáveis via `ConfigService`.

## Escalabilidade

**RNF-07 — Adição de novos nós/sensores sem mudança estrutural**
Alvo: adicionar um novo ponto de coleta não deve exigir mudança de arquitetura, só um novo publisher MQTT e uma entrada na lista de tópicos conhecidos.
**Estado real:** ✅ atendido pelo desenho — a lista `SENSORS`/tópicos é a única coisa que precisa crescer (hoje duplicada entre `nest-node/src/modules/mqtt/sensors.ts` e `frontend/src/app/server/mqtt.ts` — ver observação de duplicação em decisões arquiteturais).

## Observabilidade

**RNF-08 — Rastreabilidade de eventos do sistema**
Alvo: eventos relevantes (conexão/desconexão do broker, falha de assinatura, mensagens recebidas) devem ficar registrados para diagnóstico.
**Estado real:** 🟡 parcial — o backend grava logs em arquivo local (`nest-node/logs/app.log` via `common/logger.ts`) e no console; não há logging estruturado, correlação de request, nem exportação para uma ferramenta de observabilidade centralizada (ex.: ELK, Grafana Loki). Suficiente para desenvolvimento; insuficiente para operação em produção com múltiplas plantas.

## Portabilidade

**RNF-09 — Ambiente de desenvolvimento reproduzível**
Alvo: qualquer desenvolvedor deve conseguir subir banco de dados e broker localmente sem depender de serviços de nuvem.
**Estado real:** ✅ atendido — `docker/docker-compose.yml` sobe PostgreSQL 15 e HiveMQ CE localmente; em paralelo, o ambiente descrito no README raiz também prevê um broker gerenciado (HiveMQ Cloud) para os nós de campo, já que ESP32 fala com a internet pública, não com a rede Docker local (ver [`04-Solucao/infraestrutura.md`](../04-Solucao/infraestrutura.md)).
