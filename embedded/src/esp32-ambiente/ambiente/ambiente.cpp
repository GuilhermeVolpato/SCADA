#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

#include "shared/NetworkManager.h" 

const char* TOPIC_TEMP = "miniscada/ambiente/temperatura";

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
    Serial.begin(115200);
    
    setupWifi(); 
    
    client.setServer(MQTT_SERVER, MQTT_PORT);
    
}

void loop() {
    if (!client.connected()) {
        reconnectMQTT(client, "ESP32Ambiente"); 
    }
    client.loop();

}