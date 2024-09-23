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
                    <h2>{markerData.name}</h2>
                    <p>후원자: {markerData.sponsor}</p>
                    <p>주소: {markerData.address}</p>
                    <p>영업시간: {markerData.time || '정보 없음'}</p>
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
