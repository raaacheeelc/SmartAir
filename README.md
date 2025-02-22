# SmartAir
## Monitoraggio della Qualità dell'Aria con IoT

### Descrizione del Progetto
Questo progetto, sviluppato per scopi universitari, monitora la qualità dell'aria in determinati comuni. Utilizza dispositivi IoT per raccogliere dati relativi a:

- **CO2** (anidride carbonica)  
- **TVOC** (composti organici volatili totali)  
- **AQI** (indice di qualità dell'aria)  
- **Temperatura**  
- **Umidità**  

### Flusso del Sistema
1. **Raccolta Dati:** Sensori IoT raccolgono le informazioni ambientali.
2. **Trasmissione al Fog Node:** I dati vengono inviati via **MQTT con certificati TLS** al **Fog Node**.
3. **Elaborazione nel Fog Node:** Il Fog Node pre-elabora i dati e li invia ad **Adafruit IO** tramite **API REST**.
4. **Gestione sul Cloud (Adafruit IO):** Salvataggio dati e invio di notifiche email in caso di valori critici.
5. **Accesso ai Dati:** L’API di Adafruit IO permette il monitoraggio tramite un'applicazione web.

---

## Caratteristiche Principali
- **Sicurezza:**  
  - **TLS su MQTT** per proteggere i dati in transito.  
  - **ACL nel broker MQTT** per garantire accesso limitato ai soli dispositivi autorizzati.  
  - **API Key per autenticazione con Adafruit IO**.  

- **Pre-elaborazione dati:** Il Fog Node filtra ed elabora i dati prima dell’invio al cloud.  

- **Notifiche in tempo reale:**  
  - Se i valori di CO2 o TVOC superano una soglia critica, Adafruit IO invia email automatiche.  

- **Containerizzazione con Docker:**  
  - Il **Fog Node** e il **Broker MQTT** vengono eseguiti in **container Docker**.  

---

## Struttura del Sistema

1. **Dispositivo IoT:**  
   - Hardware: Sensori di CO2, TVOC, temperatura e umidità.  
   - Protocollo: **MQTT con certificati TLS**.  

2. **Fog Node:**  
   - Eseguito in un container Docker.  
   - Software: Scritto in **Python**.  
   - Funzioni: Pre-elaborazione dati, invio ad Adafruit IO via API.  

3. **Broker MQTT:**  
   - **Mosquitto MQTT** in un container Docker.  
   - Configurato con **ACL per l’accesso sicuro**.  

4. **Cloud (Adafruit IO):**  
   - Salvataggio dati.  
   - API per la consultazione dei dati.  

5. **Piattaforma Web:**  
   - Grafici e report sui dati raccolti.  

---

## Setup del Progetto

### Requisiti
- **Hardware:**  
  - Sensori CO2, TVOC, temperatura, umidità.  
  - **ESP32 o Raspberry Pi**.  

- **Software:**  
  - Docker e Docker Compose.  
  - Python 3 + librerie (`paho-mqtt`, `requests`).  
  - Account su **Adafruit IO**.  

---

### Istruzioni per l'Installazione e Avvio

#### 1. Clonare la Repository
Scaricare il codice dal repository GitHub:  
```bash
git clone https://github.com/raaacheeelc/SmartAir.git
cd SmartAir
```

#### 2. Configurare il Fog Node e il Broker MQTT
Il **Fog Node** e il **Broker MQTT** vengono eseguiti all’interno di container Docker.

- **Creazione dei container:**  
  ```bash
  docker-compose up -d
  ```
- **Verifica dello stato dei container:**  
  ```bash
  docker ps
  ```

#### 3. Configurazione di Adafruit IO
- Creare un account su [Adafruit IO](https://io.adafruit.com/).  
- Configurare i feed per salvare i dati.  
- Generare una **API Key** per autenticare le richieste.  

#### 4. Utilizzo dei file Docker per il Fog Node e il Broker MQTT
All'interno della repository è presente il file `docker-compose.yml`, che definisce i servizi Docker necessari.

- **Broker MQTT (Mosquitto):**
  - Il file `mosquitto.conf` specifica le ACL e la configurazione della persistenza.
  - I certificati TLS sono utilizzati per proteggere la comunicazione.

- **Fog Node:**
  - Il file `Dockerfile` definisce l'ambiente di esecuzione per il nodo di pre-elaborazione.
  - Il codice Python esegue l'acquisizione dati, l'elaborazione e l'invio ad Adafruit IO.

#### 5. Avviare il Fog Node
Se non viene avviato automaticamente dal container, eseguire:  
```bash
python fog_node.py
```

#### 6. Verificare il Funzionamento
- Inviare dati di test dal dispositivo IoT.
- Controllare che i dati vengano salvati su Adafruit IO.

---

## Obiettivi Futuri
- **Miglioramento della Sicurezza:**  
  - Implementazione di **OAuth 2.0**.  
  - **Crittografia end-to-end** per i dati raccolti.  

- **Estensione delle Funzionalità:**  
  - Supporto per il monitoraggio distribuito su più comuni.  
  - Integrazione con altri servizi cloud.  

- **Analisi Avanzata:**  
  - **Machine Learning** per il rilevamento di pattern nei dati.  

---

## Autori
- Alfonso Califano
- Rachele Capuano
- Università degli Studi di Salerno

