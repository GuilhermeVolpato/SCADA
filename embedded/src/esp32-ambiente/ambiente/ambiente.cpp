#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

#include "shared/NetworkManager.h"

WiFiClient espClient;
PubSubClient client(espClient);

const int DHTPIN = 4;      
const int DHTTYPE = DHT11;

DHT dht(DHTPIN, DHTTYPE);

void setup()
{
    Serial.begin(115200);

    setupWifi();

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

    if (isnan(temperatura) || isnan(umidade))
    {
        Serial.println("Erro ao ler o sensor DHT");
        delay(2000);
        return;
    }

    sendMQTTMessage(client, "miniscada/ambiente/temperatura", String(temperatura).c_str());
    sendMQTTMessage(client, "miniscada/ambiente/umidade", String(umidade).c_str());

    delay(250); 
}