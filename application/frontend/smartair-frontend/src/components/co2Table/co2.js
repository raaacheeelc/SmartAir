import React, { useEffect, useState } from "react";
//import "./aqi.css"; // Stile della tabella
import Header from "../Header/header";
import axios from "axios";

const Co2 = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            try {

                const response = await axios.get("http://localhost:3001/data/getCO2");
                const result = response.data;
                console.log(result);

                // Assumendo che `result` sia un array di dati
                const formattedData = result.map((row) => ({

                    timestamp: row.timestamp || new Date().toISOString(), // Usa un timestamp valido
                    co2: row.co2 || "N/A",

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
    }, []);

    if (loading) return <div>Caricamento...</div>;

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

    const totalPages = Math.ceil(data.length / rowsPerPage);

    return (
        <div className="aqi-container">
            <Header />
            <h1>Monitoraggio Qualità dell'Aria</h1>
            <table border="1" style={{ width: "100%", textAlign: "center" }}>
                <thead>
                <tr>
                    <th>Ora</th>
                    <th>Co2</th>

                </tr>
                </thead>
                <tbody>
                {currentRows.map((entry, index) => (
                    <tr key={index}>
                        <td>{new Date(entry.timestamp).toLocaleString()}</td>
                        <td>{entry.co2}</td>

                    </tr>
                ))}
                </tbody>
            </table>
            <div className="pagination">
                <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    &lt; Precedente
                </button>
                <span>Pagina {currentPage} di {totalPages}</span>
                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Successivo &gt;
                </button>
            </div>
        </div>
    );
};

export default Co2;