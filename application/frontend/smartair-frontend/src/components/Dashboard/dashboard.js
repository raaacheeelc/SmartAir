import React, {useEffect, useState} from "react";
import "./dashboard.css"; // Import del CSS

const Dashboard = () => {
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
    const latestData = data.length > 0 ? data[data.length - 1] : null;
    return (
        <div className="dashboard">
                <div className="card-container"> {/* Aggiungi una chiave per ciascun entry */}
                    <div className="card">
                        <h2 className="card-title">Temperatura</h2>
                        <p className="card-value">{latestData.t}°C</p>
                    </div>
                    <div className="card">
                        <h2 className="card-title">Umidità</h2>
                        <p className="card-value">{latestData.h}%</p>
                    </div>
                    <div className="card">
                        <h2 className="card-title">CO2</h2>
                        <p className="card-value">{latestData.co2} ppm</p>
                    </div>
                </div>
        </div>
    );
};

export default Dashboard;
