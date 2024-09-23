import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './MenuScreen.css';
import backIcon from './assets/images/icon_back.svg';
import sampleImage from './assets/images/image_restaurant.png';
import tiger_icon from "./assets/images/icon_tiger.svg";
import MenuItem from './MenuItem';

function MenuScreen() {
    const location = useLocation();
    const navigate = useNavigate();
    const markerData = location.state || JSON.parse(localStorage.getItem('markerData'));

    useEffect(() => {
        if (markerData) {
            localStorage.setItem('markerData', JSON.stringify(markerData));
        }
    }, [markerData]);

    const handleBackClick = () => {
        navigate(-1);
    };

    return (
        <div className="menu-screen">
            <Header onBackClick={handleBackClick} />
            {markerData ? (
                <>
                    <div className="menu-container">
                        <div className="modal-content">
                            <div className="sponsor-container">
                                <img src={tiger_icon} alt="Sponsor Logo" className="sponsor-logo"/>
                                <p className="sponsor">{markerData.sponsor}</p>
                            </div>
                            <div className="name-container">
                                <p className="name">{markerData.name}</p>
                            </div>
                            <div className="address-container">
                                <p className="address">{markerData.address}</p>
                            </div>
                            <div className="time-container">
                                <p className="operating">운영 중</p>
                                <p className="time">22:00에 무료주점 종료</p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="depart-button">출발</button>
                            <button className="arrive-button">도착</button>
                        </div>
                    </div>

                    <MenuList menuItems={markerData.menu}/>
                </>
            ) : (
                <p>No data available.</p>
            )}
        </div>
    );
}

function Header({ onBackClick }) {
    return (
        <div className="header">
            <img src={backIcon} alt="Back" className="back-icon" onClick={onBackClick} />
            <img src={sampleImage} alt="Restaurant" className="restaurant-image"/>
        </div>
    );
}

function MenuList({ menuItems }) {
    return (
        <div className="menu-list">
            {menuItems.map((item, index) => (
                <MenuItem
                    key={index}
                    name={item}
                    price="무료"
                />
            ))}
        </div>
    );
}

export default MenuScreen;
