const axios = require("axios");
const express = require("express");
const adafruitRoute = express.Router();



adafruitRoute.get("/getData",async (req, res) => {
    const username = req.params.username;

    try {
        const response = await axios.get(
            `https://io.adafruit.com/api/v2/${username}/feeds/dispositivosmartairfisciano/data`,
            {
                headers: { "X-AIO-Key": process.env.ADAFRUIT_API_KEY },
            }
        );


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
