import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import MapComponent from './MapComponent.jsx';
import MenuScreen from './MenuScreen.jsx';
import styles from './App.module.css';

function App() {
    return (
        <Router>
            <div className={styles.App}>
                <Routes>
                    <Route path="/" element={<MapComponent />} />
                    <Route path="/menu/:id" element={<MenuScreen />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
