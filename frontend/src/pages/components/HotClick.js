import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Card, CardHeader, CardTitle, CardContent, FestivalCard, FestivalGrid, MoreCard } from '../styles/HotSt';
import Modal from '../Modal';

const Clicklist = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFestival, setSelectedFestival] = useState(null);
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  const [topClickFestivals, setTopClickFestivals] = useState([]);
  const cardRefs = useRef([]);

  const navigate = useNavigate();
  const handleMoreClick = () => {
    navigate('/list');
  };

  useEffect(() => {
    // 클릭 수 기준 상위 5개 축제 데이터를 가져옵니다.
    const fetchClickFestivals = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/festivals/?sort=view_count&order=desc&limit=5`);
        setTopClickFestivals(response.data); // 백엔드에서 가져온 데이터를 상태에 저장합니다.
      } catch (error) {
        console.error("Failed to fetch click festivals:", error);
      }
    };

    fetchClickFestivals();
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
          <CardTitle>인기 축제 Top 5 (클릭 수 기준)</CardTitle>
        </CardHeader>
        <CardContent>
          <FestivalGrid>
            {topClickFestivals.map((festival, index) => (
              <FestivalCard
                key={festival.id}
                ref={(el) => (cardRefs.current[index] = el)}
                onClick={() => openModal(festival, index)}
              >
                <CardContent>
                  <img src={festival.image || "./AppleFesta.jpeg"} style={{ width: '200px', height: '150px' }} alt='FestivalImage' />
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

export default Clicklist;