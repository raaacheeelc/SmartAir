#include "FS.h"
#include "SPIFFS.h"
#include <PubSubClient.h>
#include <WiFi.h>
#include <WiFiAP.h>
#include <WiFiClient.h>
#include <WiFiClientSecure.h>
#include <WiFiGeneric.h>
#include <WiFiMulti.h>
#include <WiFiSTA.h>
#include <WiFiScan.h>
#include <WiFiServer.h>
#include <WiFiType.h>
#include <WiFiUdp.h>


#include <Wire.h>
#include "ScioSense_ENS160.h"
#include <LiquidCrystal.h>
#include <ArduinoJson.h>

#define FORMAT_SPIFFS_IF_FAILED true

ScioSense_ENS160 ens160(ENS160_I2CADDR_1);

#include <Adafruit_AHTX0.h>
Adafruit_AHTX0 aht;


LiquidCrystal lcd(25, 26, 16, 17, 18, 19);

const char* ssid = "WIFI_SSD";
const char* password = "WIFI_PASS";

//Per la connessione con il broker
const char* mqtt_server = "SERVER MQTT";
const int mqtt_port = 8883;  // Porta per connessione TLS (La 1883 è non sicura e la usiamo per test)


WiFiClientSecure secureClient;
PubSubClient mqttClient(secureClient); 


void initWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi ..");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print('.');
    delay(1000);
  }
  Serial.println(WiFi.localIP());
  lcd.print(WiFi.localIP());
}


void listDir(fs::FS& fs, const char* dirname, uint8_t levels) {
  Serial.printf("Listing directory: %s\r\n", dirname);

  File root = fs.open(dirname);
  if (!root) {
    Serial.println("- failed to open directory");
    return;
  }
  if (!root.isDirectory()) {
    Serial.println(" - not a directory");
    return;
  }

  File file = root.openNextFile();
  while (file) {
    if (file.isDirectory()) {
      Serial.print("  DIR : ");
      Serial.println(file.name());
      if (levels) {
        listDir(fs, file.path(), levels - 1);
      }
    } else {
      Serial.print("  FILE: ");
      Serial.print(file.name());
      Serial.print("\tSIZE: ");
      Serial.println(file.size());
    }
    file = root.openNextFile();
  }
}


char* readFile(fs::FS &fs, const char *path) {
    Serial.printf("Leggendo file: %s\n", path);
    File file = fs.open(path);
    if (!file || file.isDirectory()) {
        Serial.println("- Impossibile aprire il file");
        return nullptr;
    }

    // Determina la dimensione del file
    size_t size = file.size();
    if (size == 0) {
        Serial.println("- File vuoto");
        return nullptr;
    }

    // Alloca dinamicamente memoria per il contenuto del file
    char* content = new char[size + 1]; // Aggiungi spazio per il terminatore null
    file.readBytes(content, size);
    content[size] = '\0'; // Terminatore null per la stringa
    file.close();

    // Stampa il contenuto letto
    Serial.println("- Contenuto letto dal file:");
    Serial.println(content);

    return content;
}

void reconnect() {
  // Loop per riconnettersi al broker se la connessione cade
  while (!mqttClient.connected()) {
    Serial.print("Connessione al broker MQTT...");
    // Connetti al broker (anonimamente)
    if (mqttClient.connect("Dispositivo")) {
      lcd.println("Connesso");
      Serial.println("Connesso!");
    } else {
      Serial.print("Fallito, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" Riprovo in 5 secondi...");
      lcd.println("Fallito, rc=");
      lcd.println(mqttClient.state());
      delay(5000);
    }
  }
}

void setup() {
  lcd.begin(16, 2);
  Serial.begin(9600);

  initWiFi();
  Serial.print("RRSI: ");
  Serial.println(WiFi.RSSI());

  if (!SPIFFS.begin(FORMAT_SPIFFS_IF_FAILED)) {
    Serial.println("SPIFFS Mount Failed");
    return;
  }


    char* ca_cert = readFile(SPIFFS, "/ca.crt");
    char* client_cert = readFile(SPIFFS, "/client.crt");
    char* private_key = readFile(SPIFFS, "/client.key");

        if (!ca_cert || !client_cert || !private_key) {
        Serial.println("Errore nella lettura dei certificati!");
        return;
    }


  // Configura il client TLS con i certificati
  secureClient.setCACert(ca_cert);
  secureClient.setCertificate(client_cert);
  secureClient.setPrivateKey(private_key);


  while (!Serial) {}
  ens160.begin();
  if (ens160.available()) {
    ens160.setMode(ENS160_OPMODE_STD);
  }

  while (!aht.begin()) {
    Serial.println("errore aht");
 
  }

  // Configura il broker MQTT
  // Configura il client MQTT
  mqttClient.setServer(mqtt_server, mqtt_port);
}


void loop() {

  lcd.setCursor(0, 0);
  if (ens160.available()) {
    ens160.measure(true);
    float aqi = ens160.getAQI();
    float tvoc = ens160.getTVOC();
    float eco2 = ens160.geteCO2();

    sensors_event_t hum, temp;
    aht.getEvent(&hum, &temp);
    float t1 = temp.temperature;
    float h1 = hum.relative_humidity;

    Serial.print("AQI: ");
    Serial.print(aqi);
    Serial.print("\t ");
    Serial.print("TVOC: ");
    Serial.print(tvoc);
    Serial.print(" ppb\t ");
    Serial.print("CO2: ");
    Serial.print(eco2);
    Serial.print(" ppm\t");
    Serial.print("t: ");
    Serial.print(t1);
    Serial.print(" C\t");
    Serial.print("h: ");
    Serial.print(h1);
    Serial.print(" %\n");

    lcd.print("TEMP:");
    lcd.print(t1);
    lcd.print(" C\t");
    lcd.setCursor(0, 1);
    lcd.print("CO2:");
    lcd.print(eco2);
    lcd.print(" ppm\t");

    String payload = "AQI: " + String(aqi) + "\t " + "TVOC: " + String(tvoc) + " ppb\t " + "CO2: " + String(eco2) + " ppm\t" + "t: " + String(t1) + " C\t" + "h: " + String(h1) + " %";


    StaticJsonDocument<200> doc;
    doc["AQI"] = aqi;
    doc["TVOC"] = tvoc;
    doc["CO2"] = eco2;
    doc["t"] = t1;
    doc["h"] = h1;

      // Serialize the JSON object to a string
    char jsonBuffer[512];
    serializeJson(doc, jsonBuffer);


    if (!mqttClient.connected()) {
      reconnect();
    }
    mqttClient.loop();


    Serial.println("Pubblico un messaggio...");
    mqttClient.publish("testTopic", jsonBuffer);
  }



  // Pubblica un messaggio su un topic


  delay(2000);
}
