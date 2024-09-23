import React, { useState, useEffect } from 'react';
import './App.css';
import MapComponent from './MapComponent';

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
        <div className="App">
            <MapComponent markers={markers} />
        </div>
    );
}

export default App;
