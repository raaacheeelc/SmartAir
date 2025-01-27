const axios = require("axios");
const { json } = require("body-parser");
const express = require("express");
const adafruitRoute = express.Router();

const data = [
    {
      "timestamp": "2025-01-25T14:00:00Z",
      "temperature": 22.5,
      "tvoc": 120,
      "aqi": 45,
      "co2": 400,
      "humidity": 55
    },
    {
      "timestamp": "2025-01-25T14:10:00Z",
      "temperature": 23.0,
      "tvoc": 130,
      "aqi": 50,
      "co2": 410,
      "humidity": 58
    }
  ]
  
  const aioKey = "aio_njFo663mRN3N0a5Rq7lPbpcT2whz"; // API Key
  const username = "acalifano"; // Nome utente Adafruit IO
  const groupKey = "dispositivosmartairfisciano"; // Chiave del gruppo


adafruitRoute.get("/getData",async (req, res) => {
    

    try {
        const url = "https://io.adafruit.com/api/v2/acalifano/groups/dispositivosmartairfisciano/feeds/h/data";
    
        // Invio della richiesta GET con il token nell'header
        
            const response = await axios.get(url, {
              headers: {
                "X-AIO-Key": aioKey, // Header per autenticare la richiesta
              },
            });
        
    

        console.log("DATI ",response.data);


        // Processa i dati ricevuti
        const processedData = response.data.map((entry) => ({
            timestamp: entry.created_at,
            temperature: parseFloat(entry.value.split(",")[0]), // Supponendo che i valori siano separati da virgola
            tvoc: parseFloat(entry.value.split(",")[1]),
            aqi: parseFloat(entry.value.split(",")[2]),
            co2: parseFloat(entry.value.split(",")[3]),
            humidity: parseFloat(entry.value.split(",")[4]),
        }));

        res.json(processedData);
    } catch (error) {
        console.error("Errore durante il recupero dei dati:", error);
        res.status(500).json({ error: "Errore durante il recupero dei dati" });
    }
});

module.exports = { adafruitRoute };
