import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './MenuScreen.css'; // 필요한 스타일링을 위한 CSS 파일
import backIcon from './assets/images/icon_back.svg'; // 뒤로가기 아이콘
import sampleImage from './assets/images/image_restaurant.png';
import tiger_icon from "./assets/images/icon_tiger.svg"; // 예시 이미지
import MenuItem from './MenuItem'; // MenuItem 컴포넌트를 import

function MenuScreen() {
    const location = useLocation();
    const navigate = useNavigate(); // useNavigate 훅 사용
    const markerData = location.state; // 전달된 markerData

    const handleBackClick = () => {
        navigate(-1); // 이전 페이지로 이동
    };

    return (
        <div className="menu-screen">
            <Header onBackClick={handleBackClick} />
            {markerData ? (
                <>
                    <div className= "menu-container">
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
            <img src={backIcon} alt="Back" className="back-icon" onClick={onBackClick} /> {/* 뒤로가기 버튼에 onClick 핸들러 추가 */}
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
