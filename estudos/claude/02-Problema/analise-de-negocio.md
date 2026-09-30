# Análise de Negócio

## O problema

Operações industriais de pequeno e médio porte convivem, no dia a dia, com riscos ambientais e de segurança (vazamento de gás inflamável, princípio de incêndio, movimento não autorizado em áreas restritas) sem qualquer instrumentação automatizada. A detecção depende de rondas manuais, faro humano ou sorte. Quando existe algum sensor isolado (detector de fumaça, sensor de gás doméstico), ele é local, sem histórico, sem integração e sem alerta remoto.

O oposto — um SCADA industrial completo — resolve o problema tecnicamente, mas é dimensionado (em custo de licença, hardware proprietário e prazo de integração) para plantas de grande porte com equipe de OT dedicada. Isso deixa uma lacuna de mercado: negócios pequenos demais para justificar um SCADA tradicional, mas grandes/perigosos demais para operar sem nenhuma supervisão.

## Contexto regulatório (Brasil)

O ambiente citado nas personas ([`01-Contexto/personas-stakeholders.md`](../01-Contexto/personas-stakeholders.md)) opera sob Normas Regulamentadoras do Ministério do Trabalho e Emprego que tornam esse problema não apenas operacional, mas de conformidade legal:

- **NR-12** — Segurança no Trabalho em Máquinas e Equipamentos.
- **NR-23** — Proteção Contra Incêndios.
- **NR-33** — Segurança e Saúde em Espaços Confinados (relevante para monitoramento de gases).

Essas normas reforçam a necessidade de **registro histórico e rastreável** de condições de risco — não bastaria um alerta sonoro isolado sem persistência; é isso que orienta o requisito não funcional de rastreabilidade em [`requisitos-nao-funcionais.md`](./requisitos-nao-funcionais.md) e a escolha de um banco de dados relacional para o histórico de leituras em [`03-Projeto-Solucao/arquitetura.md`](../03-Projeto-Solucao/arquitetura.md).

## Dimensão do problema (dados de referência)

> **Nota de rigor metodológico:** os números abaixo são estimativas de ordem de grandeza, baseadas em fontes públicas conhecidas (Anuário Estatístico de Acidentes do Trabalho — AEAT/INSS; Ministério do Trabalho e Emprego). Este é um projeto de portfólio, não um estudo de mercado validado — os valores exatos **devem ser reconferidos em fonte oficial atualizada** antes de serem citados como dado firme (ex.: em uma entrevista ou pitch real). O objetivo aqui é demonstrar a metodologia de sustentar um problema de produto com dados, não apresentar um número definitivo.

- O Brasil registra, oficialmente, algumas centenas de milhares de acidentes de trabalho por ano (via CAT — Comunicação de Acidente de Trabalho), com uma fração relevante ligada a incêndio, exposição a agentes químicos/gases e falhas de segurança patrimonial — exatamente as categorias que os sensores deste projeto endereçam (gás, fogo, movimento).
- Acidentes não notificados (trabalho informal, subnotificação) tendem a ser significativamente maiores que o número oficial — o que reforça que o problema é maior no segmento de pequenas operações, justamente o público-alvo do produto.
- Cada parada não planejada por incidente de segurança tem custo direto (dano, interrupção de produção) e indireto (multa por não conformidade, aumento de prêmio de seguro, exposição legal) — o argumento de ROI para a persona "Renata" (ver personas) se apoia nesse custo evitado, não apenas no preço do sistema.

## Situação atual (as-is) vs. proposta (to-be)

| Dimensão | As-is (hoje, sem o produto) | To-be (com Sentinela SCADA) |
|---|---|---|
| Detecção de risco | Manual, dependente de ronda humana | Automática, contínua, near real-time via MQTT |
| Registro de eventos | Inexistente ou em planilha manual | Histórico persistido em banco de dados (auditável) |
| Tempo de resposta a incidente | Minutos a horas (depende de quem está por perto) | Segundos (alerta chega ao dashboard assim que o nó publica) |
| Custo de entrada | Alto, se via SCADA tradicional; nulo, mas sem cobertura, se via "nenhuma solução" | Baixo — hardware commodity + software aberto |
| Evidência de conformidade (NR-12/23/33) | Fraca — depende de checklist manual | Forte — log de eventos com timestamp |

## Análise SWOT (simplificada)

| Forças | Fraquezas |
|---|---|
| Custo de hardware muito baixo (ESP32 + sensores comerciais) | Sensores de baixo custo têm precisão/robustez inferior a sensores industriais certificados |
| Arquitetura desacoplada (MQTT) facilita adicionar novos nós/sensores | Sem certificação para uso em área classificada (ATEX/Ex) — limita uso em ambientes com atmosfera explosiva real |
| Time-to-market rápido para MVP | Time de um único desenvolvedor — sem escala de suporte/operação ainda |

| Oportunidades | Ameaças |
|---|---|
| Segmento de PMEs industriais mal atendido por SCADA tradicional | Fabricantes de sensores IoT "prontos" (ex.: soluções de segurança patrimonial) podem descer de mercado |
| Expansão natural para novos tipos de sensor/nó (arquitetura já é orientada a tópicos) | Concorrência de plataformas IoT genéricas (ex.: Home Assistant adaptado) com comunidade maior |

## Rastreabilidade: dor da persona → requisito

| Persona | Dor | Requisito relacionado |
|---|---|---|
| Marcos (Segurança do Trabalho) | Falta de histórico auditável de eventos de risco | RF-04, RF-05 (ver [`requisitos-funcionais.md`](./requisitos-funcionais.md)) |
| Renata (Gerente de Operações) | Falta de visibilidade em tempo real do estado da planta | RF-01, RF-02, RF-06 |
| Diego (Operador) | Alertas ambíguos, sem origem clara | RF-03 (convenção de tópico por área/sensor) |
