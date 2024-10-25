import React, { useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle } from '../styles/MapSt';

const KakaoMap = () => {
  const mapContainer = useRef(null); // 지도를 표시할 div에 대한 ref

  useEffect(() => {
    console.log("useEffect 실행: Kakao Map 스크립트 추가 시작"); // useEffect 시작 로그

    // Kakao Map 스크립트를 동적으로 추가
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=c0ff99b36d736fbd589ee08820dbdcb8&autoload=false&libraries=services,clusterer,drawing`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      console.log("Kakao Map script loaded."); // 스크립트 로드 확인 로그 추가
      if (window.kakao && window.kakao.maps) {
        // API 로드 성공 시 자동으로 로드
        window.kakao.maps.load(() => {
          console.log("Kakao Maps API loaded."); // Maps API 로드 확인 로그 추가
          try {
            const options = {
              center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 초기 위치 설정 (서울 시청 기준)
              level: 3, // 지도 확대 레벨
            };
            const map = new window.kakao.maps.Map(mapContainer.current, options);
            console.log("Map initialized successfully."); // 지도 초기화 성공 확인 로그 추가

            if (map) {
              console.log("지도 객체가 성공적으로 생성되었습니다.");
            } else {
              console.error("지도 객체 생성 실패.");
            }
          } catch (error) {
            console.error('Kakao Map 생성 중 오류 발생:', error);
          }
        });
      } else {
        console.error("Kakao Maps API not available."); // Maps API 로드 실패 시
      }
    };

    script.onerror = () => {
      console.error("Failed to load Kakao Map script."); // 스크립트 로드 실패 시
    };

    return () => {
      console.log("컴포넌트 언마운트: Kakao Map 스크립트 제거"); // 컴포넌트 언마운트 시
      // 컴포넌트 언마운트 시 스크립트 정리
      document.head.removeChild(script);
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>내 위치</CardTitle>
      </CardHeader>
      <div ref={mapContainer} style={{ width: '100%', height: '400px' }} />
    </Card>
  );
};

export default KakaoMap;
