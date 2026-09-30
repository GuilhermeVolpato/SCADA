# Solução — Infraestrutura e Execução

Arquivo real em [`docker/docker-compose.yml`](../../docker/docker-compose.yml).

## Serviços locais

| Serviço | Imagem | Porta | Papel |
|---|---|---|---|
| `db` | `postgres:15` | `5432` | Banco relacional para persistência (hoje só a entidade `users` está modelada — ver [`backend.md`](./backend.md)) |
| `mqtt` | `hivemq/hivemq-ce:latest` | `1883` | Broker MQTT local para desenvolvimento, alternativa ao HiveMQ Cloud usado pelos nós físicos |

```bash
docker compose -f docker/docker-compose.yml up
```

Volumes nomeados (`postgres_data`, `mqtt_data`) persistem dados entre reinícios dos containers.

## Subindo o sistema completo localmente

1. **Infraestrutura:** `docker compose -f docker/docker-compose.yml up` (Postgres + HiveMQ CE).
2. **Backend:** `cd nest-node && npm install && npm run start:dev` — aponte `MQTT_HOST`/`DB_HOST` (em `.env`) para os serviços acima (`localhost` se rodando fora do Docker).
3. **Frontend:** `cd frontend && npm install && npm run dev` — aponte `SECRET_MQTT_*` para o mesmo broker.
4. **Nós de borda (opcional, requer hardware):** `pio run -e ambiente -t upload` / `pio run -e seguranca -t upload`, com `embedded/src/shared/secrets.h` apontando Wi-Fi + broker (local, se os ESP32 estiverem na mesma rede, ou o broker gerenciado, se não).

## Por que dois brokers na história do projeto (local vs. gerenciado)

Os nós ESP32 físicos precisam de um broker acessível pela internet pública — não conseguem alcançar o `mqtt` do `docker-compose` a menos que estejam na mesma rede local que a máquina rodando os containers. Por isso o projeto opera com dois brokers possíveis, dependendo se quem está consumindo é hardware físico remoto ou o backend/frontend em desenvolvimento local — ver [`ADR-004`](../03-Projeto-Solucao/decisoes-arquiteturais.md#adr-004).

## Segredos e configuração

Nenhum segredo real deve estar versionado. Padrão adotado no repositório:

| Local | Arquivo real (git-ignored) | Template versionado |
|---|---|---|
| Embarcados | `embedded/src/shared/secrets.h` | `secrets_example.h` |
| Backend | `nest-node/.env` | `.env.example` |
| Frontend | `frontend/.env` | — |

## O que falta para um ambiente "de produção" real

Esta lista existe para deixar explícito o gap entre "roda localmente para desenvolvimento" e "pronto para operar em uma planta real" — coerente com o princípio de honestidade de status usado no resto desta documentação:

- Observabilidade centralizada (hoje: log em arquivo local, ver [`RNF-08`](../02-Problema/requisitos-nao-funcionais.md)).
- Backend com estado compartilhado entre instâncias (hoje: cache MQTT em memória por processo, ver [`RNF-03`](../02-Problema/requisitos-nao-funcionais.md)).
- Validação de certificado TLS no firmware (hoje: desabilitada, ver [`ADR-006`](../03-Projeto-Solucao/decisoes-arquiteturais.md#adr-006)).
- Pipeline de CI/deploy — não existe automação de build/deploy no repositório hoje.
