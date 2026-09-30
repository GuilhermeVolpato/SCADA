# Visão de Produto — Sentinela SCADA

## Pitch

> Para pequenas e médias operações industriais que não têm monitoramento automatizado de ambiente e segurança, o **Sentinela SCADA** é uma plataforma de supervisão de baixo custo que coleta variáveis críticas (gás, temperatura, umidade, fogo, movimento) em tempo real e as expõe em um dashboard web — diferente de um SCADA industrial tradicional (Wonderware/AVEVA, Ignition, Siemens WinCC), que exige licenciamento caro, hardware proprietário e semanas de integração.

## Problema de negócio em uma frase

Plantas pequenas correm risco operacional (incêndio, vazamento de gás, intrusão) sem instrumentação alguma, porque a única alternativa de mercado hoje foi desenhada — em preço e complexidade — para plantas grandes. Ver [`02-Problema`](../02-Problema/README.md) para a análise completa.

## Mercado-alvo

| Segmento | Exemplos | Por que hoje não é atendido |
|---|---|---|
| Indústria de pequeno/médio porte | Metalúrgicas, marcenarias, oficinas mecânicas | Orçamento de automação limitado, sem equipe de TI/OT dedicada |
| Operações logísticas | Galpões, depósitos, centros de distribuição | Risco de incêndio e intrusão relevante, mas fora do escopo de SCADA "de processo" |
| Facilities / prédios comerciais e institucionais | Datacenters pequenos, prédios administrativos, escolas técnicas | Precisam de monitoramento pontual, não de uma planta de controle de processo completa |

## Posicionamento

| | SCADA industrial tradicional | Sensor IoT avulso (app de fabricante) | **Sentinela SCADA** |
|---|---|---|---|
| Custo de entrada | Alto (licença + CLP + integração) | Baixo, mas por sensor/aplicativo isolado | Baixo (hardware commodity + software próprio) |
| Integração entre sensores | Sim, mas requer projeto de automação | Não — cada sensor tem seu próprio app | Sim — todos os nós convergem para um único dashboard |
| Tempo de implantação | Semanas/meses | Minutos, mas sem visão consolidada | Dias — firmware + broker + dashboard já integrados |
| Extensibilidade (novos sensores/nós) | Alta, porém cara | Baixa (limitada ao fabricante) | Alta — arquitetura orientada a tópicos MQTT, novo nó = novo publisher |
| Público | Grandes plantas com equipe OT | Consumidor/pequeno negócio | PMEs industriais sem equipe OT dedicada |

## Proposta de valor por pilar

- **Redução de risco operacional:** detecção de gás inflamável, fogo e movimento não autorizado em tempo quase real, com histórico auditável.
- **Custo de entrada baixo:** hardware baseado em ESP32 e sensores comerciais (ver [`03-Projeto-Solucao/stack-tecnologica.md`](../03-Projeto-Solucao/stack-tecnologica.md)), sem licenciamento por tag/ponto como em SCADA tradicional.
- **Time-to-value curto:** broker MQTT + backend + dashboard já integrados de fábrica; adicionar um nó de sensor é publicar em um novo tópico, não um projeto de integração.

## Critérios de sucesso do produto (North Star hipotético)

Como não há usuários reais neste estágio (projeto de portfólio), os critérios abaixo são o que **seria** medido em um lançamento real — registrados para mostrar como o sucesso do produto seria avaliado, não como métricas já coletadas:

1. **Tempo até o primeiro alerta útil** (da instalação do primeiro nó ao primeiro alerta acionável no dashboard) — meta hipotética: < 1 dia.
2. **Taxa de falsos positivos em alertas críticos** (fogo/gás) — quanto menor, maior a confiança operacional no sistema.
3. **Disponibilidade da cadeia de telemetria** (nó → broker → backend → dashboard) — ver [`requisitos-nao-funcionais.md`](../02-Problema/requisitos-nao-funcionais.md).

## Fora de escopo (hoje)

- Controle de atuadores (o sistema é **supervisão**, não controle de processo — não há malha fechada).
- Integração com protocolos industriais legados (Modbus, OPC-UA, Profibus) — ver nota sobre o backend `.NET` em [`decisoes-arquiteturais.md`](../03-Projeto-Solucao/decisoes-arquiteturais.md).
- Aplicativo mobile nativo — hoje é apenas uma intenção registrada em [`mobile/README.MD`](../../mobile/README.MD); ver roteiro em [`04-Solucao/README.md`](../04-Solucao/README.md).
