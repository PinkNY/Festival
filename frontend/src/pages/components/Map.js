import React, { useEffect, useRef, useCallback } from 'react';
import { FaLocationCrosshairs } from "react-icons/fa6";
import { Card } from '../styles/MapSt';
import axios from 'axios';

const KakaoMap = ({ address }) => {
  const mapRef = useRef(null);

  // 주소를 좌표로 변환하는 함수
  const geocodeAddress = useCallback(async (address) => {
    console.log("Attempting to geocode address:", address); // 변환할 주소를 확인

    try {
      const response = await axios.get(
        `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`,
        { headers: { Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_API_KEY}` } }
      );
      console.log("Geocode API response:", response); // Kakao API 응답 확인

      if (response.data.documents.length > 0) {
        const { x, y } = response.data.documents[0];
        console.log("Geocoded coordinates:", y, x); // 변환된 좌표를 확인
        initializeMap(y, x); // 변환된 좌표로 지도를 초기화
      } else {
        console.warn('주소를 찾을 수 없습니다.');
        initializeMap(37.5665, 126.9780); // 기본 위치 (서울 시청)
      }
    } catch (error) {
      console.error('좌표 변환 오류:', error);
      initializeMap(37.5665, 126.9780); // 오류 발생 시 기본 위치
    }
  }, []);

  // 현재 위치를 가져와 지도 초기화
  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          initializeMap(latitude, longitude);
        },
        () => initializeMap(37.5665, 126.9780) // 권한 거부 시 기본 위치
      ); 
    } else {
      initializeMap(37.5665, 126.9780); // Geolocation API 사용 불가 시 기본 위치
    }
  }, []);

  const initializeMap = useCallback((latitude, longitude) => {
    if (isNaN(latitude) || isNaN(longitude)) {
      console.warn("Invalid coordinates procided");
      return; // 유효하지 않은 좌표가 제공된 경우 함수 종료
    }

    // if (mapRef, current) {
    //   console.log("Map is already initialized");
    //   return; // 이미 초기화된 경우 함수 종료
    // }

    console.log("Initializing map with coordinates:", latitude, longitude); // 초기화 할 좌표 확인

    const mapContainer = document.getElementById('map');

    if (!mapContainer) {
      console.warn("Map container not found");
      return;
    }

    const options = {
      center: new window.kakao.maps.LatLng(latitude, longitude),
      level: 3,
    };
    mapRef.current = new window.kakao.maps.Map(mapContainer, options);
    displayMarker(new window.kakao.maps.LatLng(latitude, longitude), '<div style="padding:5px;">현재 위치</div>');
  }, []);

  useEffect(() => {
    // Kakao Maps 스크립트 로드
    if (!window.kakao || !window.kakao.maps) {
      const script = document.createElement('script');
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_API_KEY}&autoload=false`;
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        window.kakao.maps.load(() => {
          if (address) {
            geocodeAddress(address);
          } else {
            getCurrentLocation();
          }
        });
      };
    } else {
      if (address) {
        geocodeAddress(address);
      } else {
        getCurrentLocation();
      }
    }
  }, [address, geocodeAddress, getCurrentLocation]);

  // 마커 표시 함수
  const displayMarker = (locPosition, message) => {
    if (!mapRef.current) return;

    const marker = new window.kakao.maps.Marker({
      map: mapRef.current,
      position: locPosition,
    });

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
          onClick={getCurrentLocation}
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
