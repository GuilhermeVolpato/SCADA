/*
  Complete Getting Started Guide: https://RandomNerdTutorials.com/esp32-bluetooth-low-energy-ble-arduino-ide/
  Based on Neil Kolban example for IDF: https://github.com/nkolban/esp32-snippets/blob/master/cpp_utils/tests/BLE%20Tests/SampleServer.cpp
  Ported to Arduino ESP32 by Evandro Copercini
*/

#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>

// See the following for generating UUIDs:
// https://www.uuidgenerator.net/

//Em seguida, você precisa definir um UUID para o Serviço e a Característica.
#define SERVICE_UUID "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"

void setup() {
  Serial.begin(115200);
  Serial.println("Starting BLE work!");
  //Em seguida, você cria um dispositivo BLE chamado “ MyESP32 ”. 
  // Você pode alterar esse nome para o que quiser.
  BLEDevice::init("MyESP32");

  // você configura o dispositivo BLE como servidor.;
  BLEServer *pServer = BLEDevice::createServer();

  // você cria um serviço para o servidor BLE com o UUID definido anteriormente.
  BLEService *pService = pServer->createService(SERVICE_UUID);

  //você define a característica para esse serviço. Como você pode ver, 
  // você também usa o UUID definido anteriormente e precisa passar como argumentos as propriedades 
  // da característica. Nesse caso, são: READ e WRITE.
  BLECharacteristic *pCharacteristic = pService->createCharacteristic(
    CHARACTERISTIC_UUID,
    BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE);

  // After creating the characteristic, you can set its value with the
  pCharacteristic->setValue("Hello World says Neil");

  // pode iniciar o serviço e a publicidade, para que outros dispositivos BLE possam escanear 
  // e encontrar este dispositivo BLE.
  pService->start();
  // BLEAdvertising *pAdvertising = pServer->getAdvertising();  // this still is working for backward compatibility
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);  // functions that help with iPhone connections issue
  pAdvertising->setMinPreferred(0x12);
  BLEDevice::startAdvertising();
  Serial.println("Characteristic defined! Now you can read it in your phone!");
}

void loop() {
  // put your main code here, to run repeatedly:
  delay(2000);
}