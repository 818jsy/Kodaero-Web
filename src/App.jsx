import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import MapComponent from './MapComponent.jsx';
import MenuScreen from './MenuScreen.jsx';
import SearchScreen from './SearchScreen.jsx';
import styles from './App.module.css';

function App() {

    return (
        <Router>
            <div className={styles.App}>
                <Routes>
                    <Route path="/" element={<MapComponent />} />
                    <Route path="/menu/:id" element={<MenuScreen />} />
                    <Route path="/search" element={<SearchScreen />} /> {/* 검색 화면 경로 추가 */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
