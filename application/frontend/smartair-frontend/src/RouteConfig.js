import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import Aqi from "./components/aqiTable/aqi";
import Tvoc from "./components/tvocTable/tvoc"
import Co2 from "./components/co2Table/co2"
import Temperature from "./components/TempetureTable/temperatura"
import Humidity from "./components/HumidityTable/humidity"

const RoutesConfig = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/aqi" element={<Aqi />} />
                <Route path="/tvoc" element={<Tvoc />} />
                <Route path="/co2" element={<Co2 />} />
                <Route path="/temperature" element={<Temperature />} />
                <Route path="/humidity" element={<Humidity />} />
            </Routes>
        </Router>
    );
};

export default RoutesConfig;
