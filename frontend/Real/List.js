import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import {
  PageContainer, Main, SectionTitle, FestivalGrid, FestivalCard, FestivalImage,
  FestivalInfo, FestivalName, FestivalDate, MoreButton, FilterContainer, FilterSelect
} from '../styles/ListSt';

const FestivalList = () => {
  const location = useLocation();
  const { results: searchResults, query } = location.state || {};
  
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('popular');

  useEffect(() => {
    if (searchResults) {
      // 검색 결과가 있을 때 해당 결과를 표시
      setFestivals(searchResults);
      setLoading(false);
    } else {
      // 검색 결과가 없을 때만 API 호출하여 데이터 가져옴
      const fetchFestivals = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`/api/festivals?filter=${filter}`); // 필터링된 데이터 가져오기
          setFestivals(response.data);
        } catch (error) {
          console.error('Error fetching festivals:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchFestivals();
    }
  }, [filter, searchResults]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  return (
    <PageContainer>
      <Main>
        <SectionTitle style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          축제 {query && `- "${query}" 검색 결과`}
        </SectionTitle>
        <FilterContainer>
          <FilterSelect value={filter} onChange={handleFilterChange} disabled={!!searchResults}>
            <option value="popular">인기순</option>
            <option value="alphabetical">가나다순</option>
            <option value="ongoing">진행중</option>
          </FilterSelect>
        </FilterContainer>
        <FestivalGrid>
          {loading ? (
            <p>Loading...</p>
          ) : (
            festivals.length > 0 ? (
              festivals.map((festival, index) => (
                <FestivalCard href={festival.id ? `/festival/${festival.id}` : '#'} key={index}>
                  <FestivalImage
                    src={festival.imageUrl || '/placeholder.svg'}
                    alt={festival.name || '내용없음'}
                    width={200}
                    height={200}
                  />
                  <FestivalInfo>
                    <FestivalName>{festival.name || '내용없음'}</FestivalName>
                    <FestivalDate>{festival.date || '내용없음'}</FestivalDate>
                  </FestivalInfo>
                </FestivalCard>
              ))
            ) : (
              <p>검색 결과가 없습니다.</p>
            )
          )}
        </FestivalGrid>
        <MoreButton>더 보기</MoreButton>
      </Main>
    </PageContainer>
  );
};

export default FestivalList;
