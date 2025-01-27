const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();


app.get('/', (req, res) => {
    res.send('hello root node');// this gets executed when you visit http://localhost:3000/
})

const corsOptions = {
    origin: 'http://localhost:3000', // Cambia se il tuo frontend è su un altro dominio
    methods: ['GET', 'POST'],  // Puoi aggiungere altri metodi se necessario
    allowedHeaders: ['Content-Type', 'Authorization'], // Header permessi
};

// Usa CORS con le opzioni definite
app.use(cors(corsOptions));
app.use(express.json()); // Necessario per analizzare JSON nel corpo della richiesta

// Routes
const apiRoutes = require("/adafruitRoute");
app.use("/data", apiRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
