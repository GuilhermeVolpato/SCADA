#ifndef NETWORK_MANAGER_H
#define NETWORK_MANAGER_H

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include "secrets.h"

const char* SSID = SECRET_SSID_WIFI;
const char* PASSWORD = SECRET_PASS_WIFI;
const char* SSID_MQTT = SECRET_SSID_MQTT;
const char* PASSWORD_MQTT = SECRET_PASS_MQTT;
const char* MQTT_SERVER = SECRET_MQTT_SERVER;
const int MQTT_PORT = SECRET_MQTT_PORT;

void setupWifi()
{
    delay(10);
    Serial.println();
    Serial.print("Conectando ao WiFi: ");
    Serial.println(SSID);
    Serial.println();
    Serial.print("Senha: ");
    Serial.println(PASSWORD);
    WiFi.begin(SSID, PASSWORD);

    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }

    Serial.println("\nWiFi conectado!");
    Serial.print("Endereço IP: ");
    Serial.println(WiFi.localIP());
}

void reconnectMQTT(PubSubClient &client, String baseClientId)
{
    while (!client.connected())
    {
        Serial.print("Tentando conexao MQTT...");

        String clientId = baseClientId + "-";
        clientId += String(random(0xffff), HEX);

        if (client.connect(clientId.c_str(), SSID_MQTT, PASSWORD_MQTT))
        {
            Serial.println("Conectado ao MQTT!");
        }
        else
        {
            Serial.print("Falha, rc=");
            Serial.print(client.state());
            Serial.println(" Tentando novamente em 5 segundos...");
            delay(5000);
        }
    }
}

void sendMQTTMessage(PubSubClient &client, const char *topic, const char *message)
{
    if (client.connected())
    {
        client.publish(topic, message);
        Serial.print("Mensagem enviada para o tópico ");
        Serial.print(topic);
        Serial.print(": ");
        Serial.println(message);
    }
    else
    {
        Serial.println("Cliente MQTT não conectado. Não foi possível enviar a mensagem.");
    }
}

void subscribeToMQTTTopic(PubSubClient &client, const char *topic)
{
    if (client.connected())
    {
        client.subscribe(topic);
        Serial.print("Inscrito no tópico: ");
        Serial.println(topic);
    }
    else
    {
        Serial.println("Cliente MQTT não conectado. Não foi possível se inscrever no tópico.");
    }
}

void receiveMQTTMessage(char *topic, byte *payload, unsigned int length)
{
    Serial.print("Mensagem recebida no tópico: ");
    Serial.println(topic);

    Serial.print("Mensagem: ");
    for (unsigned int i = 0; i < length; i++)
    {
        Serial.print((char)payload[i]);
    }
    Serial.println();
}

#endif