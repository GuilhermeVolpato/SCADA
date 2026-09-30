# Solução — Frontend

Código real em [`frontend/`](../../frontend/). Este documento mapeia a estrutura, não repete o código.

## Estrutura de pastas

```
frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx                # landing page (placeholder)
│   │   ├── layout.tsx / globals.css
│   │   ├── dashboard/page.tsx      # dashboard funcional (client component)
│   │   ├── sensors/page.tsx        # placeholder
│   │   ├── reports/page.tsx        # placeholder
│   │   ├── api/sensors/route.ts    # route handler que expõe getLatestSensorValues()
│   │   └── server/mqtt.ts          # cliente MQTT do lado servidor do Next.js
│   └── components/
│       ├── button/
│       └── header/
```

## Como o dashboard funciona hoje

`server/mqtt.ts` cria (lazy, via `getMqttClient()`) uma conexão MQTT sobre WebSocket diretamente com o broker HiveMQ (`SECRET_MQTT_SERVER`, porta WebSocket em `SECRET_MQTT_WEBSOCKET_PORT`), assina `miniscada/#` (todos os tópicos do projeto) e mantém as últimas leituras em um `Map` no processo do servidor Next.js.

`api/sensors/route.ts` expõe esse `Map` como JSON via `GET /api/sensors`.

`dashboard/page.tsx` é um client component que faz `fetch("/api/sensors")` a cada 2 segundos (`setInterval`) e renderiza um card por sensor (rótulo, último valor, horário da leitura).

**Isso significa que o frontend não depende do backend NestJS para funcionar** — é uma decisão de arquitetura registrada e discutida em [`ADR-005`](../03-Projeto-Solucao/decisoes-arquiteturais.md#adr-005), não um detalhe de implementação incidental.

## Páginas ainda não implementadas

- `sensors/page.tsx` e `reports/page.tsx` existem como rotas válidas do App Router, mas renderizam apenas texto estático de placeholder — correspondem a [`RF-10`](../02-Problema/requisitos-funcionais.md).
- `page.tsx` (home) também é o conteúdo padrão gerado, sem link efetivo para `/dashboard`.

## Componentes

`components/button` e `components/header` existem como base de design system, ainda não integrados às páginas funcionais além do necessário.

## Variáveis de ambiente

| Variável | Papel |
|---|---|
| `SECRET_MQTT_SERVER` | Host do broker MQTT |
| `SECRET_MQTT_PORT` | Porta MQTT padrão (referência; não é a usada pela conexão WebSocket) |
| `SECRET_MQTT_WEBSOCKET_PORT` | Porta WebSocket usada pela conexão real (`mqtt.connect`) |
| `SECRET_SSID_MQTT` / `SECRET_PASS_MQTT` | Credenciais do broker |

## Rodando localmente

```bash
cd frontend
npm install
npm run dev      # http://localhost:3000/dashboard
```

Requer que as variáveis `SECRET_MQTT_*` apontem para um broker acessível (local via `docker/docker-compose.yml` ou o HiveMQ Cloud usado pelos nós reais) — ver [`infraestrutura.md`](./infraestrutura.md).

## Status consolidado

| Item | Status |
|---|---|
| Conexão MQTT via WebSocket + exposição via API route | ✅ Implementado |
| Dashboard com leituras em near real-time (polling) | ✅ Implementado |
| Consumo da API do backend NestJS (em vez do broker direto) | ⚪ Planejado (ver ADR-005) |
| Página de detalhamento de sensores | ⚪ Planejado |
| Página de relatórios | ⚪ Planejado |
