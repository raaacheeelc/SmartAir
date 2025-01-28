import React from "react";
import "./header.css";

const Header = () => (
    <header className="header">
        <div className="logo">SmartAir</div>
        <nav>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/">AQI</a></li>
                <li><a href="/">TVOC</a></li>
                <li><a href="/">CO2</a></li>
                <li><a href="/">Temperatura</a></li>
                <li><a href="/">Umidità</a></li>
            </ul>
        </nav>
    </header>
);

export default Header;