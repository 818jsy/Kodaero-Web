import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import styles from './DialogComponent.module.css'; // 스타일 파일 import
import bellIcon from './assets/images/icon_bell.png';

function DialogComponent({ isOpen, onClose }) {
    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            aria-labelledby="dialog-title"
            aria-describedby="dialog-description"
            classes={{ paper: styles.customDialog }} // 커스텀 클래스 적용
            maxWidth="xs" // 다이얼로그의 최대 너비를 설정
            fullWidth={true} // 다이얼로그가 내부 콘텐츠에 맞게 너비를 채우도록 설정
            scroll="paper"
        >
            <DialogContent className={styles.dialogContent}>
                <img src={bellIcon} alt="Notification Icon" className={styles.dialogIcon} />
                <DialogTitle id="dialog-title" className={styles.dialogTitle}>
                    정식 출시 알림을 받아보세요!
                </DialogTitle>
                <DialogContentText id="dialog-description">
                    <p className={styles.dialogDescription}>
                        <strong>고대로</strong>는 학교 건물의 <strong>실내 지도</strong> 및 <strong>편의시설 안내</strong>를 돕는
                        통합형 애플리케이션으로, 베타테스트가 마무리되어
                        현재 플레이스토어 검수 단계에 있습니다.<br/>
                        하단의 링크에 접속하셔서 이메일 주소를 남겨주시면 
                        <strong>정식 출시 후 알림 메일</strong>을 발송해 드립니다:)
                    </p>
                </DialogContentText>
                <DialogActions className={styles.dialogActions}>
                    <Button
                        onClick={() => {
                            onClose();
                            window.location.href = "https://forms.gle/5E6sVU8ox2sepVT5A";
                        }}
                        className={styles.dialogPrimaryButton}>
                        출시 알림 받기
                    </Button>
                    <Button onClick={onClose} className={styles.dialogSecondaryButton}>
                        다음에 할래요
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
}

export default DialogComponent;
