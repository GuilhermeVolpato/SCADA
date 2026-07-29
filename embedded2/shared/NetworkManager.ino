#ifndef NETWORK_MANAGER_H
#define NETWORK_MANAGER_H

#include <WiFi.h>
#include <PubSubClient.h>

// --- Credenciais e Configurações Globais ---
const char* SSID = "SSID_WIFI";
const char* PASSWORD = "SENHA_WIFI";
const char* MQTT_SERVER = "broker.hivemq.com";
const int MQTT_PORT = 1883;

// Função reutilizável para conectar ao Wi-Fi
void setupWifi() {
    delay(10);
    Serial.println();
    Serial.print("Conectando ao WiFi: ");
    Serial.println(SSID);
    
    WiFi.begin(SSID, PASSWORD);
    
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    
    Serial.println("\nWiFi conectado!");
    Serial.print("Endereço IP: ");
    Serial.println(WiFi.localIP());
}

// Função reutilizável para reconectar ao MQTT
// Passamos o cliente por referência (&) e um prefixo de ID
void reconnectMQTT(PubSubClient &client, String baseClientId) {
    while (!client.connected()) {
        Serial.print("Tentando conexao MQTT...");
        
        // Gera um ID único para evitar conflitos no HiveMQ
        String clientId = baseClientId + "-";
        clientId += String(random(0xffff), HEX);
        
        if (client.connect(clientId.c_str())) {
            Serial.println("Conectado ao MQTT!");
        } else {
            Serial.print("Falha, rc=");
            Serial.print(client.state());
            Serial.println(" Tentando novamente em 5 segundos...");
            delay(5000);
        }
    }
}

#endif