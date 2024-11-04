import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  position: absolute;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  transform: ${(props) =>
    props.$initialPosition ? `translate(${props.$initialPosition.x}px, ${props.$initialPosition.y}px) scale(0)` : 'scale(0)'};
  transition: transform 0.5s ease-in-out;
  transform-origin: center center;

  &.open {
    transform: translate(0, 0) scale(1);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

const Modal = ({ isOpen, onClose, festivalId, initialPosition }) => {
  const [festival, setFestival] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen && festivalId) {
      // 모달이 열릴 때 페스티벌 데이터 가져오기
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/festivals/${festivalId}`)
        .then((response) => {
          console.log('Festival data:', response.data); // 응답 데이터 확인
          setFestival(response.data.festival);
        })
        .catch((error) => {
          console.error('Error fetching festival data:', error);
          setFestival(null);
        });
    }
  }, [isOpen, festivalId]);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(false); // 애니메이션 초기화
      setTimeout(() => {
        setIsAnimating(true); // 짧은 딜레이 후 애니메이션 시작
      }, 50); // 50ms 딜레이로 확실하게 비동기적으로 처리
    } else {
      setIsAnimating(false); // 모달이 닫힐 때 상태 초기화
      setFestival(null); // 모달이 닫힐 때 festival 상태 초기화
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <ModalWrapper onClick={onClose}>
      <ModalContent
        className={isAnimating ? 'open' : ''}
        $initialPosition={initialPosition} // 수정: Transient Prop으로 변경
        onClick={(e) => e.stopPropagation()}
      >
        <CloseButton onClick={onClose}>&times;</CloseButton>
        {festival ? (
          <>
            <h2>축제명: {festival.title || '제목 없음'}</h2>
            <p>
              축제 기간: {festival.start_date && festival.end_date 
                ? `${festival.start_date} ~ ${festival.end_date}` 
                : '내용없음'}
            </p>
            <img src={festival.imageUrl} alt="축제 포스터" style={{ width: '100%', borderRadius: '8px', marginTop: '1rem' }} />
            <p>태그: {festival.tags && festival.tags.join(', ')}</p>
          </>
        ) : (
          <p>로딩 중입니다...</p> // 로딩 중인 경우 로딩 메시지 표시
        )}
      </ModalContent>
    </ModalWrapper>
  );
};

export default Modal;
