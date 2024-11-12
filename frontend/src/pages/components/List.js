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
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFestival, setSelectedFestival] = useState(null);
  
  const [isSearchMode, setIsSearchMode] = useState(!!searchResults);

  const handleCardClick = (festival) => {
    setSelectedFestival(festival);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFestival(null);
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
        console.error('Error fetching festivals:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isSearchMode && searchResults) {
      // 검색 결과가 있을 때만 초기 설정
      setFestivals(searchResults);
      setLoading(false);
      setHasMore(false); 
    } else if (!isSearchMode) {
      fetchFestivals(page); // 검색 모드가 아닐 때만 fetchFestivals 호출
    }
  }, [filter, page, isSearchMode, searchResults]);

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
          <FilterSelect value={filter} onChange={handleFilterChange} disabled={isSearchMode}>
            <option value="view_count">인기순</option>
            <option value="alphabetical">가나다순</option>
          </FilterSelect>
        </FilterContainer>
        <FestivalGrid>
          {loading ? (
            <p>Loading...</p>
          ) : isSearchMode && festivals.length === 0 ? (
            <p>검색 결과가 없습니다.</p>
          ) : (
            festivals.length > 0 ? (
              festivals.map((festival, index) => (
                <FestivalCard
                  key={index}
                  onClick={() => handleCardClick(festival)}
                  style={{ textDecoration: 'none' }}
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
              <p>등록된 축제가 없습니다.</p>
            )
          )}
        </FestivalGrid>
        {!isSearchMode && hasMore && !loading && (
          <MoreButton onClick={handleLoadMore}>더 보기</MoreButton>
        )}
      </Main>

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
