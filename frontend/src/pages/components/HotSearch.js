import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Card, CardHeader, CardTitle, CardContent, FestivalCard, FestivalGrid, MoreCard } from '../styles/HotSt';
import Modal from '../Modal';

const Searchlist = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFestival, setSelectedFestival] = useState(null);
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  const [topSearchFestivals, setTopSearchFestivals] = useState([]);
  const cardRefs = useRef([]);

  const navigate = useNavigate();
  const handleMoreClick = () => {
    navigate('/list');
  };

  useEffect(() => {
    // 모든 축제 데이터를 가져온 후 search_count 기준으로 정렬하고 상위 5개만 선택합니다.
    const fetchSearchFestivals = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/festivals/`);
        
        // 데이터를 search_count 기준으로 내림차순 정렬하고 상위 5개만 선택
        const sortedFestivals = response.data
          .sort((a, b) => b.search_count - a.search_count)
          .slice(0, 5);

        setTopSearchFestivals(sortedFestivals);
      } catch (error) {
        console.error("Failed to fetch search festivals:", error);
      }
    };

    fetchSearchFestivals();
  }, []);

  const openModal = (festival, index) => {
    const cardElement = cardRefs.current[index];
    if (cardElement) {
      const rect = cardElement.getBoundingClientRect();
      setInitialPosition({
        x: rect.left + rect.width / 2 - window.innerWidth / 2,
        y: rect.top + rect.height / 2 - window.innerHeight / 2,
      });
    }
    setSelectedFestival(festival);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFestival(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>인기 축제 Top 5 (검색 수 기준)</CardTitle>
        </CardHeader>
        <CardContent>
          <FestivalGrid>
            {topSearchFestivals.map((festival, index) => (
              <FestivalCard
                key={festival.id}
                ref={(el) => (cardRefs.current[index] = el)}
                onClick={() => openModal(festival, index)}
              >
                <CardContent>
                <img src={festival.imageUrl} style={{ width: '200px', height: '150px' }} alt='FestivalImage' />
                  <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.5rem' }}>{festival.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{festival.start_date} - {festival.end_date}</p>
                </CardContent>
              </FestivalCard>
            ))}
            <MoreCard onClick={handleMoreClick}>
              +더 보기
            </MoreCard>
          </FestivalGrid>
        </CardContent>
      </Card>
      <Modal isOpen={isModalOpen} onClose={closeModal} festival={selectedFestival} initialPosition={initialPosition} />
    </>
  );
};

export default Searchlist;
