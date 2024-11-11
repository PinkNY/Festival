import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SearchWrapper, SearchInput, SearchIcon, Button, ErrorMessage, LoadingSpinner } from "../styles/SearchSt";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      setError("검색어를 입력해주세요.");
      return;
    }
  
    if (!/^[가-힣]+$/.test(searchQuery.trim())) {
      setError("검색어는 한글만 입력해주세요.");
      return;
    }
  
    if (searchQuery.trim().length < 2) {
      setError("검색어는 두 글자 이상 입력해주세요.");
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/hashtags/?query=${searchQuery}`
      );
      navigate('/list', { state: { results: response.data, query: searchQuery } });
    } catch (err) {
      console.error(err);
      setError("검색 결과를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // Enter 키가 눌렸을 때 handleSearch 함수 호출
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <SearchWrapper>
      <SearchInput 
        type="text" 
        placeholder="축제 검색..." 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)} 
        onKeyDown={handleKeyDown} // Enter 키 이벤트 추가
      />
      <SearchIcon size={20} />
      <Button onClick={handleSearch}>검색</Button>

      {loading && <LoadingSpinner>검색 중...</LoadingSpinner>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </SearchWrapper>
  );
};

export default SearchBar;
