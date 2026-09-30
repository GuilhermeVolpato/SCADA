#include <BLEDevice.h>
#include <BLEBeacon.h>
#include <BLEAdvertising.h>
#include <BLEScan.h>
#include <BLEAdvertisedDevice.h>

/* 
  Beacon
Manufacturer ID
Subtype
Subtype Length
Proximity UUID
Major
Minor
Signal Power

iBeacon
│
├── UUID
│
├── Major
│
├── Minor
│
└── TX/Signal Power

pensar

UUID
→ "qual família/organização é essa?"

Major
→ "qual grupo?"

Minor
→ "qual dispositivo/local específico?"

UUID = Meu projeto
Major = prédio
Minor = sensor/beacon


*/

// para ter callbacks
class MyAdvertisedDeviceCallbacks
  : public BLEAdvertisedDeviceCallbacks {

  void onResult(BLEAdvertisedDevice device) {

    Serial.println(device.toString().c_str());
  }
};

void setAdvertisedDeviceCallbacks(
  BLEAdvertisedDeviceCallbacks* callbacks,
  bool wantDuplicates = false,
  bool shouldParse = true);



void setup() {
  Serial.begin(115200);

  BLEDevice::init("ESP32-Beacon");
  BLEScan* scanner = BLEDevice::getScan();
  BLEAdvertising* advertising = BLEDevice::getAdvertising();
  advertising->start();
  BLEAdvertisedDevice::getAddress()
    BLEAdvertisedDevice::getRSSI()
      BLEAdvertisedDevice::getName()
        BLEAdvertisedDevice::getManufacturerData()
          BLEDevice::startAdvertising();
  BLEDevice::stopAdvertising();
  scanner->setActiveScan(true);
  scanner->setAdvertisedDeviceCallbacks(
    new MyAdvertisedDeviceCallbacks());
  BLEScanResults* start(
    uint32_t duration,
    bool is_continue = false);


  BLEBeacon beacon;

  beacon.setProximityUUID(
    BLEUUID("12345678-1234-1234-1234-123456789abc"));

  beacon.setMajor(1);
  beacon.setMinor(10);
  beacon.setSignalPower(-59);

  /* getData()
  Retorna os dados internos do beacon em formato binário armazenado dentro de uma `String`.

  Essa função é particularmente importante quando você vai pegar o objeto:
'BLEBeacon'
  e colocá-lo dentro do advertising.
  */
  // getMajor()
  // getMinor()
  // getProximityUUID()
  // getSignalPower()
}

void loop() {

  // put your main code here, to run repeatedly:
  BLEScanResults* results = scanner->start(5);
  int count = results->getCount();
  Serial.println(count);

  BLEAdvertisedDevice device = results->getDevice(0);
  BLEAddress address = device.getAddress();

  Serial.println(address.toString().c_str());
  int rssi = device.getRSSI();
  if (device.haveRSSI()) {
    Serial.println(device.getRSSI());
  }

  if (device.haveManufacturerData()) {

    String data = device.getManufacturerData();

    Serial.println(data.length());
  }

  int tx = device.getTXPower();
}
