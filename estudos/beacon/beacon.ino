#include <BLEDevice.h>
#include <BLEBeacon.h>
#include <BLEAdvertising.h>
#include <BLEScan.h>
#include <BLEAdvertisedDevice.h>

// esp32 vai comunicar e receber dados bluetooth, alem de calcular distancia entre ele e outro esp32 por iBeacon

// Ponteiro global para permitir acesso ao scanner dentro da função loop()
BLEScan* pBLEScan;

class MyAdvertisedDeviceCallbacks : public BLEAdvertisedDeviceCallbacks {

  // Método sobrescrito executado ao encontrar um anúncio
  void onResult(BLEAdvertisedDevice advertisedDevice) override {
    // Imprime no monitor serial todas as informações básicas do dispositivo encontrado
    Serial.print("Dispositivo Encontrado via Callback: ");
    Serial.println(advertisedDevice.toString().c_str());
  }
};

void setup() {
  Serial.begin(115200);
  // iniciar o ble e dando um nome a ele
  BLEDevice::init("ESP32-ambiente");

  //Configuração do Receptor (Scanner)
  pBLEScan = BLEDevice::getScan();  // Obtém a instância do scanner BLE
  pBLEScan->setActiveScan(true);    // Active Scan solicita mais dados (Scan Response) dos transmissores
  pBLEScan->setInterval(100);       // Intervalo entre varreduras (em milissegundos)
  pBLEScan->setWindow(99);
  // Vincula a classe de callbacks ao scanner para ser notificado em tempo real
  pBLEScan->setAdvertisedDeviceCallbacks(new MyAdvertisedDeviceCallbacks(), true);

  // CONFIGURAÇÃO DO TRANSMISSOR
  // Obtém o objeto responsável pelo BLE Advertising
  BLEAdvertising* pAdvertising = BLEDevice::getAdvertising();

  // CONFIGURAR iBeacon

  // Cria o objeto que representa o nosso Beacon/iBeacon.
  // É através dele que vamos definir as informações que serão transmitidas.
  BLEBeacon oBeacon = BLEBeacon();

  // Define o identificador do fabricante do Beacon.
  // 0x004C é o identificador da Apple, utilizado pelo formato iBeacon.
  // É o Manufacturer ID que identifica o formato/fabricante do anúncio e não o UUID do esp.
  oBeacon.setManufacturerId(0x004C);

  // Define o grupo/categoria do Beacon.
  // Podemos usar o Major para identificar, por exemplo:
  // 1 = robôs do ambiente 1
  // 2 = robôs do ambiente 2
  // No nosso projeto, inicialmente todos os robôs terão Major = 1.
  oBeacon.setMajor(1);

  // Define o identificador individual do Beacon.
  // Aqui podemos identificar cada robô:
  // Robô 1 -> Minor = 1
  // Robô 2 -> Minor = 2
  // Robô 3 -> Minor = 3
  // Portanto, este ESP32 será o Robô 1.
  oBeacon.setMinor(1);

  // Define a potência de transmissão (TX Power) anunciada pelo Beacon.
  // Esse valor é utilizado posteriormente como referência para estimar
  // a distância entre o transmissor e o ESP32 que está escaneando.
  // Isso ainda NÃO calcula a distância.
  // É apenas um valor transmitido pelo Beacon que poderá ser usado
  // junto com o RSSI do scanner.
  oBeacon.setSignalPower(0xC5);

  // Define o UUID que identifica a nossa rede/grupo de Beacons.
  // Todos os robôs podem utilizar o mesmo UUID:
  // Robô 1 -> UUID igual
  // Robô 2 -> UUID igual
  // Robô 3 -> UUID igual
  // O que diferencia cada robô será principalmente o Minor.
  oBeacon.setProximityUUID(
    BLEUUID("12345678-1234-1234-1234-123456789abc"));


  // Cria os dados que serão colocados dentro do anúncio BLE.
  // Até aqui nós apenas montamos o objeto BLEBeacon.
  // Agora precisamos transformar esses dados em um anúncio
  // que será transmitido pelo ESP32.
  BLEAdvertisementData advertisementData;

  // Coloca os dados do Beacon dentro do Manufacturer Data.
  // O método getData() pega os dados configurados no BLEBeacon
  // (UUID, Major, Minor, Signal Power etc.) e retorna os bytes
  // que serão transmitidos no anúncio BLE.
  advertisementData.setManufacturerData(
    oBeacon.getData());

  // Entrega os dados que acabamos de montar para o objeto
  // responsável pelo Advertising.
  // BLEBeacon
  //     ↓
  // AdvertisementData
  //     ↓
  // BLEAdvertising
  // Agora o ESP32 sabe O QUE deve transmitir.
  pAdvertising->setAdvertisementData(
    advertisementData);


  // Inicia efetivamente a transmissão BLE.
  // A partir daqui, este ESP32 começa a anunciar o Beacon
  // para outros dispositivos BLE próximos.
  BLEDevice::startAdvertising();



  Serial.println("BLE Scanner + Transmissor inicializados.");
}

void loop() {
  Serial.println("INICIO DO SCAN");
  // Inicia o scan
  BLEScanResults* results = pBLEScan->start(5, false);

  // pegar qtd de dispositivos encontrados
  int count = results->getCount();
  Serial.print("DISPOSITIVOS ENCONTRADOS");
  Serial.println(count);

  if (count > 0) {

    // Pega o primeiro dispositivo encontrado
    BLEAdvertisedDevice device = results->getDevice(0);

    // ==========================================================
    // ENDEREÇO MAC
    // ==========================================================

    BLEAddress address = device.getAddress();

    Serial.print("Endereço MAC do 1º dispositivo: ");
    Serial.println(address.toString().c_str());

    // ==========================================================
    // RSSI
    // ==========================================================

    if (device.haveRSSI()) {

      Serial.print("Sinal (RSSI): ");
      Serial.print(device.getRSSI());
      Serial.println(" dBm");
    }

    // ==========================================================
    // NOME
    // ==========================================================

    if (device.haveName()) {

      Serial.print("Nome: ");
      Serial.println(device.getName().c_str());
    }

    // ==========================================================
    // MANUFACTURER DATA
    // ==========================================================

    if (device.haveManufacturerData()) {

      String data = device.getManufacturerData();

      Serial.print("Tamanho dos dados do Fabricante: ");
      Serial.print(data.length());
      Serial.println(" bytes");
    }

    // ==========================================================
    // TX POWER
    // ==========================================================

    if (device.haveTXPower()) {

      int tx = device.getTXPower();

      Serial.print("Power TX original: ");
      Serial.println(tx);
    }
  }

  // Limpa os resultados antes do próximo scan
  pBLEScan->clearResults();
}
