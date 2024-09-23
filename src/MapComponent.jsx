import React, { useState, useEffect } from 'react';
import markerIcon from './assets/marker.png'; // PNG 파일을 import
import ModalComponent from './ModalComponent'; // ModalComponent import

function MapComponent({ markers }) {
    const [selectedMarker, setSelectedMarker] = useState(null);

    useEffect(() => {
        console.log('Markers data:', markers); // markers 배열을 콘솔에 출력

        const script = document.createElement('script');
        script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=8alsyra0y4`;
        script.async = true;
        script.onload = () => {
            const mapOptions = {
                center: new window.naver.maps.LatLng(37.58639, 127.02917),
                zoom: 17,
            };

            const map = new window.naver.maps.Map('map', mapOptions);

            markers.forEach(markerData => {
                const marker = new window.naver.maps.Marker({
                    position: new window.naver.maps.LatLng(parseFloat(markerData.lat), parseFloat(markerData.lon)),
                    map: map,
                    icon: {
                        url: markerIcon,
                        size: new window.naver.maps.Size(20, 31), // 초기 크기
                        scaledSize: new naver.maps.Size(20, 31),
                        origin: new window.naver.maps.Point(0, 0),
                        anchor: new window.naver.maps.Point(10, 31)
                    }
                });

                const updateMarkerSize = (zoomLevel) => {
                    if (zoomLevel >= 17 && zoomLevel <= 20) {
                        // 17에서 20까지 1배에서 2배로 점진적 증가
                        const scaleFactor = 1 + (zoomLevel - 17) * 0.33; // 17 -> 1배, 20 -> 2배
                        const newSize = new window.naver.maps.Size(20 * scaleFactor, 31 * scaleFactor);
                        marker.setIcon({
                            url: markerIcon,
                            size: newSize,
                            scaledSize: newSize,
                            origin: new window.naver.maps.Point(0, 0),
                            anchor: new window.naver.maps.Point(10 * scaleFactor, 31 * scaleFactor)
                        });
                    } else if (zoomLevel >20){
                        // 2배 크기로 설정
                        marker.setIcon({
                            url: markerIcon,
                            size: new window.naver.maps.Size(40, 62),
                            scaledSize: new naver.maps.Size(40, 62),
                            origin: new window.naver.maps.Point(0, 0),
                            anchor: new window.naver.maps.Point(20, 62)
                        });
                    } else
                        // 기본 크기로 설정
                        marker.setIcon({
                            url: markerIcon,
                            size: new window.naver.maps.Size(20, 31),
                            scaledSize: new naver.maps.Size(20, 31),
                            origin: new window.naver.maps.Point(0, 0),
                            anchor: new window.naver.maps.Point(10, 31)
                        });

                };

                // 초기 줌 레벨에 따라 마커 크기 설정
                updateMarkerSize(map.getZoom());

                // 지도 줌 변경 이벤트
                window.naver.maps.Event.addListener(map, 'zoom_changed', function() {
                    const zoomLevel = map.getZoom();
                    updateMarkerSize(zoomLevel);
                });

                // 마커 클릭 이벤트
                window.naver.maps.Event.addListener(marker, 'click', function() {
                    setSelectedMarker(markerData); // 마커 클릭 시 모달을 띄울 데이터 설정
                });
            });
        };
        document.head.appendChild(script);
    }, [markers]);

    return (
        <div id="map" style={{ width: '100%', height: 'calc(var(--vh, 1vh) * 100)' }}>
            <ModalComponent
                isOpen={!!selectedMarker}
                onClose={() => setSelectedMarker(null)}
                markerData={selectedMarker || {}}
            />
        </div>
    );
}

export default MapComponent;
