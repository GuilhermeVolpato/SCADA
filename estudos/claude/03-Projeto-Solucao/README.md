# 03 — Projeto Solução

**Papel simulado:** Arquiteto de Software
**Pergunta que esta pasta responde:** como o sistema é desenhado para resolver o problema descrito em [`02-Problema`](../02-Problema/README.md)?

## Conteúdo

| Documento | Conteúdo |
|---|---|
| [`arquitetura.md`](./arquitetura.md) | Visão em camadas, diagramas de fluxo de dados (real e planejado), modelo de dados, visão de implantação |
| [`stack-tecnologica.md`](./stack-tecnologica.md) | Cada tecnologia presente no repositório, seu papel e a justificativa da escolha |
| [`decisoes-arquiteturais.md`](./decisoes-arquiteturais.md) | ADRs — decisões de arquitetura no formato Contexto → Decisão → Consequências, incluindo dívidas técnicas assumidas conscientemente |

## Como ler esta pasta

`arquitetura.md` dá a visão geral (o "mapa"); `stack-tecnologica.md` justifica cada peça do mapa; `decisoes-arquiteturais.md` registra os pontos de decisão onde havia mais de um caminho possível — inclusive os casos em que o caminho escolhido tem consequências conhecidas e ainda não resolvidas (ex.: duplicação entre frontend e backend no consumo de MQTT, certificado TLS não validado nos nós de borda). Um arquiteto sênior não esconde essas tensões — ele as torna visíveis e propõe o caminho de mitigação.
