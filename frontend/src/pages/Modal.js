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
  width: 500px;
  max-width: 90%;
  max-height: 90%;
  overflow-y: auto;
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

const TopSection = styled.div`
  display: flex;
  gap: 1rem;
`;

const ImageWrapper = styled.div`
  flex: 1;
  img {
    width: 100%;
    border-radius: 8px;
  }
`;

const InfoWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const BottomSection = styled.div`
  margin-top: 1.5rem;
`;

const CommentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #ddd;
  gap: 1rem;
`;

const CommentID = styled.p`
  flex: 0 0 80px; /* 아이디 영역 고정 너비 */
  font-weight: bold;
`;

const CommentRating = styled.p`
  flex: 0 0 40px; /* 평점 영역 고정 너비 */
  text-align: center;
`;

const CommentText = styled.p`
  flex: 1; /* 댓글 영역 */
  word-break: break-word; /* 댓글이 길면 줄바꿈 */
`;

const Modal = ({ isOpen, onClose, festival, initialPosition }) => {
  const [comments, setComments] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // 모달이 열릴 때 배경 스크롤 비활성화
    } else {
      document.body.style.overflow = 'auto'; // 모달이 닫힐 때 배경 스크롤 활성화
    }

    return () => {
      document.body.style.overflow = 'auto'; // 컴포넌트가 언마운트될 때 원래 상태로 복구
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && festival) {
      setIsLoading(true);
      const fetchAdditionalData = async () => {
        try {
          const commentsUrl = `${process.env.REACT_APP_API_URL}/api/comments/?festa_id=${festival.id}`;
          const commentsResponse = await axios.get(commentsUrl);
          setComments(commentsResponse.data.comments || commentsResponse.data);

          const hashtagsUrl = `${process.env.REACT_APP_API_URL}/api/hashtags/?festa_id=${festival.id}`;
          const hashtagsResponse = await axios.get(hashtagsUrl);
          setHashtags(hashtagsResponse.data.hashtags || hashtagsResponse.data);
        } catch (error) {
          console.error('Error fetching additional data:', error);
          setComments([]);
          setHashtags([]);
        } finally {
          setIsLoading(false);
        }
      };

      fetchAdditionalData();
    } else {
      setComments([]);
      setHashtags([]);
      setIsLoading(false);
    }
  }, [isOpen, festival]);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(false);
      setTimeout(() => {
        setIsAnimating(true);
      }, 50);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  if (!isOpen || !festival) return null;

  return (
    <ModalWrapper onClick={onClose}>
      <ModalContent
        className={isAnimating ? 'open' : ''}
        $initialPosition={initialPosition}
        onClick={(e) => e.stopPropagation()}
      >
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <TopSection>
          <ImageWrapper>
            <img src={festival.imageUrl} alt="축제 포스터" />
          </ImageWrapper>
          <InfoWrapper>
            <h2>{festival.title || '제목 없음'}</h2>
            <p>{festival.start_date && festival.end_date ? `${festival.start_date} ~ ${festival.end_date}` : '내용 없음'}</p>
            <p>{hashtags.length > 0 ? hashtags.slice(0, 5).map((tag) => `#${tag.tag}`).join(' ') : '태그 없음'}</p>
          </InfoWrapper>
        </TopSection>
        <BottomSection>
          <h3>댓글</h3>
          {isLoading ? (
            <p>로딩 중입니다...</p>
          ) : comments.length > 0 ? (
            comments.slice(0, 5).map((comment) => (
              <CommentWrapper key={comment.id}>
                <CommentID>{comment.username}</CommentID>
                <CommentRating>{comment.rating}</CommentRating>
                <CommentText>{comment.comment}</CommentText>
              </CommentWrapper>
            ))
          ) : (
            <p>댓글이 없습니다.</p>
          )}
        </BottomSection>
      </ModalContent>
    </ModalWrapper>
  );
};

export default Modal;
