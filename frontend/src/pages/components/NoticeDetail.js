import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Title, MetaInfo, Content, Button } from "../styles/NoticeDetailSt";

const NoticeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 데이터를 가져오는 함수
    const fetchNotice = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/notices/${id}`);
        setNotice(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchNotice();
  }, [id]);

  const handleNoticeClick = () => {
    navigate('/notice');
  };
  const handleEdit = () => {
    console.log('수정 버튼 클릭');
  };
  const handleDelete = () => {
    console.log('삭제 버튼 클릭');
  };

  if (loading) {
    return <Container>로딩 중...</Container>;
  }

  if (error) {
    return <Container>{error}</Container>;
  }

  if (!notice) {
    return <Container>게시글을 찾을 수 없습니다.</Container>;
  }

  return (
    <Container>
      <Title>{notice.title}</Title>
      <MetaInfo>
        작성자: {notice.author} | 작성일: {notice.date}
      </MetaInfo>
      <Content>
        {notice.content.split('\n').map((line, index) => (
          <React.Fragment key={index}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </Content>
      <Button onClick={handleNoticeClick}>목록으로 돌아가기</Button>
      <Button onClick={handleEdit}>수정</Button>
      <Button onClick={handleDelete}>삭제</Button>
    </Container>
  );
};

export default NoticeDetail;
