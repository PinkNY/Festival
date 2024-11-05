import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle } from '../styles/MapSt';

const FestivalNearbyRestaurants = ({ festivalAddress }) => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    // 축제 주소를 위도와 경도로 변환하는 함수
    const getCoordinatesFromAddress = async (address) => {
      const apiKey = process.env.REACT_APP_KAKAO_API_KEY;
      try {
        const response = await axios.get('https://dapi.kakao.com/v2/local/search/address.json', {
          params: {
            query: address,
          },
          headers: {
            Authorization: `KakaoAK ${apiKey}`,
          },
        });
        if (response.data.documents.length > 0) {
          const { x: longitude, y: latitude } = response.data.documents[0];
          return { latitude, longitude };
        } else {
          console.error("주소로부터 좌표를 찾을 수 없습니다.");
          return null;
        }
      } catch (error) {
        console.error("Geocoding API 호출 오류:", error);
        return null;
      }
    };

    // 축제 위치 기준 반경 5km 내 맛집 정보를 가져오는 함수
    const fetchNearbyRestaurants = async (latitude, longitude) => {
      const apiKey = process.env.REACT_APP_KAKAO_API_KEY;
      try {
        const response = await axios.get('https://dapi.kakao.com/v2/local/search/keyword.json', {
          params: {
            query: '맛집',
            x: longitude,
            y: latitude,
            radius: 5000, // 반경 5km
            sort: 'distance', // 거리순으로 정렬
            size: 3, // 상위 3개 맛집만 가져오기
          },
          headers: {
            Authorization: `KakaoAK ${apiKey}`,
          },
        });
        setRestaurants(response.data.documents); // 맛집 정보 리스트를 상태에 저장
      } catch (error) {
        console.error("맛집 정보 API 호출 오류:", error);
      }
    };

    // 주소 -> 좌표 -> 맛집 정보 순서로 처리
    const fetchFestivalData = async () => {
      const coordinates = await getCoordinatesFromAddress(festivalAddress);
      if (coordinates) {
        const { latitude, longitude } = coordinates;
        fetchNearbyRestaurants(latitude, longitude);
      }
    };

    if (festivalAddress) {
      fetchFestivalData();
    }
  }, [festivalAddress]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>축제 주변 맛집 정보</CardTitle>
      </CardHeader>

      {/* 주변 맛집 정보 표시 */}
      <div style={{ marginTop: '20px' }}>
        {restaurants.length > 0 ? (
          restaurants.map((restaurant) => (
            <div key={restaurant.id} style={{ marginBottom: '15px' }}>
              <h4>{restaurant.place_name}</h4>
              <p>{restaurant.address_name}</p>
              {restaurant.place_url && (
                <a href={restaurant.place_url} target="_blank" rel="noopener noreferrer">
                  자세히 보기
                </a>
              )}
            </div>
          ))
        ) : (
          <p>주변 맛집 정보를 불러오는 중입니다...</p>
        )}
      </div>
    </Card>
  );
};

export default FestivalNearbyRestaurants;
