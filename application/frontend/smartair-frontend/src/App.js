import React, { useEffect, useState } from "react";

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="container">
      <h1>Monitoraggio Qualità dell'Aria</h1>
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
          {data.map((entry, index) => (
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
    </div>
  );
};

export default App;
