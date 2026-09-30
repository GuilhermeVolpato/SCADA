# 01 — Contexto

**Papel simulado:** Product Manager
**Pergunta que esta pasta responde:** para quem estamos construindo, e por que isso importa?

Antes de qualquer linha de requisito ou arquitetura, um PM precisa deixar claro o contexto: qual é o produto, quem ele serve, e qual é a visão de médio prazo. É isso que está registrado aqui, para que as decisões nas pastas seguintes ([`02-Problema`](../02-Problema/README.md), [`03-Projeto-Solucao`](../03-Projeto-Solucao/README.md), [`04-Solucao`](../04-Solucao/README.md)) tenham uma referência comum em vez de serem justificadas caso a caso.

## Conteúdo

| Documento | Conteúdo |
|---|---|
| [`visao-de-produto.md`](./visao-de-produto.md) | Pitch do produto, proposta de valor, mercado-alvo, posicionamento vs. alternativas existentes |
| [`personas-stakeholders.md`](./personas-stakeholders.md) | Quem usa o sistema no dia a dia, quem decide comprá-lo, e quem constrói/mantém |

## Resumo executivo

O **Sentinela SCADA** é uma plataforma de monitoramento ambiental e de segurança industrial voltada para operações de pequeno e médio porte — plantas, galpões, oficinas e depósitos que hoje não têm nenhum tipo de supervisão automatizada porque as soluções de mercado (SCADA industrial tradicional: Wonderware/AVEVA, Ignition, Siemens WinCC) são dimensionadas — em custo, complexidade de implantação e exigência de infraestrutura — para grandes plantas, não para esse segmento.

A aposta de produto é: hardware de borda barato (ESP32 + sensores comerciais), protocolo leve (MQTT) e um backend/frontend web simples entregam boa parte do valor de monitoramento e alerta que uma planta pequena precisa, a uma fração do custo e do tempo de implantação de um SCADA tradicional.

Este documento e os dois seguintes tratam esse recorte como se fosse, de fato, um produto sendo levado a mercado — com personas, proposta de valor e critérios de sucesso — ainda que a implementação atual (ver [`04-Solucao`](../04-Solucao/README.md)) seja um MVP técnico com dois nós de sensor.
