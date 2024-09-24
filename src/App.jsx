import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import MapComponent from './MapComponent.jsx';
import MenuScreen from './MenuScreen.jsx';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<MapComponent />} />
                    <Route path="/menu/:id" element={<MenuScreen />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
