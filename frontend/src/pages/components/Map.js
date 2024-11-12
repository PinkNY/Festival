import React, { useEffect, useRef, useCallback } from 'react';
import { FaLocationCrosshairs } from "react-icons/fa6";
import { Card } from '../styles/MapSt';

const KakaoMap = ({ address }) => {
  const mapRef = useRef(null);

  // Kakao 지도 초기화 함수
  const initializeMap = useCallback((latitude, longitude) => {
    if (mapRef.current) {
      console.log("Map is already initialized. Skipping re-initialization."); // 지도 재초기화 방지 로그
      mapRef.current.relayout();
      mapRef.current.setCenter(new window.kakao.maps.LatLng(latitude, longitude));
      return;
    }

    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
      console.warn("Map container not found"); // 지도 컨테이너 없음 경고
      return;
    }

    console.log("Initializing map with coordinates:", latitude, longitude) ;// 지도 초기화 좌표 로그
    const options = {
      center: new window.kakao.maps.LatLng(latitude, longitude),
      level: 3,
    };
    mapRef.current = new window.kakao.maps.Map(mapContainer, options);

    displayMarker(new window.kakao.maps.LatLng(latitude, longitude), '<div style="padding:5px;">축제 위치</div>');
    mapRef.current.relayout();
    mapRef.current.setCenter(new window.kakao.maps.LatLng(latitude, longitude));
  }, []);

  // 주소를 좌표로 변환하는 함수
  const geocodeAddress = useCallback((address) => {
    console.log("Received address for geocoding:", address); // 주소 입력 확인
    const geocoder = new window.kakao.maps.services.Geocoder();

    geocoder.addressSearch(address, function(result, status) {
      if (status === window.kakao.maps.services.Status.OK) {
        const { y, x } = result[0];
        console.log("Geocoded coordinates:", { latitude: y, longitude: x }); // 좌표 변환 결과 로그
        initializeMap(y, x); // 변환된 좌표로 지도 초기화
      } else {
        console.warn("Failed to find coordinates for the address."); // 주소 검색 실패 경고
        initializeMap(37.5665, 126.9780); // 기본 위치로 초기화
      }
    });
  }, [initializeMap]);

  useEffect(() => {
    console.log("Checking if Kakao Maps script is loaded.");
    if (!window.kakao || !window.kakao.maps) {
      console.log("Loading Kakao Maps script.");
      const script = document.createElement('script');
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_API_KEY}&autoload=false&libraries=services`;
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        console.log("Kakao Maps script loaded successfully.");
        window.kakao.maps.load(() => {
          console.log("Kakao Maps library loaded successfully.");
          if (address) {
            geocodeAddress(address); // 주소로 좌표 변환 및 지도 초기화
          } else {
            initializeMap(37.5665, 126.9780); // 기본 위치로 초기화
          }
        });
      };
    } else {
      console.log("Kakao Maps script is already loaded.");
      if (address) {
        geocodeAddress(address); // 주소로 좌표 변환 및 지도 초기화
      } else {
        initializeMap(37.5665, 126.9780); // 기본 위치로 초기화
      }
    }
  }, [address, geocodeAddress, initializeMap]);

  // 마커를 표시하는 함수
  const displayMarker = (locPosition, message) => {
    if (!mapRef.current) return;

    // 이전 마커가 있다면 제거
    if (mapRef.current.marker) {
      mapRef.current.marker.setMap(null);
    }

    const marker = new window.kakao.maps.Marker({
      map: mapRef.current,
      position: locPosition,
    });

    mapRef.current.marker = marker;
    
    // 지도 중심을 마커 위치로 설정
    mapRef.current.setCenter(locPosition);

    const infowindow = new window.kakao.maps.InfoWindow({
      content: message,
      removable: true,
    });

    infowindow.open(mapRef.current, marker);
  };
  
  return (
    <Card>
      <div id="map" style={{ width: '100%', height: '300px', position: 'relative' }}>
        <FaLocationCrosshairs
          onClick={() => geocodeAddress(address)}
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            zIndex: 10,
            cursor: 'pointer',
            fontSize: '24px',
            padding: '5px',
            backgroundColor: 'white',
            borderRadius: '50%',
            boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.3)',
          }}
          title="현재 위치로 이동"
        />
      </div>
    </Card>
  );
};

export default KakaoMap;
