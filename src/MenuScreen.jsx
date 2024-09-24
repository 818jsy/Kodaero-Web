import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './MenuScreen.css'; // 필요한 CSS 파일 임포트
import backIcon from './assets/images/icon_back.svg'; // 뒤로가기 아이콘 이미지
import sampleImage from './assets/images/image_restaurant.png'; // 레스토랑 이미지
import tiger_icon from './assets/images/icon_tiger.svg'; // 후원자 로고 이미지
import MenuItem from './MenuItem'; // MenuItem 컴포넌트를 import

function MenuScreen() {
    const { id } = useParams(); // URL에서 ID를 가져옴
    const [markerData, setMarkerData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/markers.json') // 로컬 JSON 파일에서 데이터를 불러옴
            .then(response => response.json())
            .then(data => {
                const foundMarker = data.find(marker => marker.ID === id);
                if (foundMarker) {
                    setMarkerData(foundMarker);
                } else {
                    navigate('/'); // ID에 해당하는 데이터가 없으면 홈으로 리다이렉트
                }
            });
    }, [id, navigate]);

    const handleBackClick = () => {
        navigate(-1); // 이전 페이지로 이동
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
                <p></p>
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
