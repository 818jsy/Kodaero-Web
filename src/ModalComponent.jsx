import React from 'react';
import './ModalComponent.css';

function ModalComponent({ isOpen, onClose, markerData }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <div className="drag-handle"></div>
                    <button onClick={onClose} className="close-button">X</button>
                </div>
                <div className="modal-content">
                    <p className="sponser">후원자: {markerData.sponsor}</p>
                    <p className="name">{markerData.name}</p>
                    <p className="address">주소: {markerData.address}</p>
                    <p className="time">22:00에 무료주점 종료</p>
                </div>
                <div className="modal-footer">
                    <button className="menu-button">메뉴 정보 보기</button>
                </div>
                <div className="modal-footer">
                    <button className="depart-button">출발</button>
                    <button className="arrive-button">도착</button>
                </div>
            </div>
        </div>
    );
}

export default ModalComponent;
