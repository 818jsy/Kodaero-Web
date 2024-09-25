import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sheet } from 'react-modal-sheet';
import styles from './ModalComponent.module.css';
import tigerIcon from './assets/images/icon_tiger.svg';

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
            <Sheet.Container className={styles.customSheetContainer}>
                <Sheet.Header />
                <Sheet.Content className={styles.customSheetContent}>
                    <div className={styles.modalContentWrapper}>
                        <div className={styles.modalContent}>
                            <div className={styles.sponsorContainer}>
                                <img src={tigerIcon} alt="Sponsor Logo" className={styles.sponsorLogo} />
                                <p className={styles.sponsor}>{markerData.sponsor}</p>
                            </div>
                            <div className={styles.nameContainer}>
                                <p className={styles.name}>{markerData.name}</p>
                            </div>
                            <div className={styles.addressContainer}>
                                <p className={styles.address}>{markerData.address}</p>
                            </div>
                            <div className={styles.timeContainer}>
                                <p className={styles.operating}>운영 중</p>
                                <p className={styles.time}>22:00에 무료주점 종료</p>
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.menuButton} onClick={handleMenuClick}>
                                메뉴 정보 보기
                            </button>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.departButton}>출발</button>
                            <button className={styles.arriveButton}>도착</button>
                        </div>
                    </div>
                </Sheet.Content>
            </Sheet.Container>
        </Sheet>
    );
}

export default ModalComponent;
