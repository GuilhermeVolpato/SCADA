# Personas & Stakeholders

## Personas de uso (quem opera o sistema no dia a dia)

### Persona 1 — Marcos, Técnico de Segurança do Trabalho

- **Contexto:** responsável por segurança e conformidade em uma planta de ~40 funcionários. Reporta a gerência, não tem equipe de TI dedicada.
- **Dor:** precisa comprovar conformidade com Normas Regulamentadoras (NR-12, NR-23, NR-33 — ver [`02-Problema/analise-de-negocio.md`](../02-Problema/analise-de-negocio.md)) e hoje faz rondas manuais, sem registro automático de eventos de risco.
- **O que o Sentinela resolve:** histórico automático de eventos (gás, fogo, movimento fora de horário) substituindo checklist manual em papel/planilha.
- **O que ele NÃO quer:** outra ferramenta complexa que exija treinamento de dias — precisa de um dashboard que se leia em segundos.

### Persona 2 — Renata, Gerente de Operações / Planta

- **Contexto:** dona do orçamento, decide se compra o sistema. Preocupada com uptime da operação e custo de paradas não planejadas.
- **Dor:** um incidente não detectado a tempo (princípio de incêndio, vazamento) pode parar a planta por dias e gerar prejuízo muito maior que o custo do sistema de monitoramento.
- **O que o Sentinela resolve:** visibilidade em tempo real sem o custo/prazo de um projeto de automação industrial completo.
- **Critério de decisão de compra:** ROI claro — custo do sistema vs. custo esperado de um incidente não detectado (ver análise de negócio).

### Persona 3 — Diego, Operador de Chão de Fábrica

- **Contexto:** está fisicamente na planta, é quem reage primeiro a um alerta.
- **Dor:** alertas tardios ou ambíguos ("algo está errado em algum lugar da planta").
- **O que o Sentinela resolve:** alerta com origem clara (qual nó, qual sensor, qual severidade) — decisão de projeto refletida na convenção de tópicos MQTT por nó/sensor (`miniscada/<área>/<sensor>`, ver [`03-Projeto-Solucao/arquitetura.md`](../03-Projeto-Solucao/arquitetura.md)).

## Stakeholders do projeto (papéis simulados)

Como este é um projeto de portfólio construído por uma única pessoa, os papéis abaixo foram **assumidos sequencialmente** durante o desenvolvimento — listados separadamente para deixar explícito qual chapéu estava sendo usado em cada decisão, e onde essa decisão está documentada.

| Papel | Responsabilidade neste projeto | Onde o output desse papel vive |
|---|---|---|
| Product Manager | Definição de visão, personas, proposta de valor | [`01-Contexto`](./README.md) |
| Business/Requirements Analyst | Análise do problema, requisitos funcionais/não funcionais | [`02-Problema`](../02-Problema/README.md) |
| Arquiteto de Software | Desenho de arquitetura, decisões técnicas (ADRs) | [`03-Projeto-Solucao`](../03-Projeto-Solucao/README.md) |
| Engenheiro de Firmware/Embarcados | Implementação dos nós ESP32 | [`04-Solucao/embarcado.md`](../04-Solucao/embarcado.md) |
| Engenheiro Backend | Implementação da API, ingestão MQTT, persistência | [`04-Solucao/backend.md`](../04-Solucao/backend.md) |
| Engenheiro Frontend | Implementação do dashboard | [`04-Solucao/frontend.md`](../04-Solucao/frontend.md) |

## Matriz de interesse x influência (exercício de BA)

| Stakeholder | Interesse no sucesso | Influência sobre requisitos | Estratégia |
|---|---|---|---|
| Gerente de Operações (Renata) | Alto (ROI, continuidade operacional) | Alta (decide compra/adoção) | Manter informado com métricas de negócio (uptime, custo evitado) |
| Técnico de Segurança (Marcos) | Alto (uso diário, responsabilidade legal) | Média (usuário-chave, não decide orçamento) | Envolver diretamente na definição de UX dos alertas |
| Operador (Diego) | Médio (recebe alertas, não é dono do processo) | Baixa | Garantir clareza da interface, não sobrecarregar com decisões |
| Auditor/Órgão regulador (implícito) | Alto (conformidade) | Alta indireta (define requisitos não negociáveis) | Requisitos não funcionais de rastreabilidade/histórico atendem esse stakeholder mesmo sem contato direto |
