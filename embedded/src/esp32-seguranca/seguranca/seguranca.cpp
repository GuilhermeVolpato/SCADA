#include <WiFi.h>
#include <PubSubClient.h>

#include "shared/NetworkManager.h"

WiFiClient espClient;
PubSubClient client(espClient);

const int SENSOR_PIR_PIN = 13;  
const int SENSOR_FOGO_PIN = 14;

void setup()
{
    Serial.begin(115200);
    pinMode(SENSOR_PIR_PIN, INPUT);
    pinMode(SENSOR_FOGO_PIN, INPUT);
    setupWifi();

    client.setServer(MQTT_SERVER, MQTT_PORT);
}

void loop()
{
    if (!client.connected())
    {
        reconnectMQTT(client, "ESP32Seguranca");
    }
    client.loop();

    int sensorValue = digitalRead(SENSOR_PIR_PIN);
    int sensorFogo = digitalRead(SENSOR_FOGO_PIN);

    if (sensorValue == HIGH)
    {
        sendMQTTMessage(client, "miniscada/seguranca/movimento", "1");
    }
    else
    {
        sendMQTTMessage(client, "miniscada/seguranca/movimento", "0");
    }

    if (sensorFogo == HIGH)
    {
        sendMQTTMessage(client, "miniscada/seguranca/fogo", "1");
    }
    else
    {
        sendMQTTMessage(client, "miniscada/seguranca/fogo", "0");
    }

    delay(150);
}