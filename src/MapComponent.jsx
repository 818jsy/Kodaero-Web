import React, { useState, useEffect } from 'react';
import markerIcon from './assets/marker.png'; // PNG 파일을 import
import ModalComponent from './ModalComponent'; // ModalComponent import

function MapComponent() {
    const [markers, setMarkers] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);

    useEffect(() => {
        // 로컬에 있는 JSON 파일을 fetch로 불러오기
        fetch('/markers.json')
            .then(response => response.json())
            .then(data => setMarkers(data))
            .catch(error => console.error('Error fetching the JSON file:', error));
    }, []);

    useEffect(() => {

        console.log('Markers data:', markers);

        if (markers.length === 0) return; // 마커가 없으면 실행하지 않음

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
                        size: new window.naver.maps.Size(20, 31), // 초기 크기
                        scaledSize: new naver.maps.Size(20, 31),
                        origin: new window.naver.maps.Point(0, 0),
                        anchor: new window.naver.maps.Point(10, 31)
                    }
                });

                const updateMarkerSize = (zoomLevel) => {
                    if (zoomLevel >= 17 && zoomLevel <= 20) {
                        const scaleFactor = 1 + (zoomLevel - 17) * 0.33; // 17 -> 1배, 20 -> 2배
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
                            scaledSize: new naver.maps.Size(40, 62),
                            origin: new window.naver.maps.Point(0, 0),
                            anchor: new window.naver.maps.Point(20, 62)
                        });
                    } else {
                        marker.setIcon({
                            url: markerIcon,
                            size: new window.naver.maps.Size(20, 31),
                            scaledSize: new naver.maps.Size(20, 31),
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
    }, [markers]); // markers가 업데이트될 때마다 실행

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
