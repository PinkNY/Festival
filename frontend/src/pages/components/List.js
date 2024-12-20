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
  const [favorites, setFavorites] = useState({}); // 즐겨찾기 상태 관리 객체

  const [isSearchMode, setIsSearchMode] = useState(!!searchResults);

  const handleCardClick = (festival) => {
    setSelectedFestival(festival);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFestival(null);
  };

  const toggleFavorite = (festivalId) => {
    setFavorites((prev) => ({
      ...prev,
      [festivalId]: !prev[festivalId], // 즐겨찾기 상태 토글
    }));
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
      setFestivals(searchResults);
      setLoading(false);
      setHasMore(false); 
    } else if (!isSearchMode) {
      fetchFestivals(page);
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
                    <FestivalName>
                      {festival.title || '내용없음'}
                      <button
                        type="button"
                        style={{
                          background: 'none',
                          border: 'none',
                          fontSize: '1.2rem',
                          color: favorites[festival.id] ? 'gold' : '#ccc',
                          marginLeft: '8px',
                          pointerEvents: 'none', // 클릭 불가
                        }}
                      >
                        ★
                      </button>
                    </FestivalName>
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
          isFavorite={favorites[selectedFestival.id] || false} // 선택한 축제의 즐겨찾기 상태 전달
          onFavoriteClick={() => toggleFavorite(selectedFestival.id)} // 모달에서 즐겨찾기 토글 가능
        />
      )}
    </PageContainer>
  );
};

export default FestivalList;
