import React, { useState, useEffect } from 'react';
import markerIcon from './assets/marker.png'; // PNG 파일을 import
import alarmIcon from './assets/images/icon_alarm.png'; // PNG 파일을 import
import DirectionIcon from './assets/images/icon_direction.svg'; // PNG 파일을 import
import ModalComponent from './ModalComponent';
import DialogComponent from './DialogComponent';
import styles from './MapComponent.module.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import './CustomScrollbar.css'; // 일반 CSS 파일 임포트


function MapComponent() {
    const [markers, setMarkers] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        fetch('/markers.json')
            .then(response => response.json())
            .then(data => setMarkers(data))
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

            markers.forEach(markerData => {
                const marker = new window.naver.maps.Marker({
                    position: new window.naver.maps.LatLng(parseFloat(markerData.lat), parseFloat(markerData.lon)),
                    map: map,
                    icon: {
                        url: markerIcon,
                        size: new window.naver.maps.Size(20, 31),
                        scaledSize: new window.naver.maps.Size(20, 31),
                        origin: new window.naver.maps.Point(0, 0),
                        anchor: new window.naver.maps.Point(10, 31)
                    }
                });

                const updateMarkerSize = (zoomLevel) => {
                    if (zoomLevel >= 17 && zoomLevel <= 20) {
                        const scaleFactor = 1 + (zoomLevel - 17) * 0.33;
                        const newSize = new window.naver.maps.Size(20 * scaleFactor, 31 * scaleFactor);
                        marker.setIcon({
                            url: markerIcon,
                            size: newSize,
                            scaledSize: newSize,
                            origin: new window.naver.maps.Point(0, 0),
                            anchor: new window.naver.maps.Point(10 * scaleFactor, 31 * scaleFactor)
                        });
                    } else if (zoomLevel > 20) {
                        marker.setIcon({
                            url: markerIcon,
                            size: new window.naver.maps.Size(40, 62),
                            scaledSize: new window.naver.maps.Size(40, 62),
                            origin: new window.naver.maps.Point(0, 0),
                            anchor: new window.naver.maps.Point(20, 62)
                        });
                    } else {
                        marker.setIcon({
                            url: markerIcon,
                            size: new window.naver.maps.Size(20, 31),
                            scaledSize: new window.naver.maps.Size(20, 31),
                            origin: new window.naver.maps.Point(0, 0),
                            anchor: new window.naver.maps.Point(10, 31)
                        });
                    }
                };

                updateMarkerSize(map.getZoom());

                window.naver.maps.Event.addListener(map, 'zoom_changed', function () {
                    const zoomLevel = map.getZoom();
                    updateMarkerSize(zoomLevel);
                });

                window.naver.maps.Event.addListener(marker, 'click', function () {
                    setSelectedMarker(markerData);
                });
            });
        };
        document.head.appendChild(script);
    }, [markers]);

    const handleDialogOpen = () => {
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };

    const menuItems = ["치킨/고기", "튀김류", "볶음류", "떡볶이", "디저트/샐러드"];

    return (
        <div className={styles.mapContainer}>
            <div id="map" style={{width: '100%', height: '100%'}}></div>
            <div className={styles.homeLayout}>
                <div className={styles.searchAndNavigate}>
                    <button className={styles.searchButton}>
                        주점, 음식, 교우회 검색
                    </button>
                    <img src={DirectionIcon}
                         alt="길 찾기"
                         className={styles.navigateButton}/>
                </div>
                <div className={styles.searchAndNavigate}>
                    <PerfectScrollbar className={styles.scrollbarContainer}>
                        <div className={styles.scrollbar}>
                            <div className={styles.scrollbarItem}>sdaf</div>
                            <div className={styles.scrollbarItem}>sdaf</div>
                            <div className={styles.scrollbarItem}>sdaf</div>
                            <div className={styles.scrollbarItem}>sdaf</div>
                            <div className={styles.scrollbarItem}>sdaf</div>
                            <div className={styles.scrollbarItem}>sdaf</div>
                            <div className={styles.scrollbarItem}>sdaf</div>
                        </div>
                    </PerfectScrollbar>
                </div>
                <div className={styles.searchAndNavigate}>
                    <img src={alarmIcon}
                         alt="종 버튼"
                         className={styles.dialogButton}
                         onClick={handleDialogOpen}/>
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
