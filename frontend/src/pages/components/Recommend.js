import React from 'react';
import { Container, Title, Subtitle, InputWrapper, Input, SearchIcon } from '../styles/RecommendSt';

const Recommend = () => {
  return (
    <Container>
      <Title>전국팔도 맛집피티</Title>
      <Subtitle>맛따라 멋따라 금강산도 식후경</Subtitle>
      <InputWrapper>
        <Input placeholder="맛집 테마를 입력해주세요." />
        <SearchIcon>ψ</SearchIcon>
      </InputWrapper>
    </Container>
  );
};

export default Recommend;
