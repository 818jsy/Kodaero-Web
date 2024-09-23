import React, { useState, useEffect } from 'react';
import markerIcon from './assets/marker.svg'; // SVG 파일을 import
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
                zoom: 15,
            };

            const map = new window.naver.maps.Map('map', mapOptions);

            markers.forEach(markerData => {
                const marker = new window.naver.maps.Marker({
                    position: new window.naver.maps.LatLng(parseFloat(markerData.lat), parseFloat(markerData.lon)),
                    map: map,
                    title: markerData.name,
                    icon: {
                        url: markerIcon,  // SVG 파일을 마커로 사용
                        size: new window.naver.maps.Size(50, 52),
                        origin: new window.naver.maps.Point(0, 0),
                        anchor: new window.naver.maps.Point(25, 26),
                    }
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
