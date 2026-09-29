# Solução — Backend

Código real em [`nest-node/`](../../nest-node/) (backend principal) e [`backend/`](../../backend/) (scaffold `.NET`, ver [`ADR-003`](../03-Projeto-Solucao/decisoes-arquiteturais.md#adr-003)). Este documento mapeia a estrutura, não repete o código.

## Estrutura de pastas (`nest-node/`)

```
nest-node/
├── src/
│   ├── main.ts                        # bootstrap da aplicação Nest
│   ├── app.module.ts                  # módulo raiz
│   ├── config/
│   │   ├── configuration.ts           # leitura de variáveis de ambiente (mqtt, db, port)
│   │   └── typeorm.config.ts          # configuração de conexão TypeORM
│   ├── common/
│   │   ├── guards/auth.guard.ts       # guarda de autenticação (RF-08, parcial)
│   │   ├── filters/                   # tratamento de exceções HTTP e de conexão com banco
│   │   ├── interceptors/logging.interceptor.ts
│   │   └── logger.ts                  # log em arquivo (nest-node/logs/app.log)
│   ├── infrastructure/database/
│   │   ├── database.module.ts / database.providers.ts
│   │   ├── entities/user.entity.ts    # única entidade de domínio existente hoje
│   │   └── repositories/user.repository.ts
│   └── modules/
│       ├── mqtt/       # cliente MQTT + cache de últimas mensagens em memória
│       ├── telemetry/  # endpoint de ingestão HTTP (POST /telemetry)
│       ├── dashboard/  # endpoints de agregação para o frontend
│       └── auth/       # módulo de autenticação (esqueleto)
└── logs/app.log
```

## Módulo `mqtt`

`MqttService` conecta ao broker (`ConfigService` lê `MQTT_HOST`/`MQTT_PORT`/`MQTT_USERNAME`/`MQTT_PASSWORD`/`MQTT_CLIENT_ID`), assina a lista de tópicos definida em `modules/mqtt/sensors.ts`, e mantém as últimas mensagens recebidas em um `Map` em memória (`getLatestMessages()` / `getLatestMessage(topic)`). Expõe também `publish()` e `subscribe()` para uso por outros módulos.

**Limitação conhecida:** o cache em memória não sobrevive a um restart do processo nem é compartilhado entre instâncias — ver [`RNF-03`](../02-Problema/requisitos-nao-funcionais.md).

## Módulo `telemetry`

- `POST /telemetry` — recebe `{ deviceId, payload }` (validado via `class-validator`) e hoje **republica** a leitura no tópico `scada/telemetry` via `MqttService.publish()`. **Não grava em banco de dados** apesar do nome do módulo sugerir persistência — este é o gap coberto por [`RF-04`](../02-Problema/requisitos-funcionais.md).

## Módulo `dashboard`

Três endpoints (`GET /dashboard/snapshot`, `/live`, `/history`) que hoje retornam objetos com mensagens fixas (`"Conectado ao broker para visualização em tempo real"`, etc.) — **stubs de contrato de API**, não dados reais agregados de `MqttService` ou do banco. Definem a forma que a API deveria assumir quando RF-04/RF-07 forem implementados, mas não devem ser confundidos com uma feature funcional.

## Módulo `auth`

- `AuthGuard`: verifica apenas se o header `Authorization` está presente — não decodifica nem valida um JWT/token real.
- `UserEntity` + `UserRepository`: modelagem de usuário já pronta em `infrastructure/database`, mas sem um `AuthService`/`AuthController` que implemente login, hash de senha ou emissão de token.
- Ver [`nest-node/src/modules/auth/README.md`](../../nest-node/src/modules/auth/README.md) para a nota original do desenvolvedor sobre essa divisão entre módulo de negócio e camada de persistência.

## Configuração (variáveis de ambiente)

| Variável | Papel |
|---|---|
| `PORT` | Porta HTTP do NestJS |
| `MQTT_HOST`, `MQTT_PORT`, `MQTT_USERNAME`, `MQTT_PASSWORD`, `MQTT_CLIENT_ID` | Conexão com o broker MQTT |
| `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME` | Conexão com PostgreSQL |
| `DB_SYNCHRONIZE`, `DB_LOGGING` | Flags de comportamento do TypeORM (sincronização automática de schema, log de SQL) |

Ver `.env.example` em `nest-node/` para o template — nunca commitar `.env` com valores reais (ver [`RNF-06`](../02-Problema/requisitos-nao-funcionais.md)).

## Backend `.NET` (`backend/`)

Projeto ASP.NET Core (.NET 10) minimal API. Hoje contém somente o template padrão gerado por `dotnet new` (endpoint `/weatherforecast` de exemplo) — sem lógica de negócio do domínio SCADA. Seu papel futuro está em aberto e documentado em [`ADR-003`](../03-Projeto-Solucao/decisoes-arquiteturais.md#adr-003).

## Status consolidado

| Item | Status |
|---|---|
| Assinatura de tópicos MQTT e cache em memória | ✅ Implementado |
| Ingestão HTTP de telemetria (`POST /telemetry`) | 🟡 Parcial — recebe e valida, mas não persiste |
| Persistência de histórico em PostgreSQL | ⚪ Planejado |
| Endpoints de dashboard (`/dashboard/*`) | 🟡 Parcial — contrato definido, dados ainda estáticos |
| Autenticação real (login, validação de token) | ⚪ Planejado |
| Backend `.NET` | ⚪ Scaffold sem função ativa |
