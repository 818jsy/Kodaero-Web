import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SearchScreen.module.css'; // 필요한 스타일 추가
import backIcon from './assets/images/icon_back_red.svg'; // 뒤로가기 아이콘 이미지
import deleteIcon from './assets/images/icon_delete.svg';
import locationIcon from './assets/images/icon_my_location.svg';
import mapIcon from './assets/images/icon_on_map.svg';

function SearchScreen() {
    const navigate = useNavigate(); // useNavigate 훅 사용

    const handleBack = () => {
        navigate(-1); // 이전 페이지로 이동
    };

    return (
        <div className={styles.searchScreenContainer}>
            <div className={styles.searchHeader}>
                <img src={backIcon} alt="Back" className={styles.backIcon} onClick={handleBack}/>
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="주점, 음식, 교우회 검색"
                />
                <img src={deleteIcon} alt="Clear" className={styles.clearButton}/>
            </div>
            <div className={styles.filterOptions}>
                <img src={locationIcon} alt="My" className={styles.filterButton}/>
                <img src={mapIcon} alt="Map" className={styles.filterButton}/>
            </div>
            <div className={styles.resultList}>
                {[...Array(5)].map((_, index) => (
                    <div key={index} className={styles.resultItem}>
                        <img src="/path-to-icon.png" alt="Icon" className={styles.resultIcon} />
                        <div className={styles.resultDetails}>
                            <p className={styles.resultName}>꼬꼬아찌 고대점</p>
                            <p className={styles.resultAddress}>서울 성북구 고려대로26길 50 1층</p>
                        </div>
                        <p className={styles.resultDistance}>503m</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SearchScreen;
