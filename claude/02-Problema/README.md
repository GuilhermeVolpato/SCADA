# 02 — Problema

**Papel simulado:** Business/Requirements Analyst
**Pergunta que esta pasta responde:** qual é o problema, com que dados, e o que precisa ser construído?

Enquanto [`01-Contexto`](../01-Contexto/README.md) estabelece a visão de produto, esta pasta faz o trabalho de analista: sustenta o problema com dados, mapeia o cenário atual vs. o desejado, e traduz tudo isso em requisitos rastreáveis — a base para as decisões de arquitetura em [`03-Projeto-Solucao`](../03-Projeto-Solucao/README.md).

## Conteúdo

| Documento | Conteúdo |
|---|---|
| [`analise-de-negocio.md`](./analise-de-negocio.md) | O problema, contexto regulatório (NRs), dados de mercado, SWOT, situação atual vs. proposta |
| [`requisitos-funcionais.md`](./requisitos-funcionais.md) | O que o sistema deve fazer, em histórias de usuário rastreadas até persona e componente |
| [`requisitos-nao-funcionais.md`](./requisitos-nao-funcionais.md) | Como o sistema deve se comportar (desempenho, disponibilidade, segurança, observabilidade) — com o estado real observado no código |

## Por que separar "problema" de "solução"

É comum, em projetos técnicos, pular direto para "o que construir" sem documentar "por que isso é um problema que vale resolver". Esta pasta existe para forçar essa etapa: cada requisito em `requisitos-funcionais.md` é rastreável até uma dor concreta de uma persona definida em [`01-Contexto/personas-stakeholders.md`](../01-Contexto/personas-stakeholders.md), não uma feature que "parecia legal implementar".
