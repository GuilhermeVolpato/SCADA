#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

#include "shared/NetworkManager.h"

WiFiClientSecure espClient;
PubSubClient client(espClient);

const int DHTPIN = 2;
const int DHTTYPE = DHT11;
const int GAS_SENSOR_PIN = 34;

DHT dht(DHTPIN, DHTTYPE);

void setup()
{
    Serial.begin(115200);
    pinMode(GAS_SENSOR_PIN, INPUT);

    setupWifi();
    espClient.setInsecure();
    client.setServer(MQTT_SERVER, MQTT_PORT);
    dht.begin();
}

void loop()
{
    if (!client.connected())
    {
        reconnectMQTT(client, "ESP32Ambiente");
    }
    client.loop();

    float temperatura = dht.readTemperature();
    float umidade = dht.readHumidity();
    float gasLevel = analogRead(GAS_SENSOR_PIN);
    printf("Nível de gás: %.2f\n", gasLevel);
    printf("Nível de temperatura: %.2f\n", temperatura);
    printf("Nível de umidade: %.2f\n", umidade);

    if (isnan(temperatura) || isnan(umidade))
    {
        Serial.println("Erro ao ler o sensor DHT");
        if (isnan(umidade))
            sendMQTTMessage(client, "miniscada/ambiente/temperatura", "Erro");
        if (isnan(temperatura))
            sendMQTTMessage(client, "miniscada/ambiente/umidade", "Erro");
    }

    sendMQTTMessage(client, "miniscada/ambiente/temperatura", String(temperatura).c_str());
    sendMQTTMessage(client, "miniscada/ambiente/umidade", String(umidade).c_str());



    if (gasLevel > 1500)
    {
        sendMQTTMessage(client, "miniscada/ambiente/gas", "1"); 
    }
    else
    {
        sendMQTTMessage(client, "miniscada/ambiente/gas", "0");
    }

    delay(2000);
}


// TODO - ESTUDAR CÓDIGO E IMPLEMENTAR BLE E BEACON!

// #include "BLEDevice.h"
// #include "BLEUtils.h"
// #include "BLEServer.h"
// #include "BLEBeacon.h"
// #include <BLEScan.h>
// #include <BLEAdvertisedDevice.h>


// /* GPIO onde está o LED a ser piscado para indicar funcionamento
// (breathing light) */
// #define GPIO_BREATHING_LIGHT 2 /* 2 é o GPIO que está ligado o LED já contido na placa */

// /* Para gerar uma UUID, uma sugestão é utilizar o site a seguir:
// https://www.uuidgenerator.net/
// */

// /* UUID do Beacon BLE (128 bits) */
// /*
//  * Importante: o UUID tem seu endian invertido quando lido em um app qualquer para scan BLE.
//  * Logo, esse UUID será lido como: 0ffcd8742d3d-75a3-7f40-e78a-7035c02f
//  */

// #define BEACON_UUID "2fc03570-8ae7-407f-a375-3d2d74d8fc0f"

// /* IMPORTANTE: o código/ID do fabricante é um identificador único, registrado no
// Bluetooth SIG (Special Interest Group). Logo, trata-se de um identificador
// globalmente conhecido. Para fins de teste utilize um ID qualquer mas,
// em caso de fazer um produto comercial, NUNCA UTILIZE UM ID DE UMA EMPRESA
// OU FABRICANTE QUE NÃO SEJA A SUA. Isso poderá levar a problemas legais.
// Aqui, neste exemplo, a finalidade é de aprendizado somente.
// */
// /* Lista com fabricantes registrados na SIG:
// https://www.bluetooth.com/specifications/assigned-numbers/company-identifiers/
// Importante: o código deve ser usado nesse programa com endian diferente do oferecido na lista
// Por exemplo, se na lista o fabricante está como 0x1234, deve ser usado aqui como
// 0x3412.
// */
// #define ID_FABRICANTE_BEACON 0x4C00

// /* Major e Minor do Beacon (assumindo 1 grupo (major) com 1 beacon somente (minor) */
// #define MAJOR_BEACON 1
// #define MINOR_BEACON 1

// /* Dados do beacon (tipo, fabricante, uuid, major, minor e tx power) */
// #define BEACON_DATA ""
// #define BEACON_DATA_SIZE 26
// #define BEACON_DATA_TYPE 0xFF /* Ver: https://www.bluetooth.com/specifications/assigned-numbers/generic-access-profile/ */

// /* Objeto global para gerar o advertising do BLE */
// BLEAdvertising *pAdvertising; // BLE Advertisement type

// /* Protótipos */
// void configura_beacon(void);

// /* Função: configura o Beacon BLUE
//    Parâmetros: nenhum
//    Retorno: nenhum
// */

// void configura_beacon(void)
// {
//     /* Cria um objeto para gerenciar o Beacon */
//     BLEBeacon ble_beacon = BLEBeacon();

//     /* Código/ID do fabricante */
//     /* IMPORTANTE: o código/ID do fabricante é um identificador único, registrado no
//        Bluetooth SIG (Special Interest Group). Logo, trata-se de um identificador
//        globalmente conhecido. Para fins de teste utilize um ID qualquer mas,
//        em caso de fazer um produto comercial, NUNCA UTILIZE UM ID DE UMA EMPRESA
//        OU FABRICANTE QUE NÃO SEJA A SUA. Isso poderá levar a problemas legais.
//        Aqui, neste exemplo, a finalidade é de aprendizado somente.
//      */
//     ble_beacon.setManufacturerId(ID_FABRICANTE_BEACON);

//     ble_beacon.setProximityUUID(BLEUUID(BEACON_UUID));
//     ble_beacon.setMajor(MAJOR_BEACON);
//     ble_beacon.setMinor(MINOR_BEACON);

//     BLEAdvertisementData advertisement_data = BLEAdvertisementData();
//     BLEAdvertisementData scan_response_data = BLEAdvertisementData();

//     advertisement_data.setFlags(0x04);

//     std::string strServiceData = "";
//     strServiceData += (char)BEACON_DATA_SIZE;
//     strServiceData += (char)BEACON_DATA_TYPE;
//     strServiceData += ble_beacon.getData();

//     advertisement_data.addData(strServiceData);


//     pAdvertising->setAdvertisementData(advertisement_data);
//     pAdvertising->setScanResponseData(scan_response_data);
// }

// void setup()
// {
//     Serial.begin(115200);
//     Serial.println("Fazendo inicializacao do beacon...");

//     /* Configura breathing light */
//     pinMode(GPIO_BREATHING_LIGHT, OUTPUT);
//     digitalWrite(GPIO_BREATHING_LIGHT, LOW);

//     /* Cria e configura um device e server BLE */
//     BLEDevice::init("ESP32 - Beacon BLE");
//     BLEServer *pServer = BLEDevice::createServer();

//     pAdvertising = BLEDevice::getAdvertising();
//     BLEDevice::startAdvertising();

//     configura_beacon();

//     /* Começa a funcionar como beacon (advertiser entra em ação) */
//     pAdvertising->start();

//     Serial.println("O beacon foi inicializado e ja esta operando.");
// }

// /* Loop principal: apenas pisca LED ligado ao GPIO definido em GPIO_BREATHING_LIGHT
//    para indicar que ESP32 está ligado */
// void loop()
// {
//     digitalWrite(GPIO_BREATHING_LIGHT, LOW);
//     delay(500);
//     digitalWrite(GPIO_BREATHING_LIGHT, HIGH);
//     delay(500);
// }



