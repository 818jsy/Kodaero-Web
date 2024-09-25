import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SearchScreen.module.css'; // 필요한 스타일 추가
import backIcon from './assets/images/icon_back_red.svg'; // 뒤로가기 아이콘 이미지
import deleteIcon from './assets/images/icon_delete.svg';
import locationIcon from './assets/images/icon_my_location.svg';
import mapIcon from './assets/images/icon_on_map.svg';
import tigerIcon from './assets/images/icon_tiger.svg'; // 후원자 로고 이미지

function SearchScreen() {
    const navigate = useNavigate(); // useNavigate 훅 사용
    const [searchQuery, setSearchQuery] = useState(''); // 검색어 상태
    const [searchResults, setSearchResults] = useState([]); // 검색 결과 상태
    const [debouncedQuery, setDebouncedQuery] = useState(searchQuery); // 디바운싱된 검색어
    const inputRef = useRef(null); // input 요소에 접근하기 위한 ref

    // 컴포넌트가 렌더링될 때 input에 포커스 설정
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [])


    // 검색어 변경 시 디바운싱 적용
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300); // 300ms 후에 디바운싱된 검색어 업데이트

        return () => {
            clearTimeout(handler); // 이전 타이머 제거
        };
    }, [searchQuery]);

    // 디바운싱된 검색어 변경 시 API 호출
    useEffect(() => {
        if (debouncedQuery.trim() === '') {
            setSearchResults([]); // 검색어가 없으면 결과 초기화
            return;
        }

        const fetchSearchResults = async () => {
            try {
                const response = await fetch(`https://be.kodaero.site/api/koyeon/search?keyword=${debouncedQuery}`);
                const result = await response.json();
                if (result.statusCode === 0) {
                    setSearchResults(result.data.list); // 검색 결과 상태 업데이트
                } else {
                    console.error('Error fetching search results:', result.message);
                }
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        };

        fetchSearchResults();
    }, [debouncedQuery]); // 디바운싱된 검색어가 변경될 때만 API 호출

    // 검색어 입력 핸들러
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // 뒤로가기 핸들러
    const handleBack = () => {
        navigate('/'); // 이전 페이지로 이동
    };

    // 입력 필드 클리어 핸들러
    const handleClear = () => {
        setSearchQuery(''); // 검색어 초기화
        setSearchResults([]); // 검색 결과 초기화
    };

    // 특정 아이템 클릭 시 실행되는 함수
    const handleMenuClick = (id) => {
        navigate(`/menu/${id.toString()}`);
    };

    return (
        <div className={styles.searchScreenContainer}>
            <div className={styles.searchHeader}>
                <img src={backIcon} alt="Back" className={styles.backIcon} onClick={handleBack}/>
                <input
                    ref={inputRef} // inputRef를 input에 연결
                    type="text"
                    className={styles.searchInput}
                    placeholder="주점, 음식, 교우회 검색"
                    value={searchQuery}
                    onChange={handleSearchChange} // 검색어 변경 시 호출
                />
                <img src={deleteIcon} alt="Clear" className={styles.clearButton} onClick={handleClear}/>
            </div>
            <div className={styles.filterOptions}>
                <img src={locationIcon} alt="My" className={styles.filterButton}/>
                <img src={mapIcon} alt="Map" className={styles.filterButton}/>
            </div>
            <div className={styles.resultList}>
                {searchResults.map((item) => (
                    <div
                        key={item.id}
                        className={styles.resultItem}
                        onClick={() => handleMenuClick(item.id)}>
                        <img src={tigerIcon} alt="Icon" className={styles.resultIcon}/>
                        <div className={styles.resultDetails}>
                            <p className={styles.resultName}>{item.name}</p>
                            <p className={styles.resultAddress}>{item.sponsor}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SearchScreen;
