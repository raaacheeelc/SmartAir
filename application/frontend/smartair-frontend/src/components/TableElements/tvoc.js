import React, { useEffect, useState } from "react";
import "./tableElements.css"; // Stile della tabella
import Header from "../Header/header";
import axios from "axios";

const Tvoc = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const [selectedDate, setSelectedDate] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [isFiltered, setIsFiltered] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {

                const response = await axios.get("http://localhost:3001/data/getTVOC");
                const result = response.data;
                console.log(result);

                // Assumendo che `result` sia un array di dati
                const formattedData = result.map((row) => ({

                    timestamp: row.timestamp || new Date().toISOString(),
                    tvoc: row.tvoc || "N/A",

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

    const totalPages = Math.ceil(data.length / rowsPerPage);

    return (
        <div className="aqi-container">
            <Header/>
            <h1>Monitoraggio TVOC</h1>
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
                    <th>TVOC</th>

                </tr>
                </thead>
                <tbody>
                {currentRows.map((entry, index) => (
                    <tr key={index}>
                        <td>{new Date(entry.timestamp).toLocaleString()}</td>
                        <td>{entry.tvoc}</td>

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

export default Tvoc;