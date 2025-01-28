import React, { useEffect, useState } from "react";
<<<<<<< Updated upstream
import Header from "./components/Header/header";
import Dashboard from "./components/Dashboard/dashboard";
import axios from "axios";
=======
import axios from 'axios';

>>>>>>> Stashed changes

const App = () => {
  const [data, setData] = useState([]); // Inizializzi con un array vuoto
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
<<<<<<< Updated upstream
        const response = await axios.get("http://localhost:3001/data/allData");
        const result = response.data;
        console.log(result);

        // Assumendo che `result` sia un array di dati
        const formattedData = result.map((row) => ({
      
          timestamp: row.timestamp || new Date().toISOString(), // Usa un timestamp valido
          t: row.T || "N/A",
          tvoc: row.tvoc || "N/A",
          aqi: row.aqi || "N/A",
          co2: row.co2 || "N/A",
          h: row.h || "N/A",
        }));

        setData(formattedData);
        console.log(formattedData);
=======
        const response = await axios.get('http://localhost:3001/data/allData');
        const result = await (response.data);
        console.log(result);
        setData(result);
>>>>>>> Stashed changes
        setLoading(false);
      } catch (error) {
        console.error("Errore durante il recupero dei dati:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Caricamento...</div>;

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  return (
    <div className="container">
      <Header />
      <h1>Monitoraggio Qualità dell'Aria</h1>
      <table border="1" style={{ width: "100%", textAlign: "center" }}>
        <thead>
          <tr>
            <th>Ora</th>
            <th>Temperatura (°C)</th>
            <th>TVOC (ppb)</th>
            <th>AQI</th>
            <th>CO2 (ppm)</th>
            <th>Umidità (%)</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((entry, index) => (
            <tr key={index}>
              <td>{new Date(entry.timestamp).toLocaleString()}</td>
              <td>{entry.t}</td>
              <td>{entry.tvoc}</td>
              <td>{entry.aqi}</td>
              <td>{entry.co2}</td>
              <td>{entry.h}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt; Precedente
        </button>
        <span>
          Pagina {currentPage} di {totalPages}
        </span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Successivo &gt;
        </button>
      </div>
    </div>
  );
};

export default App;
