import React from "react";
import { useNavigate } from "react-router-dom";
import "./header.css";

const Header = () => {
    const navigate = useNavigate();

    const handleNavigation = () => {
        navigate("/aqi");
    };

    return (
        <header className="header">
            <div className="logo" onClick={() => navigate("/")}>SmartAir</div>
            <nav>
                <ul>
                    <li><button onClick={() => navigate("/")}>Home</button></li>
                    <li><button onClick={() => navigate("/aqi")}>AQI</button></li>
                    <li><button onClick={() => navigate("/tvoc")}>TVOC</button></li>
                    <li><button onClick={() => navigate("/co2")}>CO2</button></li>
                    <li><button onClick={() => navigate("/temperature")}>Temperatura</button></li>
                    <li><button onClick={() => navigate("/humidity")}>Umidità</button></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
