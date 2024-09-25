import React, { useState, useEffect } from 'react';
import markerIcon from './assets/marker.png'; // PNG 파일을 import
import alarmIcon from './assets/images/icon_alarm.png'; // PNG 파일을 import
import DirectionIcon from './assets/images/icon_direction.svg'; // PNG 파일을 import
import GPSIcon from './assets/images/icon_GPS.svg'; // PNG 파일을 import
import MyPinIcon from './assets/images/pin_location.png'; // 내 위치 아이콘 이미지
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
    const [myLocationMarker, setMyLocationMarker] = useState(null); // 내 위치 마커 저장

    const navigate = useNavigate();

    // 마커 JSON 파일 로드
    useEffect(() => {
        fetch('/markers.json')
            .then(response => response.json())
            .then(data => {
                setMarkers(data);
                setAllMarkers(data.map(marker => marker.ID)); // 모든 마커의 ID 저장
                setActiveMarkers(data.map(marker => marker.ID)); // 초기 상태에서는 모든 마커 활성화
            })
            .catch(error => console.error('Error fetching the JSON file:', error));
    }, []);

    useEffect(() => {
        if (markers.length === 0) return;

        const script = document.createElement('script');
        script.src = 'https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=8alsyra0y4';
        script.async = true;
        script.onload = () => {
            const mapOptions = {
                center: new window.naver.maps.LatLng(37.5855, 127.0295),
                zoom: 17,
            };

            const map = new window.naver.maps.Map('map', mapOptions);

            let markerObjects = markers.map(markerData => {
                const marker = new window.naver.maps.Marker({
                    position: new window.naver.maps.LatLng(markerData.lat, markerData.lon),
                    map: map,
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
                        marker.setMap(map); // 활성화된 마커만 지도에 표시
                    } else {
                        marker.setMap(null); // 비활성화된 마커는 지도에서 제거
                    }
                });
            };

            // 초기 마커 설정
            updateMarkersVisibility(activeMarkers);

            // 마커 크기 조절 초기화
            updateMarkerSize(map.getZoom(), activeMarkers);

            // 지도 줌 변경 이벤트
            window.naver.maps.Event.addListener(map, 'zoom_changed', function () {
                const zoomLevel = map.getZoom();
                updateMarkerSize(zoomLevel, activeMarkers);
            });

            // 마커 상태 업데이트 시 마커 표시 및 크기 업데이트
            setActiveMarkers(prevMarkers => {
                updateMarkersVisibility(prevMarkers);
                updateMarkerSize(map.getZoom(), prevMarkers);
                return prevMarkers;
            });


            // 내 위치 마커 추가 함수
            const addMyLocationMarker = (position) => {
                const myMarker = new window.naver.maps.Marker({
                    position: new window.naver.maps.LatLng(position.lat, position.lon),
                    map: map,
                    icon: {
                        url: MyPinIcon,
                        size: new window.naver.maps.Size(24, 24),
                        scaledSize: new window.naver.maps.Size(24, 24),
                        origin: new window.naver.maps.Point(0, 0),
                        anchor: new window.naver.maps.Point(12, 12)
                    }
                });

                setMyLocationMarker(myMarker);
            };

            // 내 위치를 계속 추적하여 업데이트
            navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    if (myLocationMarker) {
                        myLocationMarker.setPosition(new window.naver.maps.LatLng(latitude, longitude));
                    } else {
                        addMyLocationMarker({ lat: latitude, lon: longitude });
                    }
                },
                (error) => console.error('Error fetching location', error),
                { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
            );

        };
        document.head.appendChild(script);
    }, [markers, activeMarkers]);

    // GPS 버튼 클릭 시 내 위치 마커 추가 함수
    const handleGPSClick = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                if (myLocationMarker) {
                    // 이미 마커가 있으면 위치 업데이트
                    myLocationMarker.setPosition(new window.naver.maps.LatLng(latitude, longitude));
                } else {
                    // 마커가 없으면 새로 추가
                    const myMarker = new window.naver.maps.Marker({
                        position: new window.naver.maps.LatLng(latitude, longitude),
                        map: map,
                        icon: {
                            url: MyPinIcon,
                            size: new window.naver.maps.Size(24, 24),
                            scaledSize: new window.naver.maps.Size(24, 24),
                            origin: new window.naver.maps.Point(0, 0),
                            anchor: new window.naver.maps.Point(12, 12)
                        }
                    });
                    setMyLocationMarker(myMarker);
                }
            },
            (error) => console.error('Error fetching location', error),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    };


    const handleButtonClick = async (id) => {
        try {
            if (activeFilter === id) {
                setActiveFilter(null);
                setActiveMarkers(allMarkers);
            } else {
                setActiveFilter(id);
                if (cachedData[id]) {
                    setActiveMarkers(cachedData[id]);
                } else {
                    const response = await fetch(`https://be.kodaero.site/api/koyeon/pubs?tagId=${id}`);
                    const result = await response.json();
                    const markerIds = result.data.list.map(item => item.id);
                    setCachedData(prev => ({ ...prev, [id]: markerIds }));
                    setActiveMarkers(markerIds);
                }
            }
        } catch (error) {
            console.error('Error fetching the data:', error);
        }
    };

    const handleSearchClick = () => {
        navigate('/search');
    };

    const handleDialogOpen = () => {
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };

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
                            <button className={getButtonClassName(1)}
                                    onClick={() => handleButtonClick(1)}>치킨/고기
                            </button>
                            <button className={getButtonClassName(2)}
                                    onClick={() => handleButtonClick(2)}>튀김류
                            </button>
                            <button className={getButtonClassName(3)}
                                    onClick={() => handleButtonClick(3)}>볶음류
                            </button>
                            <button className={getButtonClassName(4)}
                                    onClick={() => handleButtonClick(4)}>떡볶이
                            </button>
                            <button className={getButtonClassName(5)}
                                    onClick={() => handleButtonClick(5)}>디저트/샐러드
                            </button>
                            <button className={getButtonClassName(6)}
                                    onClick={() => handleButtonClick(6)}>탕류
                            </button>
                            <button className={getButtonClassName(7)}
                                    onClick={() => handleButtonClick(7)}>부침개
                            </button>
                            <button className={getButtonClassName(8)}
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
                         className={styles.GPSButton}
                         onClick={handleGPSClick} />
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
