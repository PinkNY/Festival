import React, { useState } from 'react';
import axios from 'axios';
import { Utensils } from 'lucide-react';

import { Container, Title, Subtitle, InputContainer, Input, SubmitButton } from './FoodChatSt';

const FoodChat = () => {
  const [question, setQuestion] = useState(""); // 질문을 관리하는 상태
  const [answer, setAnswer] = useState(""); // 응답을 관리하는 상태

  // 질문 제출 핸들러 함수
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question.trim()) {
      alert("질문을 입력해주세요.");
      return;
    }

    try {
      // 백엔드 API에 POST 요청 보내기
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/restaurant_chatbot/`, {
        question: question,
      });

      // 응답 저장
      setAnswer(response.data.answer);
      // 질문 초기화
      setQuestion("");
    } catch (error) {
      console.error("오류가 발생했습니다:", error);
      setAnswer("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  // 응답 내용을 숫자 리스트 형식으로 분할하여 각 항목을 리스트로 렌더링
  const formattedAnswer = answer.split(/\n\d+\.\s/).map((item, index) => {
    if (index === 0) {
      return <p key={index} style={{ color: '#f1f1f1', fontSize: '16px', marginBottom: '10px' }}>{item.trim()}</p>; // 첫 번째 항목은 일반 설명 부분일 가능성이 높음
    }

    // 항목 내 URL 추출
    const [text, url] = item.split(/(https?:\/\/[^\s]+)/);

    return (
      <li
        key={index}
        style={{
          color: '#f1f1f1',
          marginBottom: '30px', // 리스트 간 간격을 넓게 설정
          lineHeight: '1.7', // 줄 간격 설정
          wordBreak: 'break-word', // 긴 단어를 줄바꿈
          whiteSpace: 'pre-wrap', // 줄바꿈과 공백 유지
          fontSize: '18px', // 폰트 크기 조정
        }}
      >
        {text.trim()}
        {url && (
          <div style={{ marginTop: '10px' }}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#00bfff', textDecoration: 'underline' }} // 링크 색상 설정 및 밑줄 추가
            >
              {url}
            </a>
          </div>
        )}
      </li>
    );
  });

  return (
    <Container>
      <Title>전국팔도 맛집피티</Title>
      <Subtitle>맛따라 멋따라 금강산도 식후경</Subtitle>
      <InputContainer>
        <Input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)} // 엔터 키 입력 감지
          placeholder="맛집 테마를 입력해주세요."
          aria-label="금강산도 식후경"
        />
        <SubmitButton type="submit" aria-label="검색" onClick={handleSubmit}>
          <Utensils className="w-6 h-6" />
        </SubmitButton>
      </InputContainer>

      {answer && (
        <div style={{ marginTop: '30px', color: 'white' }}>
          <h3 style={{ fontSize: '24px', color: '#ffcc00', marginBottom: '20px' }}>응답:</h3>
          <ul style={{ listStyleType: 'disc', paddingLeft: '25px' }}>
            {formattedAnswer}
          </ul>
        </div>
      )}
    </Container>
  );
};

export default FoodChat;
