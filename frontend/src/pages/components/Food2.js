import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FestivalMap = ({ festivalAddress }) => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    // 축제 주소를 이용하여 좌표를 구함
    const fetchCoordinates = async () => {
      try {
        const geocodeUrl = `https://dapi.kakao.com/v2/local/search/address.json?query=${festivalAddress}`;
        const geocodeResponse = await axios.get(geocodeUrl, {
          headers: {
            Authorization: `KakaoAK YOUR_KAKAO_API_KEY`,
          },
        });

        if (geocodeResponse.data.documents.length > 0) {
          const { x, y } = geocodeResponse.data.documents[0];
          fetchRestaurants(y, x);
        } else {
          console.error('주소를 찾을 수 없습니다.');
        }
      } catch (error) {
        console.error('좌표를 가져오는 중 오류가 발생했습니다:', error);
      }
    };

    // 좌표를 기준으로 맛집 검색
    const fetchRestaurants = async (latitude, longitude) => {
      try {
        const placesUrl = `https://dapi.kakao.com/v2/local/search/keyword.json?y=${latitude}&x=${longitude}&radius=5000&query=\uB9DB\uC9D1`;
        const placesResponse = await axios.get(placesUrl, {
          headers: {
            Authorization: `KakaoAK YOUR_KAKAO_API_KEY`,
          },
        });

        if (placesResponse.data.documents.length > 0) {
          // 거리순으로 정렬 후 가장 가까운 세 개의 맛집 선택
          const sortedRestaurants = placesResponse.data.documents.sort(
            (a, b) => a.distance - b.distance
          );
          setRestaurants(sortedRestaurants.slice(0, 3));
        } else {
          console.error('검색된 맛집이 없습니다.');
        }
      } catch (error) {
        console.error('맛집을 가져오는 중 오류가 발생했습니다:', error);
      }
    };

    if (festivalAddress) {
      fetchCoordinates();
    }
  }, [festivalAddress]);

  return (
    <div>
      <h2>축제 근처 맛집</h2>
      {restaurants.length > 0 ? (
        restaurants.map((restaurant) => (
          <div key={restaurant.id} style={{ marginBottom: '20px' }}>
            <h3>{restaurant.place_name}</h3>
            <p>주소: {restaurant.road_address_name || restaurant.address_name}</p>
            {restaurant.photo && <img src={restaurant.photo} alt={restaurant.place_name} style={{ width: '200px', height: 'auto' }} />}
          </div>
        ))
      ) : (
        <p>주변 맛집 정보를 불러오는 중입니다...</p>
      )}
    </div>
  );
};

export default FestivalMap;
