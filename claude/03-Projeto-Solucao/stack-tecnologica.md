# Stack Tecnológica

Cada tecnologia listada é a que **de fato está** no repositório (verificada em `package.json`, `.csproj`, `platformio.ini` e código-fonte) — não uma lista aspiracional. Status segue a mesma convenção do restante da documentação.

## Camada de Borda (Embarcados)

| Tecnologia | Papel | Por que essa escolha |
|---|---|---|
| ESP32 (Espressif) | Microcontrolador dos dois nós de borda | Wi-Fi e BLE integrados nativamente, custo baixo, comunidade grande, suficiente para um nó de sensor com rádio |
| C/C++ (Arduino framework) | Linguagem de firmware | Framework Arduino sobre ESP32 reduz boilerplate de baixo nível (drivers, RTOS) mantendo controle direto de hardware |
| PlatformIO | Build system / gerenciador de ambientes | Permite dois firmwares (`ambiente`, `seguranca`) no mesmo repositório, cada um como `[env:...]` isolado, compartilhando código comum em `src/shared/` |
| PubSubClient | Cliente MQTT em C++ | Biblioteca padrão de fato para MQTT em Arduino/ESP32, leve o suficiente para um microcontrolador |
| DHT11 | Sensor de temperatura/umidade | Sensor comercial de baixo custo, resolução suficiente para monitoramento ambiental (não para controle de processo de precisão) |
| MQ-2 | Sensor de gás inflamável/fumaça (analógico) | Sensor de baixo custo amplamente disponível para detecção de gases combustíveis |
| PIR (HC-SR501 ou similar) | Sensor de movimento | Detecção de presença simples, digital, baixo consumo |
| Sensor de chama (IR) | Detecção de fogo | Sensor digital de baixo custo, resposta rápida a chama aberta |
| BLE (biblioteca ESP32 BLE) | Beacon/proximidade entre nós | ⚪ Planejado — código existe comentado em `ambiente.cpp`, não compilado no firmware atual |

## Camada de Mensageria

| Tecnologia | Papel | Por que essa escolha |
|---|---|---|
| MQTT (protocolo) | Transporte pub/sub entre nós, backend e frontend | Protocolo leve, desenhado para dispositivos restritos e redes instáveis — desacopla produtores de consumidores por tópico, sem exigir que o ESP32 saiba quem consome o dado |
| HiveMQ Cloud | Broker gerenciado para os nós de campo | Os ESP32 falam com a internet pública (não uma rede Docker local); um broker gerenciado evita operar infraestrutura de mensageria própria para os nós reais |
| HiveMQ CE (Community Edition) | Broker local para desenvolvimento | Roda via `docker-compose`, permite desenvolver/testar backend e frontend sem depender do broker de produção |

## Camada de Backend e Dados

| Tecnologia | Papel | Por que essa escolha |
|---|---|---|
| NestJS (TypeScript) | Framework do backend principal (`nest-node/`) | Estrutura modular (módulos/providers/guards) madura o suficiente para separar claramente `mqtt`, `telemetry`, `dashboard` e `auth` como responsabilidades distintas |
| `mqtt` (npm, Eclipse Paho-like client) | Cliente MQTT do backend | Assinatura dos tópicos publicados pelos nós, para eventualmente centralizar ingestão (RF-07) |
| TypeORM | ORM / mapeamento objeto-relacional | Integração nativa com NestJS (`@nestjs/typeorm`), migrations e entidades tipadas em TypeScript |
| PostgreSQL 15 | Banco de dados relacional | Histórico de leituras é dado tabular com forte necessidade de consulta por intervalo de tempo/dispositivo — um relacional atende bem sem a complexidade operacional de um banco de séries temporais dedicado, adequado à escala atual do projeto |
| `class-validator` / `class-transformer` | Validação de payloads da API | Validação declarativa de DTOs (`CreateTelemetryDto`) integrada ao pipe de validação do NestJS |
| `.NET 10` (ASP.NET Core minimal API) | Backend alternativo (`backend/`) | ⚪ Não está no caminho de dados atual — permanece no repositório como spike técnico. Ver ADR-003 para a decisão sobre seu futuro |

## Camada de Supervisão (Frontend)

| Tecnologia | Papel | Por que essa escolha |
|---|---|---|
| Next.js 16 (App Router) | Framework do dashboard web | Permite rota de servidor (`api/sensors/route.ts`) e cliente (`dashboard/page.tsx`) no mesmo projeto, sem precisar de um backend HTTP separado só para expor os dados MQTT ao navegador |
| React 19 | Biblioteca de UI | Base do Next.js; hooks (`useState`/`useEffect`) usados para polling e atualização da tela |
| `mqtt` (npm) | Cliente MQTT usado no lado servidor do Next.js | Conecta diretamente ao broker via WebSocket para alimentar `/api/sensors` — ver discussão em [`decisoes-arquiteturais.md`](./decisoes-arquiteturais.md#adr-005) |
| Tailwind CSS 4 | Estilização | Estilização utilitária rápida para um dashboard funcional sem investimento em design system próprio nesta fase |
| axios | Cliente HTTP | Dependência presente para chamadas HTTP a serem usadas quando o frontend passar a consumir a API do backend NestJS (RF-07) |

## Infraestrutura

| Tecnologia | Papel | Por que essa escolha |
|---|---|---|
| Docker / Docker Compose | Orquestração local de dependências (Postgres + HiveMQ CE) | Ambiente de desenvolvimento reproduzível sem instalar banco/broker na máquina do desenvolvedor (RNF-09) |

## Roadmap tecnológico (não implementado)

| Tecnologia | Papel pretendido | Status |
|---|---|---|
| React Native (ou equivalente) | Aplicativo mobile | ⚪ Apenas uma pergunta em aberto no README de `mobile/` |
| Protocolo industrial legado (Modbus/OPC-UA) | Integração com CLPs/sensores industriais existentes em plantas maiores | ⚪ Não iniciado — ver ADR-003 sobre o papel latente do backend `.NET` nesse cenário |
