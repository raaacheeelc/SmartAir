import paho.mqtt.client as mqtt
import os
import csv
import time
import threading
import requests
import json
import ssl
import warnings
warnings.filterwarnings("ignore", category=DeprecationWarning)

MQTTversion = mqtt.MQTTv31
TLS_protocol_version = ssl.PROTOCOL_TLSv1_2

# Parametri di connessione MQTT
MQTT_BROKER = "mqtt.smartair"  
MQTT_PORT = 8883  
MQTT_TOPIC = "testTopic"

# Percorsi dei certificati
CA_CERT = "/certs/ca.crt"         
FOGNODE_CERT = "/certs/fognode.crt" 
FOGNODE_KEY = "/certs/fognode.key" 

# Definizione dei range validi per ciascun parametro
VALID_RANGES = {
    "AQI": (0,1),
    "TVOC": (0, 300),
    "CO2": (360, 1000), #https://www.pce-italia.it/html/dati-tecnici-1/link/definizione-qualita-aria-co2.htm
    "t": (-10, 50),
    "h": (40, 100)   
}

# Carica le configurazioni dal file
with open('/config_fog_node/config.json', 'r') as config_file:
    config = json.load(config_file)
 
ADAFRUIT_API_KEY = config['ADAFRUIT_AIO_KEY']
ADAFRUIT_USERNAME = config['ADAFRUIT_AIO_USERNAME']

# Mapping dei feed Adafruit
ADAFRUIT_FEEDS = {
    "AQI": "AQI",
    "TVOC": "TVOC",
    "CO2": "CO2",
    "t": "t",
    "h": "h"
}

DATA_FILE = "sensor_data.csv"

# buffer per accumulare i dati
data_buffer = {key: [] for key in VALID_RANGES.keys()}

# lock per gestire accessi concorrenti al buffer 
buffer_lock = threading.Lock()

# funzione per calcolare la media tra i dati
def calculate_average(data_list):
    if not data_list:
        return None
    return sum(data_list) / len(data_list)

def save_data_to_csv(data):
    file_exists = os.path.exists(DATA_FILE)

    with open(DATA_FILE, mode="a", newline="") as file:
        print("apro il file csv")
        writer = csv.DictWriter(file, fieldnames=data.keys())

        if not file_exists:
            writer.writeheader()

        writer.writerow(data)
    print(f"Dati salvati nel file: {DATA_FILE}")
    
def aggregate_and_send():
    while True:
        time.sleep(180)  # Aspetta 3 minuti

        # Calcola la media dei dati raccolti nel buffer
        aggregated_data = {}
        with buffer_lock:
            for key, values in data_buffer.items():
                avg_value = calculate_average(values)
                if avg_value is not None:
                    aggregated_data[key] = avg_value
            for key in data_buffer.keys():
                data_buffer[key] = []

        # Invia i dati aggregati al cloud
        if aggregated_data:
            save_data_to_csv(aggregated_data)
            print(f"[INFO] Dati aggregati: {aggregated_data}")
            send_to_adafruit(aggregated_data) 
        else:
            print("[INFO] Nessun dato da inviare")

# avvia il thread per l'aggregazione e l'invio
threading.Thread(target=aggregate_and_send, daemon=True).start()

# Funzione per filtrare i dati che non si trovano in un determinato range
def is_valid(data, min, max):
    return min <= data <= max

def filter_sensor_data(data):
    filtered_data = {}
    for key, (min, max) in VALID_RANGES.items():
        value = data.get(key)
        if value  and is_valid(value, min , max):
            filtered_data[key] = value
        else: 
            print(f"[WARNING] {key.capitalize()} fuori range: {value}, valore scartato")
    return filtered_data


# Funzione per inviare dati al Cloud
def send_to_cloud(data):
    try:
        response = requests.post(CLOUD_URL, json=data)
        response.raise_for_status()
        print("Dati inviati al cloud con successo")
    except requests.exceptions.RequestException as e:
        print(f"Errore nell'invio dei dati al cloud: {e}")    



# Funzione di callback per quando arriva un messaggio
def on_message(client, userdata, msg):
    try:
        payload = msg.payload.decode()
        print(f"Dati ricevuti: {payload}")

        data = json.loads(payload)

        filtered_data = filter_sensor_data(data)

        if filtered_data:
            print(f"Dati filtrati: {filtered_data}")
            send_to_adafruit(filtered_data)

            # aggiungi i dati filtrati al buffer
            with buffer_lock:
                for key, value in filtered_data.items():
                    if key in data_buffer:
                        data_buffer[key].append(value)
        else: 
            print("[INFO] Nessun dato valido")
    except json.JSONDecodeError:
        print("[ERROR] Payload non è un JSON valido")
    except Exception as e:
        print(f"[ERROR] Errore durante la gestione del messaggio: {e}")

# Funzione di connessione
def on_connect(client, userdata, flags, rc):
    print(f"Connessione avvenuta con codice di risposta {rc}")
    # Iscrizione al topic dopo la connessione
    client.subscribe(MQTT_TOPIC)


def send_to_adafruit(data):
    for key, value in data.items():
        feed_key = ADAFRUIT_FEEDS.get(key)
        if not feed_key:
            print(f"[WARNING] Nessun feed configurato per {key}")
            continue

        feed_url =  "https://io.adafruit.com/api/v2/acalifano/groups/dispositivosmartairfisciano/data"
        headers = {
            "X-AIO-Key": ADAFRUIT_API_KEY,
            "Content-Type": "application/json"
        }
        try:
            response = requests.post(feed_url, headers=headers, json={
                "feeds": [
                    {
                    "key": feed_key,
                    "value": value
                    }
                ]
            })
            if response.status_code == 200:
                print(f"Dati per {key} inviati correttamente al feed {feed_key}!")
            else:
                print(f"Errore nell'invio di {key}: {response.status_code}, {response.text}")
        except requests.exceptions.RequestException as e:
            print(f"Errore nell'invio dei dati a Adafruit: {e}")

# Configurazione client MQTT
client = mqtt.Client()

# Configura i certificati TLS/SSL
client.tls_set(
    ca_certs=CA_CERT,
    certfile=FOGNODE_CERT,
    keyfile=FOGNODE_KEY,
    tls_version=ssl.PROTOCOL_TLSv1_2
)

client.on_message = on_message
client.connect(MQTT_BROKER, MQTT_PORT)

# Sottoscriviti al topic desiderato
client.subscribe(MQTT_TOPIC)

print("In ascolto su MQTT...")
client.loop_forever()