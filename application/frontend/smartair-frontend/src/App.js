import React, { useEffect, useState } from "react";
import Header from "./components/Header/header";
import Dashboard from "./components/Dashboard/dashboard";

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/data/getData");
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error("Errore durante il recupero dei dati:", error);
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
      <Header/>
      <Dashboard/>
      <h1>Monitoraggio Qualità dell'Aria</h1>
      <table border="1" style={{ width: '100%', textAlign: 'center' }}>
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
              <td>{entry.temperature}</td>
              <td>{entry.tvoc}</td>
              <td>{entry.aqi}</td>
              <td>{entry.co2}</td>
              <td>{entry.humidity}</td>
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
