import React, { useEffect, useRef } from 'react';
import { FaLocationCrosshairs } from "react-icons/fa6";
import { Card, CardHeader, CardTitle } from '../styles/MapSt';
import axios from 'axios';

const KakaoMap = ({ address }) => {
  const mapRef = useRef(null); // 지도 객체를 관리할 useRef 사용

  useEffect(() => {
    // 주소를 좌표로 변환하는 함수
    const geocodeAddress = async (address) => {
      try {
        const response = await axios.get(
          `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`,
          {
            headers: { Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_API_KEY}` }
          }
        );

        if (response.data.documents.length > 0) {
          const { x, y } = response.data.documents[0];
          initializeMap(y, x); // 변환된 좌표로 지도를 초기화
        } else {
          console.warn('주소를 찾을 수 없습니다.');
          initializeMap(37.5665, 126.9780); // 기본 위치 설정 (서울 시청)
        }
      } catch (error) {
        console.error('좌표 변환 오류:', error);
        initializeMap(37.5665, 126.9780); // 기본 위치 설정 (서울 시청)
      }
    };

    // 사용자의 현재 위치를 가져오거나 주소로 좌표를 변환하여 지도를 초기화합니다.
    const initializeMap = (latitude, longitude) => {
      const script = document.createElement('script');
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_API_KEY}&autoload=true`;
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(() => {
            try {
              const mapContainer = document.getElementById('map');
              const options = {
                center: new window.kakao.maps.LatLng(latitude, longitude),
                level: 3,
              };
              mapRef.current = new window.kakao.maps.Map(mapContainer, options);
              displayMarker(new window.kakao.maps.LatLng(latitude, longitude), '<div style="padding:5px;">현재 위치</div>');
            } catch (error) {
              console.error('Kakao Map 생성 중 오류 발생:', error);
            }
          });
        } else {
          console.error("Kakao Maps API가 로드되지 않았습니다.");
        }
      };

      script.onerror = () => {
        console.error("Kakao Map 스크립트 로드에 실패했습니다.");
      };

      return () => {
        document.head.removeChild(script);
      };
    };

    if (address) {
      geocodeAddress(address); // 주소를 좌표로 변환하여 지도 초기화
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          initializeMap(lat, lon); // 현재 위치를 기준으로 지도 초기화
        },
        () => initializeMap(37.5665, 126.9780) // 위치 권한 거부 시 서울 시청 좌표로 지도 초기화
      );
    } else {
      initializeMap(37.5665, 126.9780); // Geolocation API를 사용할 수 없을 때 기본 위치로 초기화
    }
  }, [address]);

  const moveToCurrentLocation = () => {
    if (!mapRef.current) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locPosition = new window.kakao.maps.LatLng(position.coords.latitude, position.coords.longitude);
          displayMarker(locPosition, '<div style="padding:5px;">현재 내 위치</div>');
        },
        () => alert("현재 위치를 가져올 수 없습니다.")
      );
    }
  };

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
    mapRef.current.setCenter(locPosition);
  };

  return (
    <Card>
      <div id="map" style={{ width: '100%', height: '300px', position: 'relative' }}>
        <FaLocationCrosshairs
          onClick={moveToCurrentLocation}
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
