import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sheet } from 'react-modal-sheet';
import './ModalComponent.css';
import tiger_icon from './assets/images/icon_tiger.svg';

function ModalComponent({ isOpen, onClose, markerData }) {
    const navigate = useNavigate();

    const handleMenuClick = () => {
        navigate(`/menu/${markerData.ID}`);
    };

    return (
        <Sheet
            isOpen={isOpen}
            onClose={onClose}
            snapPoints={[450, 0]}
            initialSnap={0}
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-end',
                height: 'calc(var(--vh, 1vh) * 100)',
                width: '100%'
            }}
        >
            <Sheet.Container className="custom-sheet-container">
                <Sheet.Header />
                <Sheet.Content className="custom-sheet-content">
                    <div className="modal-content-wrapper">
                        <div className="modal-content">
                            <div className="sponsor-container">
                                <img src={tiger_icon} alt="Sponsor Logo" className="sponsor-logo" />
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
                            <button className="menu-button" onClick={handleMenuClick}>
                                메뉴 정보 보기
                            </button>
                        </div>
                        <div className="modal-footer">
                            <button className="depart-button">출발</button>
                            <button className="arrive-button">도착</button>
                        </div>
                    </div>
                </Sheet.Content>
            </Sheet.Container>
        </Sheet>
    );
}

export default ModalComponent;
