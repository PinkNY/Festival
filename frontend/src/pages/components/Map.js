import React, { useEffect, useRef } from 'react';
import { FaLocationCrosshairs } from "react-icons/fa6";
import { Card, CardHeader, CardTitle } from '../styles/MapSt';

const KakaoMap = () => {
  const mapRef = useRef(null); // 지도 객체를 관리할 useRef 사용

  useEffect(() => {
    // Kakao Map 스크립트를 동적으로 추가
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_API_KEY}&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      // 스크립트가 정상적으로 로드되었는지 확인
      if (window.kakao && window.kakao.maps) {
        // API 로드가 완료된 후 지도 생성
        window.kakao.maps.load(() => {
          try {
            const mapContainer = document.getElementById('map'); // 지도를 표시할 div의 id
            const options = {
              center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 초기 위치 설정 (서울 시청 기준)
              level: 3, // 지도 확대 레벨
            };
            // 지도 생성 및 mapRef.current에 할당
            mapRef.current = new window.kakao.maps.Map(mapContainer, options);
            console.log("Map initialized successfully.");

            // 초기 로딩 시 사용자 위치를 가져와서 마커 표시
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(function (position) {
                const lat = position.coords.latitude; // 위도
                const lon = position.coords.longitude; // 경도
                const locPosition = new window.kakao.maps.LatLng(lat, lon); // 현재 위치를 Kakao LatLng 객체로 생성
                const message = '<div style="padding:5px;">현재 내 위치</div>'; // 인포윈도우에 표시될 메시지
                displayMarker(locPosition, message);
              });
            }

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
      // 컴포넌트 언마운트 시 스크립트 제거
      document.head.removeChild(script);
    };
  }, []);

  // 현재 위치로 지도 중심을 이동시키고 마커를 표시하는 함수
  const moveToCurrentLocation = () => {
    if (!mapRef.current) {
      console.error("지도 객체가 초기화되지 않았습니다.");
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const lat = position.coords.latitude; // 위도
        const lon = position.coords.longitude; // 경도

        const locPosition = new window.kakao.maps.LatLng(lat, lon); // 현재 위치를 Kakao LatLng 객체로 생성
        const message = '<div style="padding:5px;">현재 내 위치</div>'; // 인포윈도우에 표시될 메시지

        // 마커와 인포윈도우를 지도에 표시하는 함수 호출
        displayMarker(locPosition, message);
      });
    } else {
      alert("Geolocation을 사용할 수 없습니다.");
    }
  };

  // 지도에 마커와 인포윈도우를 표시하는 함수입니다
  const displayMarker = (locPosition, message) => {
    if (!mapRef.current) return; // 지도가 생성되지 않은 경우 return

    // 마커를 생성합니다
    const marker = new window.kakao.maps.Marker({
      map: mapRef.current,
      position: locPosition,
    });

    const iwContent = message; // 인포윈도우에 표시할 내용
    const iwRemoveable = true;

    // 인포윈도우를 생성합니다
    const infowindow = new window.kakao.maps.InfoWindow({
      content: iwContent,
      removable: iwRemoveable,
    });

    // 인포윈도우를 마커 위에 표시합니다
    infowindow.open(mapRef.current, marker);

    // 지도 중심을 현재 위치로 변경합니다
    mapRef.current.setCenter(locPosition);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>지도</CardTitle>
      </CardHeader>
      <div id="map" style={{ width: '100%', height: '500px', position: 'relative' }}>
        {/* FaLocationCrosshairs 아이콘을 지도 위에 고정 */}
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
