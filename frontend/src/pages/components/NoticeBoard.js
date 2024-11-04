import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Title, Table, Th, Td, PaginationContainer, PageButton, SearchContainer, Select, Input, Button } from "../styles/NoticeBoardSt";

const NoticeBoard = () => {
  const [searchCategory, setSearchCategory] = useState("title");
  const [searchQuery, setSearchQuery] = useState("");
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // 공지사항 목록을 백엔드에서 가져오는 함수
    const fetchNotices = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/notice/`);
        setNotices(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  const handleNoticeDetail = (id) => {
    navigate(`/notice-detail/${id}`);
  };

  if (loading) {
    return <Container>로딩 중...</Container>;
  }

  if (error) {
    return <Container>{error}</Container>;
  }

  return (
    <Container>
      <Title>공지사항</Title>
      <Table>
        <thead>
          <tr>
            <Th>번호</Th>
            <Th>제목</Th>
            <Th>작성일</Th>
            <Th>작성자</Th>
          </tr>
        </thead>
        <tbody>
          {notices.map((notice) => (
            <tr key={notice.id}>
              <Td>{notice.id}</Td>
              <Td onClick={() => handleNoticeDetail(notice.id)} style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}>
                {notice.title}
              </Td>
              <Td>{notice.date}</Td>
              <Td>{notice.author}</Td>
            </tr>
          ))}
        </tbody>
      </Table>

      <PaginationContainer>
        {[1, 2, 3, 4, 5].map((page) => (
          <PageButton key={page}>
            {page}
          </PageButton>
        ))}
      </PaginationContainer>

      <SearchContainer>
        <Select
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
        >
          <option value="title">제목</option>
          <option value="content">내용</option>
          <option value="titleAndContent">제목+내용</option>
        </Select>
        <Input
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button>검색</Button>
      </SearchContainer>
    </Container>
  );
};

export default NoticeBoard;
