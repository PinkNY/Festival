import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Modal from '../Modal';

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
  const [page, setPage] = useState(1); 
  const [hasMore, setHasMore] = useState(true);
  
  // 모달 관련 상태 추가
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFestival, setSelectedFestival] = useState(null);

  // 축제 카드 클릭 시 호출되는 함수
  const handleCardClick = (festival) => {
    setSelectedFestival(festival); // 선택한 축제 정보 저장
    setIsModalOpen(true); // 모달 열기
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFestival(null); // 축제 정보 초기화
  };

  useEffect(() => {
    const fetchFestivals = async (pageNum = 1) => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/festivals/?filter=${filter}&page=${pageNum}`
        );
        const newFestivals = response.data;
        
        setFestivals(prev => (pageNum === 1 ? newFestivals : [...prev, ...newFestivals]));
        setHasMore(newFestivals.length === 8);
      } catch (error) {
        console.error('축제 정보를 불러오는 중 오류 발생:', error);
      } finally {
        setLoading(false);
      }
    };

    // 검색 결과가 없으면 전체 축제 목록 불러오기
    if (!searchResults) {
      fetchFestivals(page);
    } else {
      setFestivals(searchResults);
      setLoading(false);
      setHasMore(false); // 검색 결과에서는 '더 보기' 비활성화
    }
  }, [filter, searchResults, page]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setPage(1);
    setHasMore(true);
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
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
                <FestivalCard
                  key={index}
                  onClick={() => handleCardClick(festival)} // 클릭 시 모달 열기
                >
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
        {!searchResults && hasMore && !loading && (
          <MoreButton onClick={handleLoadMore}>더 보기</MoreButton>
        )}
      </Main>

      {/* 모달 컴포넌트 추가 */}
      {isModalOpen && selectedFestival && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={closeModal} 
          festival={selectedFestival}
        />
      )}
    </PageContainer>
  );
};

export default FestivalList;