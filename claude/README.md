# Documentação de Produto & Engenharia — Sentinela SCADA

O [README.md](../README.md) da raiz do repositório descreve o projeto do ponto de vista **técnico**: o que foi construído. Esta pasta documenta o que normalmente fica invisível em projetos pessoais — o raciocínio de **produto, negócio, arquitetura e engenharia** por trás das mesmas decisões, como seria produzido por um time de software house completo (Product Manager, Business/Requirements Analyst, Arquiteto de Software e Engenheiros).

O objetivo é duplo:

1. **Deixar rastreável o "porquê"** de cada decisão técnica — não só o "o quê".
2. Servir como evidência de que quem construiu o sistema também sabe **enquadrar um problema de negócio, levantar requisitos e desenhar arquitetura**, não só escrever código.

> Convenção: o codinome técnico do repositório é `mini-scada-industrial`. Para fins de narrativa de produto (personas, pitch, mercado), o sistema é tratado pelo nome comercial fictício **Sentinela SCADA** — um exercício de portfólio, não uma empresa real.

## Como navegar

A documentação segue o fluxo que um time de produto usaria do zero a um sistema em produção — cada pasta responde a uma pergunta:

| Pasta | Papel simulado | Pergunta que responde |
|---|---|---|
| [`01-Contexto/`](./01-Contexto/README.md) | Product Manager | Para quem estamos construindo e por quê isso importa? |
| [`02-Problema/`](./02-Problema/README.md) | Business/Requirements Analyst | Qual é o problema, com que dados, e o que precisa ser construído? |
| [`03-Projeto-Solucao/`](./03-Projeto-Solucao/README.md) | Arquiteto de Software | Como o sistema é desenhado para resolver isso? |
| [`04-Solucao/`](./04-Solucao/README.md) | Engenharia (Embarcados/Backend/Frontend) | Onde está o código, e como cada parte foi implementada? |

## Princípio de honestidade

Esta documentação descreve o estado **real** do repositório no momento em que foi escrita (data de referência: 2026-08-07) — incluindo partes incompletas, decisões provisórias e dívidas técnicas conhecidas. Cada requisito e cada componente de arquitetura é marcado com um status:

- ✅ **Implementado** — existe no código e funciona conforme descrito.
- 🟡 **Parcial** — existe estrutura/esqueleto no código, mas a lógica de negócio ainda não está completa.
- ⚪ **Planejado** — decisão tomada, ainda não implementado.

Marcar o que *não* está pronto é parte deliberada do exercício: um analista ou arquiteto sênior distingue estado atual de estado desejado, em vez de apresentar tudo como concluído.
