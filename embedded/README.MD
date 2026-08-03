# PROJETO ESP-32, MQTT, WIFI, BLE(BEACON)

## Montagem ESP-32 Monitoramento Ambiente
![Ambiente](./images/ambiente.png)

## Montagem ESP-32 Monitoramento Segurança
![Seguranca](./images/seguranca.png)

## Estrutura do projeto

Este repositório contém o firmware de **múltiplos ESP32** dentro do mesmo projeto PlatformIO. Cada placa é um *environment* separado no [platformio.ini](./platformio.ini):

- `ambiente` → código em [src/esp32-ambiente/ambiente/](./src/esp32-ambiente/ambiente/)
- `seguranca` → código em [src/esp32-seguranca/seguranca/](./src/esp32-seguranca/seguranca/)
- `src/shared/` → código comum, compilado por todos os environments

Ao adicionar uma nova placa: criar `src/esp32-<nome>/<nome>/<nome>.cpp` e um bloco `[env:<nome>]` no `platformio.ini` (só precisa declarar o que for diferente do `[env]` base — plataforma, board e libs comuns já são herdados).

## Como buildar/gravar um único ESP32

O PlatformIO, por padrão, builda **todos** os environments do `platformio.ini` quando você usa os botões da barra de status do VSCode ou roda `pio run` sem flags — não importa qual arquivo `.cpp` está aberto no editor. Para builda/gravar só uma placa, sempre especifique o environment com `-e`:

```bash
pio run -e ambiente                  # só compila
pio run -e ambiente -t upload        # compila e grava
pio run -e ambiente -t upload -t monitor   # grava e abre o serial monitor
pio run -e seguranca -t upload

pio device list                      # listar portas seriais conectadas
pio run -e ambiente -t upload --upload-port /dev/cu.usbserial-XXXX  # útil com 2+ ESP32 plugados ao mesmo tempo
```

Alternativa pelo VSCode: use o seletor de environment na barra de status (embaixo, ao lado dos ícones de Build/Upload) para trocar entre `ambiente` e `seguranca` antes de clicar nos botões.

## Instalar o PlatformIO CLI (`pio`) no terminal

A extensão do PlatformIO no VSCode já instala o `pio` dentro do seu próprio ambiente Python isolado (`penv`), mas ele não fica disponível no terminal por padrão. Para usar `pio run`, `pio device list`, etc. fora do VSCode, adicione o `penv` ao `PATH`:

### macOS / Linux

Adicione ao final do `~/.zshrc` (ou `~/.bashrc`, se usar bash):

```bash
export PATH="$HOME/.platformio/penv/bin:$PATH"
```

Depois recarregue o shell:

```bash
source ~/.zshrc
```

Confirme com `pio --version`.

### Windows

**PowerShell** — adicione ao perfil (`notepad $PROFILE` para editar):

```powershell
$env:Path += ";$env:USERPROFILE\.platformio\penv\Scripts"
```

Ou, para persistir permanentemente (não só na sessão atual), pelo painel do Windows:

1. Pesquisar "Variáveis de ambiente" no menu Iniciar → "Editar as variáveis de ambiente do sistema"
2. Em "Variáveis de usuário", selecionar `Path` → "Editar" → "Novo"
3. Adicionar: `%USERPROFILE%\.platformio\penv\Scripts`
4. Reabrir o terminal e confirmar com `pio --version`

Se o PlatformIO foi instalado em outro local (ex: via `pip install platformio` global, sem passar pela extensão), o executável pode já estar no `PATH` automaticamente — nesse caso `pio --version` já funciona sem nenhum passo acima.