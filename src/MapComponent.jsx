import React, { useState, useEffect, useRef } from 'react';
import markerIcon from './assets/marker.png'; // PNG 파일을 import
import alarmIcon from './assets/images/icon_alarm.png'; // PNG 파일을 import
import DirectionIcon from './assets/images/icon_direction.svg'; // PNG 파일을 import
import GPSIcon from './assets/images/icon_GPS.svg'; // PNG 파일을 import
import ModalComponent from './ModalComponent';
import DialogComponent from './DialogComponent';
import styles from './MapComponent.module.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import './CustomScrollbar.css'; // 일반 CSS 파일 임포트
import { useNavigate } from 'react-router-dom';

function MapComponent() {
    const [markers, setMarkers] = useState([]); // 모든 마커 정보 저장
    const [selectedMarker, setSelectedMarker] = useState(null); // 선택된 마커 저장
    const [isDialogOpen, setIsDialogOpen] = useState(false); // 다이얼로그 상태 관리
    const [activeMarkers, setActiveMarkers] = useState([]); // 활성화된 마커 ID 저장
    const [allMarkers, setAllMarkers] = useState([]); // 모든 마커 ID 저장
    const [cachedData, setCachedData] = useState({}); // API 데이터 캐싱
    const [activeFilter, setActiveFilter] = useState(null); // 현재 활성화된 버튼 ID 저장
    const mapRef = useRef(null); // map 객체를 저장할 ref

    const navigate = useNavigate();

    const [isMapLoaded, setIsMapLoaded] = useState(false); // 지도 로드 상태
    const [isMarkersLoaded, setIsMarkersLoaded] = useState(false); // 마커 데이터 로드 상태

    // 마커 JSON 파일 로드
    useEffect(() => {
        fetch('/markers.json')
            .then(response => response.json())
            .then(data => {
                setMarkers(data);
                setAllMarkers(data.map(marker => marker.ID)); // 모든 마커의 ID 저장
                setActiveMarkers(data.map(marker => marker.ID)); // 초기 상태에서는 모든 마커 활성화
                setIsMarkersLoaded(true); // 마커 데이터 로드 완료
            })
            .catch(error => console.error('Error fetching the JSON file:', error));
    }, []);

    // 지도 객체 생성은 한 번만 실행되도록 분리
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=8alsyra0y4';
        script.async = true;
        script.onload = () => {
            const mapOptions = {
                center: new window.naver.maps.LatLng(37.5855, 127.0295),
                zoom: 17,
            };

            mapRef.current = new window.naver.maps.Map('map', mapOptions);
            setIsMapLoaded(true); // 지도 로드 완료
        };
        document.head.appendChild(script);
    }, []);

    // 마커 관리 useEffect
    useEffect(() => {
        if (!mapRef.current || !isMapLoaded || !isMarkersLoaded) return; // 지도와 마커 데이터가 모두 로드된 후 실행

        let markerObjects = markers.map(markerData => {
            const marker = new window.naver.maps.Marker({
                position: new window.naver.maps.LatLng(markerData.lat, markerData.lon),
                map: mapRef.current, // 기존 map 객체 사용
                icon: {
                    url: markerIcon,
                    size: new window.naver.maps.Size(20, 31),
                    scaledSize: new window.naver.maps.Size(20, 31),
                    origin: new window.naver.maps.Point(0, 0),
                    anchor: new window.naver.maps.Point(10, 31)
                }
            });

            // 마커 클릭 이벤트
            window.naver.maps.Event.addListener(marker, 'click', function () {
                setSelectedMarker(markerData);
            });

            return { id: markerData.ID, marker };
        });

        const updateMarkerSize = (zoomLevel, activeIds) => {
            markerObjects.forEach(({ id, marker }) => {
                if (activeIds.includes(id)) {
                    let scaleFactor;
                    if (zoomLevel >= 17 && zoomLevel <= 20) {
                        scaleFactor = 1 + (zoomLevel - 17) * 0.33;
                    } else if (zoomLevel > 20) {
                        scaleFactor = 2;
                    } else {
                        scaleFactor = 1;
                    }
                    const newSize = new window.naver.maps.Size(20 * scaleFactor, 31 * scaleFactor);
                    marker.setIcon({
                        url: markerIcon,
                        size: newSize,
                        scaledSize: newSize,
                        origin: new window.naver.maps.Point(0, 0),
                        anchor: new window.naver.maps.Point(10 * scaleFactor, 31 * scaleFactor)
                    });
                }
            });
        };

        const updateMarkersVisibility = (activeIds) => {
            markerObjects.forEach(({ id, marker }) => {
                if (activeIds.includes(id)) {
                    marker.setMap(mapRef.current); // 활성화된 마커만 지도에 표시
                } else {
                    marker.setMap(null); // 비활성화된 마커는 지도에서 제거
                }
            });
        };

        // 초기 마커 설정
        updateMarkersVisibility(activeMarkers);

        // 마커 크기 조절 초기화
        updateMarkerSize(mapRef.current.getZoom(), activeMarkers);

        // 지도 줌 변경 이벤트
        window.naver.maps.Event.addListener(mapRef.current, 'zoom_changed', function () {
            const zoomLevel = mapRef.current.getZoom();
            updateMarkerSize(zoomLevel, activeMarkers);
        });

        // 마커 상태 업데이트 시 마커 표시 및 크기 업데이트
        setActiveMarkers(prevMarkers => {
            updateMarkersVisibility(prevMarkers);
            updateMarkerSize(mapRef.current.getZoom(), prevMarkers);
            return prevMarkers;
        });

        // Cleanup function to remove markers when activeMarkers changes
        return () => {
            markerObjects.forEach(({ marker }) => marker.setMap(null));
        };
    }, [isMapLoaded, isMarkersLoaded, markers, activeMarkers]); // isMapLoaded와 isMarkersLoaded가 true일 때 실행


    // 버튼 클릭 시 마커 필터링 로직
    const handleButtonClick = async (id) => {
        try {
            if (activeFilter === id) {
                // 이미 활성화된 버튼을 다시 클릭하면 비활성화 (전체 보기)
                setActiveFilter(null);
                setActiveMarkers(allMarkers);
            } else {
                setActiveFilter(id); // 새로운 필터 활성화
                if (cachedData[id]) {
                    setActiveMarkers(cachedData[id]); // 이미 캐싱된 데이터가 있으면 사용
                } else {
                    const response = await fetch(`https://be.kodaero.site/api/koyeon/pubs?tagId=${id}`);
                    const result = await response.json();
                    const markerIds = result.data.list.map(item => item.id);
                    setCachedData(prev => ({ ...prev, [id]: markerIds })); // 데이터 캐싱
                    setActiveMarkers(markerIds); // 받아온 마커 ID로 필터링
                }
            }
        } catch (error) {
            console.error('Error fetching the data:', error);
        }
    };

    const handleSearchClick = () => {
        navigate('/search');
    };
    // 다이얼로그 핸들러
    const handleDialogOpen = () => {
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };
    // 버튼의 클래스 이름을 동적으로 설정
    const getButtonClassName = (id) => {
        return `${styles.scrollbarItem} ${activeFilter === id ? styles.active : ''}`;
    };


    return (
        <div className={styles.mapContainer}>
            <div id="map" style={{ width: '100%', height: '100%' }}></div>
            <div className={styles.homeLayout}>
                <div className={styles.searchAndNavigate}>
                    <button className={styles.searchButton} onClick={handleSearchClick}>
                        주점, 음식, 교우회 검색
                    </button>
                    <img src={DirectionIcon}
                         alt="길 찾기"
                         className={styles.navigateButton}/>
                </div>
                <div className={styles.searchAndNavigate}>
                    <PerfectScrollbar className={styles.scrollbarContainer} options={{suppressScrollY: true}}>
                        <div className={styles.scrollbar}>
                            <button className={`${styles.scrollbarItem} ${activeFilter === 1 ? styles.active : ''}`}
                                    onClick={() => handleButtonClick(1)}>치킨/고기
                            </button>
                            <button className={`${styles.scrollbarItem} ${activeFilter === 2 ? styles.active : ''}`}
                                    onClick={() => handleButtonClick(2)}>튀김류
                            </button>
                            <button className={`${styles.scrollbarItem} ${activeFilter === 3 ? styles.active : ''}`}
                                    onClick={() => handleButtonClick(3)}>볶음류
                            </button>
                            <button className={`${styles.scrollbarItem} ${activeFilter === 4 ? styles.active : ''}`}
                                    onClick={() => handleButtonClick(4)}>떡볶이
                            </button>
                            <button className={`${styles.scrollbarItem} ${activeFilter === 5 ? styles.active : ''}`}
                                    onClick={() => handleButtonClick(5)}>디저트/샐러드
                            </button>
                            <button className={`${styles.scrollbarItem} ${activeFilter === 6 ? styles.active : ''}`}
                                    onClick={() => handleButtonClick(6)}>탕류
                            </button>
                            <button className={`${styles.scrollbarItem} ${activeFilter === 7 ? styles.active : ''}`}
                                    onClick={() => handleButtonClick(7)}>부침개
                            </button>
                            <button className={`${styles.scrollbarItem} ${activeFilter === 8 ? styles.active : ''}`}
                                    onClick={() => handleButtonClick(8)}>기타
                            </button>
                        </div>
                    </PerfectScrollbar>
                </div>
                <div className={styles.searchAndNavigate} style={{flexDirection: 'row-reverse'}}>
                    <img src={alarmIcon}
                         alt="종 버튼"
                         className={styles.dialogButton}
                         onClick={handleDialogOpen}/>
                </div>
                <div className={styles.GPScontainer}>
                    <img src={GPSIcon}
                         alt="GPS Icon"
                         className={styles.GPSButton}/>
                </div>
            </div>

            <ModalComponent
                isOpen={!!selectedMarker}
                onClose={() => setSelectedMarker(null)}
                markerData={selectedMarker || {}}
            />
            <DialogComponent
                isOpen={isDialogOpen}
                onClose={handleDialogClose}
                title="정식 출시 알림을 받아보세요!"
                content="고대로는 학교 건물의 실내 지도 및 편의시설 안내를 돕는 통합형 애플리케이션으로, 베타테스트가 마무리되어 현재 플레이스토어 검수 단계에 있습니다. 하단의 링크에 접속하셔서 이메일 주소를 남겨주시면 정식 출시 후 알림 메일을 발송해 드립니다:)"
            />
        </div>
    );
}

export default MapComponent;
