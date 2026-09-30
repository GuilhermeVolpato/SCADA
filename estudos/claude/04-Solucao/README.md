# 04 — Solução

**Papel simulado:** Engenharia (Embarcados, Backend, Frontend)
**Pergunta que esta pasta responde:** onde está o código, e como cada parte foi implementada?

Esta pasta **não duplica** o código-fonte — ele já existe nas pastas reais do repositório (`embedded/`, `nest-node/`, `backend/`, `frontend/`, `mobile/`, `docker/`). O que está aqui é o mapa de leitura: estrutura de pastas, responsabilidade de cada módulo, e — seguindo o princípio de honestidade desta documentação — o status real de cada funcionalidade (implementada, parcial ou apenas planejada).

## Conteúdo

| Documento | Cobre |
|---|---|
| [`embarcado.md`](./embarcado.md) | [`embedded/`](../../embedded/) — firmware dos dois nós ESP32 |
| [`backend.md`](./backend.md) | [`nest-node/`](../../nest-node/) (backend principal) e [`backend/`](../../backend/) (scaffold `.NET`) |
| [`frontend.md`](./frontend.md) | [`frontend/`](../../frontend/) — dashboard Next.js |
| [`infraestrutura.md`](./infraestrutura.md) | [`docker/`](../../docker/) — banco de dados e broker local, como rodar tudo junto |

## Mapa do repositório

| Pasta real | Papel | Status geral |
|---|---|---|
| `embedded/` | Firmware dos nós de borda (ESP32) | ✅ Funcional (BLE planejado) |
| `nest-node/` | Backend principal (NestJS) | 🟡 Módulos existem; persistência e autenticação reais ainda faltam |
| `backend/` | Scaffold `.NET`, sem função ativa | ⚪ Ver [`ADR-003`](../03-Projeto-Solucao/decisoes-arquiteturais.md#adr-003) |
| `frontend/` | Dashboard web (Next.js) | 🟡 Dashboard funcional; demais páginas são placeholder |
| `mobile/` | Aplicativo mobile | ⚪ Apenas intenção registrada, sem código |
| `docker/` | Infraestrutura local (Postgres + broker MQTT) | ✅ Funcional |

Para o "porquê" por trás de cada uma dessas decisões, ver [`03-Projeto-Solucao`](../03-Projeto-Solucao/README.md).
