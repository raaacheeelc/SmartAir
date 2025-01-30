import React, { useEffect, useState } from "react";
import "./App.css"
import Header from "./components/Header/header";
import axios from "axios";




const App = () => {
  const [data, setData] = useState([]); // Inizializzi con un array vuoto
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [selectedDate, setSelectedDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const response = await axios.get("http://localhost:3001/data/allData");
        const result = response.data;
        console.log(result);

        // Assumendo che `result` sia un array di dati
        const formattedData = result.map((row) => ({
      
          timestamp: row.timestamp || new Date().toISOString(), // Usa un timestamp valido
          t: row.t || "N/A",
          tvoc: row.tvoc || "N/A",
          aqi: row.aqi || "N/A",
          co2: row.co2 || "N/A",
          h: row.h || "N/A",
        }));

        setData(formattedData);
        console.log(formattedData);


        setLoading(false);
      } catch (error) {
        console.error("Errore durante il recupero dei dati:", error);
        setLoading(false);
      }
    };

    fetchData();

        // Imposta un intervallo di aggiornamento ogni 10 secondi
        const interval = setInterval(() => {
          fetchData();
        }, 10000); // 10000 millisecondi = 10 secondi
    
        // Pulisci l'intervallo quando il componente viene smontato
        return () => clearInterval(interval);

  }, []);

  const filterData = () => {
    if (!selectedDate) {
      alert("Seleziona una data per filtrare");
      return;
    }

    const filtered = data.filter((entry) => {
      const entryDate = new Date(entry.timestamp);
      const selected = new Date(selectedDate);

      const isSameDay = entryDate.toDateString() === selected.toDateString();

      return isSameDay;
    });

    console.log('Filtered Data:', filtered);
    setFilteredData(filtered);
    setIsFiltered(true);
    setCurrentPage(1);
  };

  if (loading) return <div>Caricamento...</div>;

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const displayedData = isFiltered ? filteredData : data;
  const currentRows = displayedData.slice(indexOfFirstRow, indexOfLastRow);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  return (
      <div className="container">
        <Header/>
        <h1>Monitoraggio Qualità dell'Aria</h1>
        <div className="date-filter">
          <label>
            Seleziona Data:
            <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
            />
          </label>
          <button onClick={filterData}>Filtra Dati</button>
        </div>
        <table>
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
