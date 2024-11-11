import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Chatbot from './Chatbot';
import KakaoMap from './components/Map';

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
  width: 800px;
  max-width: 90%;
  max-height: 90%;
  height: 50%;
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

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;
  height: 100%;
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RightSection = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
`;

const ImageWrapper = styled.div`
  width: 100%;
  img {
    width: 100%;
    border-radius: 8px;
  }
`;

const Tabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Tab = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  background: ${(props) => (props.isActive ? '#333' : '#eee')};
  color: ${(props) => (props.isActive ? 'white' : 'black')};
  cursor: pointer;
  border-radius: 4px;
`;

const TabContent = styled.div`
  display: ${(props) => (props.isActive ? 'block' : 'none')};
  flex: 1;
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

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const PaginationButton = styled.button`
  padding: 0.5rem;
  border: none;
  background: ${(props) => (props.isActive ? '#333' : '#eee')};
  color: ${(props) => (props.isActive ? 'white' : 'black')};
  cursor: pointer;
  border-radius: 4px;
`;

const Modal = ({ isOpen, onClose, festival, initialPosition }) => {
  const [comments, setComments] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('content');
  const [commentsPage, setCommentsPage] = useState(1);
  const COMMENTS_PER_PAGE = 3;

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
      console.log('Festival ID:', festival.id);
      setIsLoading(true);

      // 조회수 증가 API 호출
      const increaseViewCount = async () => {
        try {
          await axios.get(`${process.env.REACT_APP_API_URL}/api/festivals/${festival.id}/?t=${new Date().getTime()}`);
        } catch (error) {
          console.error('Error increasing view count:', error);
        }
      };

      increaseViewCount(); // 조회수 증가 함수 호출

      const fetchAdditionalData = async () => {
        try {
          const commentsUrl = `${process.env.REACT_APP_API_URL}/api/comments/?festa=${festival.id}`;
          const commentsResponse = await axios.get(commentsUrl);
          setComments(commentsResponse.data.filter(comment => Number(comment.festa) === Number(festival.id)));

          const hashtagsUrl = `${process.env.REACT_APP_API_URL}/api/hashtags/?festa=${festival.id}`;
          const hashtagsResponse = await axios.get(hashtagsUrl);
          setHashtags(hashtagsResponse.data.filter(hashtag => Number(hashtag.festa) === Number(festival.id)));
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

  const totalPages = Math.ceil(comments.length / COMMENTS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCommentsPage(pageNumber);
  };

  if (!isOpen || !festival) return null;

  return (
    <ModalWrapper onClick={onClose}>
      <ModalContent
        className={isAnimating ? 'open' : ''}
        $initialPosition={initialPosition}
        onClick={(e) => e.stopPropagation()}
      >
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <ContentWrapper>
          <LeftSection>
            <ImageWrapper>
              <img src={festival.imageUrl} alt="축제 포스터" />
            </ImageWrapper>
          </LeftSection>
          <RightSection>
            <Chatbot />
            <Tabs>
              <Tab isActive={activeTab === 'content'} onClick={() => setActiveTab('content')}>내용</Tab>
              <Tab isActive={activeTab === 'info'} onClick={() => setActiveTab('info')}>정보</Tab>
              <Tab isActive={activeTab === 'comments'} onClick={() => setActiveTab('comments')}>댓글</Tab>
              <Tab isActive={activeTab === 'map'} onClick={() => setActiveTab('map')}>위치</Tab>
            </Tabs>
            <TabContent isActive={activeTab === 'content'}>
              <h2>{festival.title || '제목 없음'}</h2>
              <p>{festival.start_date && festival.end_date ? `${festival.start_date} ~ ${festival.end_date}` : '내용 없음'}</p>
              <p>{festival.introduction || '소개 없음'}</p>
              <p>{hashtags.length > 0 ? hashtags.map((tag, index) => `${index === 0 ? `#${tag.tag.replace(/^#+/, '')}` : `#${tag.tag}`}`).join(' ') : '태그 없음'}</p>
            </TabContent>
            <TabContent isActive={activeTab === 'info'}>
              <h2>{festival.title || '제목 없음'}</h2>
              <div style={{ display: 'flex', gap: '10px', margin: '10px 0' }}>
                {festival.intro_image1 && <img src={festival.intro_image1} alt='Introduction Image 1' style={{ width: '150px', height: 'auto' }} />}
                {festival.intro_image2 && <img src={festival.intro_image2} alt='Introduction Image 2' style={{ width: '150px', height: 'auto' }} />}
                {festival.intro_image3 && <img src={festival.intro_image3} alt='Introduction Image 3' style={{ width: '150px', height: 'auto' }} />}
              </div>
              <p>입장료: {festival.entry_fee || '정보 없음'}</p>
              <p>주소: {festival.address || '주소 없음'}</p>
              {festival.official_site_url && (
                <p>
                  공식 사이트: <a href={festival.official_site_url} target="_blank" rel="noopener noreferrer">{festival.official_site_url}</a>
                </p>
              )}
            </TabContent>
            <TabContent isActive={activeTab === 'comments'}>
              <h3>댓글</h3>
              {isLoading ? (
                <p>로딩 중입니다...</p>
              ) : comments.length > 0 ? (
                <>
                  {comments.slice((commentsPage - 1) * COMMENTS_PER_PAGE, commentsPage * COMMENTS_PER_PAGE).map((comment) => (
                    <CommentWrapper key={comment.id}>
                      <CommentID>{comment.username}</CommentID>
                      <CommentRating>{comment.rating}</CommentRating>
                      <CommentText>{comment.comment}</CommentText>
                    </CommentWrapper>
                  ))}
                  <PaginationWrapper>
                    {Array.from({ length: totalPages }, (_, index) => (
                      <PaginationButton
                        key={index + 1}
                        isActive={commentsPage === index + 1}
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </PaginationButton>
                    ))}
                  </PaginationWrapper>
                </>
              ) : (
                <p>댓글이 없습니다.</p>
              )}
            </TabContent>
            <TabContent isActive={activeTab === 'map'}>
              <KakaoMap address={festival.adress} />
            </TabContent>
          </RightSection>
        </ContentWrapper>
      </ModalContent>
    </ModalWrapper>
  );
};

export default Modal;
