# SmartAir
# **Monitoraggio della Qualità dell'Aria con IoT**

## **Descrizione del Progetto**
Questo progetto è stato sviluppato per scopi universitari e si concentra sul monitoraggio della qualità dell'aria in determinati comuni. Utilizza dispositivi IoT per raccogliere dati relativi a:

- **CO2** (anidride carbonica)  
- **TVOC** (composti organici volatili totali)  
- **AQI** (indice di qualità dell'aria)  
- **Temperatura**  
- **Umidità**

### **Flusso del Sistema**
1. **Raccolta Dati:**  
   I dati vengono raccolti tramite sensori collegati a un dispositivo IoT.

2. **Trasmissione al Fog Node:**  
   I dati vengono inviati dal dispositivo IoT al **Fog Node** utilizzando **MQTT** con certificati per garantire la sicurezza della comunicazione.

3. **Pre-elaborazione nel Fog Node:**  
   Il **Fog Node** riceve i dati, li pre-elabora e li invia al cloud **Adafruit IO** tramite **API REST** utilizzando una chiave di autenticazione (**API Key**).

4. **Gestione sul Cloud (Adafruit IO):**  
   - **Salvataggio Dati:** Adafruit IO tiene traccia dei dati ricevuti.  
   - **Notifiche:** In caso di valori critici (es. alta concentrazione di CO2), il sistema invia una **notifica via email** per segnalare i problemi.  

5. **Accesso ai Dati:**  
   I dati vengono resi disponibili per un'applicazione web tramite l'API di **Adafruit IO**, consentendo agli utenti di monitorare la qualità dell'aria attraverso grafici e report.

---

## **Caratteristiche Principali**
- **Sicurezza:**  
  - Utilizzo di certificati TLS per la trasmissione dei dati tramite MQTT.  
  - Autenticazione tramite **API Key** per comunicare con Adafruit IO.

- **Pre-elaborazione Dati:**  
  Il Fog Node analizza e pre-elabora i dati prima di inviarli al cloud.

- **Notifiche in tempo reale:**  
  Adafruit IO invia email in caso di problemi rilevati nei dati (es. valori fuori soglia).

- **Piattaforma Web:**  
  I dati vengono resi disponibili su una piattaforma web per la visualizzazione da parte degli utenti finali.

---

## **Struttura del Sistema**
1. **Dispositivo IoT:**  
   - Hardware: Sensori di CO2, TVOC, temperatura e umidità.  
   - Protocollo: **MQTT** con certificati TLS.  

2. **Fog Node:**  
   - Software: Scritto in **Python**.  
   - Funzioni: Pre-elaborazione dati, invio sicuro ad Adafruit IO tramite HTTP POST.

3. **Cloud (Adafruit IO):**  
   - Salvataggio e gestione dati.  
   - Invio notifiche email.  
   - API per l'accesso ai dati.

4. **Piattaforma Web:**  
   - Presentazione dei dati con grafici e report.  
   - Accesso tramite API Key di Adafruit IO.

---

## **Setup del Progetto**

### **Requisiti**
- **Hardware:**  
  - Sensore di CO2.  
  - Sensore di TVOC.  
  - Sensore di temperatura e umidità.  
  - Scheda IoT compatibile (es. ESP32 o Raspberry Pi).  

- **Software:**  
  - Fog Node: Python 3 con librerie necessarie (es. `paho-mqtt`, `requests`).  
  - Cloud: Account su **Adafruit IO**.  

---

### **Istruzioni per l'Installazione**
1. **Configurazione del Dispositivo IoT:**  
   - Collega i sensori alla scheda IoT.  
   - Configura l'invio dei dati tramite MQTT.

2. **Configurazione del Fog Node:**  
   - Installa le dipendenze richieste con:  
     ```bash
     pip install paho-mqtt requests
     ```
   - Avvia lo script Python per ricevere i dati e inviarli ad Adafruit IO.

3. **Configurazione di Adafruit IO:**  
   - Crea un account su [Adafruit IO](https://io.adafruit.com/).  
   - Configura i feed per salvare i dati.  
   - Genera una **API Key** per autenticare le richieste.  

4. **Test del Sistema:**  
   - Invia dati di test dal dispositivo IoT.  
   - Verifica che i dati siano salvati su Adafruit IO e che le notifiche email funzionino.

---

## **Obiettivi Futuri**
- **Miglioramento della Sicurezza:**  
  - Implementazione di OAuth 2.0 per l'autenticazione.  
  - Utilizzo di crittografia end-to-end.

- **Estensione delle Funzionalità:**  
  - Supporto a più comuni per il monitoraggio distribuito.  
  - Integrazione con altre piattaforme cloud.  

- **Analisi Avanzata:**  
  - Applicazione di algoritmi di machine learning per rilevare pattern nei dati.  

---

## **Contributi**
Per contribuire al progetto, invia una pull request o contattaci tramite [email](mailto:tuoemail@example.com).

---

## **Licenza**
Questo progetto è distribuito sotto la licenza MIT. Per maggiori dettagli, consulta il file [LICENSE](./LICENSE).

---

## **Autori**
- Nome Cognome - [GitHub](https://github.com/tuousername)  
- Università degli Studi di ...

