# Solução — Embarcados

Código real em [`embedded/`](../../embedded/). Este documento é um mapa de leitura, não uma cópia do código-fonte.

## Estrutura de pastas

```
embedded/
├── platformio.ini              # define os environments "ambiente" e "seguranca"
├── src/
│   ├── esp32-ambiente/ambiente/ambiente.cpp     # firmware do nó ambiente
│   ├── esp32-seguranca/seguranca/seguranca.cpp  # firmware do nó segurança
│   └── shared/
│       ├── NetworkManager.h     # setup de Wi-Fi + reconexão MQTT, comuns aos dois nós
│       ├── BleConfig.h          # configuração BLE (suporte ao roadmap de proximidade, RF-09)
│       └── secrets.h            # credenciais Wi-Fi/MQTT (git-ignored; ver secrets_example.h)
└── images/                      # fotos das montagens físicas
```

Cada `environment` do PlatformIO compila **apenas** sua própria pasta + `src/shared/` (`build_src_filter` em `platformio.ini`) — os dois firmwares nunca são linkados juntos.

## Nó `ambiente`

| Sensor | Pino | Tópico MQTT | Frequência |
|---|---|---|---|
| DHT11 (temperatura) | GPIO 2 | `miniscada/ambiente/temperatura` | a cada 2s |
| DHT11 (umidade) | GPIO 2 | `miniscada/ambiente/umidade` | a cada 2s |
| MQ-2 (gás, leitura analógica) | GPIO 34 | `miniscada/ambiente/gas` | a cada 2s (publica `"1"` acima do limiar 1500, `"0"` abaixo) |

Em falha de leitura do DHT11 (`isnan`), o nó publica `"Erro"` no tópico correspondente em vez de silenciar a leitura — decisão que prioriza sinalizar falha de sensor a simplesmente parar de publicar.

**BLE beacon:** existe um bloco inteiro de código (configuração de beacon BLE com UUID, major/minor) comentado no fim de `ambiente.cpp`, marcado com `// TODO - ESTUDAR CÓDIGO E IMPLEMENTAR BLE E BEACON!`. Não faz parte do binário compilado hoje — é o rascunho de RF-09.

## Nó `seguranca`

| Sensor | Pino | Tópico MQTT | Frequência |
|---|---|---|---|
| PIR (movimento) | GPIO 13 | `miniscada/seguranca/movimento` | a cada 150ms |
| Sensor de chama | GPIO 14 | `miniscada/seguranca/fogo` | a cada 150ms |

O ciclo é bem mais curto que o do nó `ambiente` (150ms vs. 2s) — decisão implícita no código que faz sentido para o domínio: movimento e fogo são eventos que exigem detecção mais rápida que variação de temperatura/umidade.

## Conexão e resiliência

Ambos os nós usam `src/shared/NetworkManager.h` para:
1. Conectar ao Wi-Fi (`setupWifi()`).
2. Conectar ao broker MQTT via TLS (`WiFiClientSecure` + `espClient.setInsecure()` — ver [`ADR-006`](../03-Projeto-Solucao/decisoes-arquiteturais.md#adr-006) sobre a validação de certificado desabilitada).
3. Reconectar automaticamente (`reconnectMQTT()`) sempre que `client.connected()` for falso, checado a cada iteração do `loop()`.

## Build e flash

```bash
pio run -e ambiente -t upload -t monitor     # nó de ambiente
pio run -e seguranca -t upload -t monitor    # nó de segurança
pio device list                              # identificar porta serial quando há 2+ ESP32 plugados
```

Detalhes completos (incluindo instalação do `pio` CLI fora do VSCode) em [`embedded/README.MD`](../../embedded/README.MD).

## Status consolidado

| Item | Status |
|---|---|
| Leitura e publicação MQTT (ambos os nós) | ✅ Implementado |
| Reconexão automática Wi-Fi/MQTT | ✅ Implementado |
| Beacon BLE (nó ambiente) | ⚪ Planejado (código comentado) |
| Scanner BLE / cálculo de RSSI (nó segurança) | ⚪ Planejado |
| Validação de certificado TLS do broker | ⚪ Planejado — hoje desabilitada (ver ADR-006) |
