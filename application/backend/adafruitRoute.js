const axios = require("axios");
const { json } = require("body-parser");
const express = require("express");

const adafruitRoute = express.Router();

// Array con i feed che vuoi recuperare
const feeds = ["t", "tvoc", "h", "co2", "aqi"];







adafruitRoute.get("/getTemperature",async (req, res) => {
    

    try {
        const url = "https://io.adafruit.com/api/v2/acalifano/groups/dispositivosmartairfisciano/feeds/t/data";

    
        // Invio della richiesta GET con il token nell'header
        
            const response = await axios.get(url, {
              headers: {
                "X-AIO-Key": process.env.ADAFRUIT_API_KEY, // Header per autenticare la richiesta
              },
            });
        
    

      //  console.log("DATI ",response.data);
      //  console.log("DATI ",response.data);


        // Processa i dati ricevuti
        const processedData = response.data.map((entry) => ({
            timestamp: entry.created_at,
            temperature: parseFloat(entry.value.split(",")[0]), // Supponendo che i valori siano separati da virgola
        }));

        res.json(processedData);
    } catch (error) {
        console.error("Errore durante il recupero dei dati:", error);
        res.status(500).json({ error: "Errore durante il recupero dei dati" });
    }
});


adafruitRoute.get("/getUmidita",async (req, res) => {
    

  try {
      const url = "https://io.adafruit.com/api/v2/acalifano/groups/dispositivosmartairfisciano/feeds/h/data";
  
      // Invio della richiesta GET con il token nell'header
      
          const response = await axios.get(url, {
            headers: {
              "X-AIO-Key": process.env.ADAFRUIT_API_KEY, // Header per autenticare la richiesta
            },
          });
      
  

    //  console.log("DATI ",response.data);


      // Processa i dati ricevuti
      const processedData = response.data.map((entry) => ({
          timestamp: entry.created_at,
          humidity: parseFloat(entry.value.split(",")[0]), // Supponendo che i valori siano separati da virgola
      }));

      res.json(processedData);
  } catch (error) {
      console.error("Errore durante il recupero dei dati:", error);
      res.status(500).json({ error: "Errore durante il recupero dei dati" });
  }
});

adafruitRoute.get("/getTVOC",async (req, res) => {
    

  try {
      const url = "https://io.adafruit.com/api/v2/acalifano/groups/dispositivosmartairfisciano/feeds/tvoc/data";
  
      // Invio della richiesta GET con il token nell'header
      
          const response = await axios.get(url, {
            headers: {
              "X-AIO-Key": process.env.ADAFRUIT_API_KEY, // Header per autenticare la richiesta
            },
          });
      
  

    //  console.log("DATI ",response.data);


      // Processa i dati ricevuti
      const processedData = response.data.map((entry) => ({
          timestamp: entry.created_at,
          tvoc: parseFloat(entry.value.split(",")[0]), // Supponendo che i valori siano separati da virgola

      }));

      res.json(processedData);
  } catch (error) {
      console.error("Errore durante il recupero dei dati:", error);
      res.status(500).json({ error: "Errore durante il recupero dei dati" });
  }
});

adafruitRoute.get("/getAQI",async (req, res) => {
    

  try {
      const url = "https://io.adafruit.com/api/v2/acalifano/groups/dispositivosmartairfisciano/feeds/aqi/data";
  
      // Invio della richiesta GET con il token nell'header
      
          const response = await axios.get(url, {
            headers: {
              "X-AIO-Key": process.env.ADAFRUIT_API_KEY, // Header per autenticare la richiesta
            },
          });
      
  

    //  console.log("DATI ",response.data);


      // Processa i dati ricevuti
      const processedData = response.data.map((entry) => ({
          timestamp: entry.created_at,
          aqi: parseFloat(entry.value.split(",")[0]), // Supponendo che i valori siano separati da virgola
      }));

      res.json(processedData);
  } catch (error) {
      console.error("Errore durante il recupero dei dati:", error);
      res.status(500).json({ error: "Errore durante il recupero dei dati" });
  }
});

adafruitRoute.get("/getCO2",async (req, res) => {
    

  try {
      const url = "https://io.adafruit.com/api/v2/acalifano/groups/dispositivosmartairfisciano/feeds/co2/data";
  
      // Invio della richiesta GET con il token nell'header
      
          const response = await axios.get(url, {
            headers: {
              "X-AIO-Key": process.env.ADAFRUIT_API_KEY, // Header per autenticare la richiesta
            },
          });
      
  

    //  console.log("DATI ",response.data);


      // Processa i dati ricevuti
      const processedData = response.data.map((entry) => ({
          timestamp: entry.created_at,
          co2: parseFloat(entry.value.split(",")[0]), // Supponendo che i valori siano separati da virgola
      }));

      res.json(processedData);
  } catch (error) {
      console.error("Errore durante il recupero dei dati:", error);
      res.status(500).json({ error: "Errore durante il recupero dei dati" });
  }
});





const fetchAllData = async(feedKey) =>{

  try {
    const url = `https://io.adafruit.com/api/v2/acalifano/groups/dispositivosmartairfisciano/feeds/${feedKey}/data`;

    // Invio della richiesta GET con il token nell'header

    const response = await axios.get(url, {
      headers: {
        "X-AIO-Key": process.env.ADAFRUIT_API_KEY, // Header per autenticare la richiesta
      },
    });

    // Mappare i dati in base al tipo di feed
    const processedData = response.data.map((entry) => {
      // Valori separati per feed
      const value = parseFloat(entry.value.split(",")[0]);
      return {
        timestamp: entry.created_at,
        [feedKey]: value, // Chiave dinamica basata sul feedKey
      };
    });

    return processedData;
  } catch (error) {
    console.error("Error retrieving data from feed:", error);
    throw new Error("Unable to fetch data from Adafruit IO feed");
  }
};


adafruitRoute.get("/allData", async (req, res) => {
  try {
    console.log("SONO QUI");


    // Chiamate parallele per ogni feed
    const requests = feeds.map((feedKey) => fetchAllData(feedKey));
    const results = await Promise.all(requests);

    // Aggregare i dati per ogni timestamp
    const aggregatedData = {};

    results.forEach((feedData, index) => {
      feedData.forEach((entry) => {
        const { timestamp, ...rest } = entry;

        // Se il timestamp non esiste, crealo
        if (!aggregatedData[timestamp]) {
          aggregatedData[timestamp] = { timestamp };
        }

        // Aggiungi il valore del feed alla riga corrispondente
        Object.assign(aggregatedData[timestamp], rest);
      });
    });

    // Converti l'oggetto aggregato in un array
    const data = Object.values(aggregatedData);

    console.log("DATI", data);

    // Rispondi con i dati
    res.json(data);
  } catch (errorData) {
    console.error("Errore durante l'aggregazione dei dati:", errorData);
    res.status(500).send(errorData);
  }
});


module.exports = { adafruitRoute };
