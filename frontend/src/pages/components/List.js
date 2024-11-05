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
  const [filter, setFilter] = useState('view_count');
  const [page, setPage] = useState(1); // 페이지 상태 추가
  const [hasMore, setHasMore] = useState(true); // 더 불러올 데이터가 있는지 여부

  useEffect(() => {
    const fetchFestivals = async (pageNum = 1) => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/festivals/?filter=${filter}&page=${pageNum}`
        );
        const newFestivals = response.data;
        
        // 첫 페이지인 경우 덮어쓰고, 아닐 경우 새 데이터 추가
        setFestivals(prev => (pageNum === 1 ? newFestivals : [...prev, ...newFestivals]));
        
        // 새로 불러온 데이터가 8개 미만일 때만 더 이상 데이터가 없다고 판단
        setHasMore(newFestivals.length === 8);
      } catch (error) {
        console.error('축제 정보를 불러오는 중 오류 발생:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!searchResults) {
      fetchFestivals(page); // 페이지 번호로 데이터 요청
    } else {
      setFestivals(searchResults);
      setLoading(false);
      setHasMore(false); // 검색 결과가 있으면 더 이상 로드하지 않음
    }
  }, [filter, searchResults, page]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setPage(1); // 필터 변경 시 페이지 초기화
    setHasMore(true); // 필터 변경 시 hasMore 초기화
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1); // 페이지 증가
  };

  return (
    <PageContainer>
      <Main>
        <SectionTitle style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          축제 {query && `- "${query}" 검색 결과`}
        </SectionTitle>
        <FilterContainer>
          <FilterSelect value={filter} onChange={handleFilterChange} disabled={!!searchResults}>
            <option value="view_count">인기순</option>
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
                    alt={festival.title || '내용없음'}
                    width={200}
                    height={200}
                  />
                  <FestivalInfo>
                  <FestivalName>{festival.title || '내용없음'}</FestivalName>
                    <FestivalDate>
                      {festival.start_date && festival.end_date ? 
                        `${festival.start_date} ~ ${festival.end_date}` : 
                        '내용없음'}
                    </FestivalDate>
                  </FestivalInfo>
                </FestivalCard>
              ))
            ) : (
              <p>검색 결과가 없습니다.</p>
            )
          )}
        </FestivalGrid>
        {hasMore && !loading && (
          <MoreButton onClick={handleLoadMore}>더 보기</MoreButton>
        )}
      </Main>
    </PageContainer>
  );
};

export default FestivalList;
