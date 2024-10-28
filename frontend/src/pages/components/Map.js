import React, { useEffect } from 'react';
import { Card, CardHeader, CardTitle } from '../styles/MapSt';

const KakaoMap = () => {
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
            // 지도 생성
            const map = new window.kakao.maps.Map(mapContainer, options);
            console.log("Map initialized successfully.");
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>내 위치</CardTitle>
      </CardHeader>
      <div id="map" style={{ width: '100%', height: '400px' }} />
    </Card>
  );
};

export default KakaoMap;
