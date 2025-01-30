import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import Aqi from "./components/TableElements/aqi";
import Tvoc from "./components/TableElements/tvoc"
import Co2 from "./components/TableElements/co2"
import Temperature from "./components/TableElements/temperatura"
import Humidity from "./components/TableElements/humidity"

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
