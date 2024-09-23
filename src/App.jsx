import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MapComponent from './MapComponent.jsx';
import MenuScreen from './MenuScreen.jsx';
import './App.css';

function App() {
    const [markers, setMarkers] = useState([]);

    useEffect(() => {

        // 로컬에 있는 JSON 파일을 fetch로 불러오기
        fetch('/markers.json')
            .then(response => response.json())
            .then(data => setMarkers(data))
            .catch(error => console.error('Error fetching the JSON file:', error));
    }, []);

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<MapComponent markers={markers} />} />
                    <Route path="/menu" element={<MenuScreen />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
