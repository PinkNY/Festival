import React, { useState } from 'react';
import axios from 'axios';
import { Utensils } from 'lucide-react';

import { Container, Title, Subtitle, InputContainer, Input, SubmitButton } from '../styles/FoodChatSt';

const FoodChat = () => {
  const [question, setQuestion] = useState(""); // 질문 상태
  const [answer, setAnswer] = useState(""); // 응답 상태
  const [history, setHistory] = useState([]); // 입력한 질문과 응답을 관리하는 상태

  // 질문 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question.trim()) {
      alert("질문을 입력해주세요.");
      return;
    }

    try {
      // 백엔드 API에 POST 요청
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/restaurant_chatbot/`,
        { question }
      );

      // 새로운 히스토리를 기존 히스토리에 추가
      setHistory([
        ...history,
        { question: question, answer: response.data.answer }, // 입력과 응답 저장
      ]);

      // 질문 초기화
      setQuestion("");
    } catch (error) {
      console.error("오류가 발생했습니다:", error);
      setHistory([
        ...history,
        { question: question, answer: "오류가 발생했습니다. 다시 시도해주세요." },
      ]);
    }
  };

  return (
    <Container>
      <Title>전국팔도 맛집피티</Title>
      <Subtitle>맛따라 멋따라 금강산도 식후경</Subtitle>
      <InputContainer>
        <Input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSubmit(e)} // 엔터 키 입력 감지
          placeholder="맛집 테마를 입력해주세요."
          aria-label="금강산도 식후경"
        />
        <SubmitButton type="submit" aria-label="검색" onClick={handleSubmit}>
          <Utensils className="w-6 h-6" />
        </SubmitButton>
      </InputContainer>

      {/* 히스토리 출력 */}
      {history.length > 0 && (
        <div style={{ marginTop: "30px", color: "white" }}>
          <h3 style={{ fontSize: "24px", color: "#ffcc00", marginBottom: "20px" }}>
            질문 및 응답 기록:
          </h3>
          <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
            {history.map((item, index) => (
              <li
                key={index}
                style={{
                  marginBottom: "30px",
                  padding: "15px",
                  borderRadius: "10px",
                  backgroundColor: "#2d2d2d",
                }}
              >
                <p style={{ color: "#ffcc00", fontWeight: "bold" }}>질문:</p>
                <p style={{ color: "#f1f1f1", marginBottom: "10px" }}>{item.question}</p>
                <p style={{ color: "#ffcc00", fontWeight: "bold" }}>응답:</p>
                {item.answer.split(/\n\d+\.\s/).map((subItem, subIndex) => {
                  // 응답 포맷팅
                  const [text, url] = subItem.split(/(https?:\/\/[^\s]+)/);
                  return (
                    <div key={subIndex}>
                      <p style={{ color: "#f1f1f1", marginBottom: "10px" }}>{text.trim()}</p>
                      {url && (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#00bfff", textDecoration: "underline" }}
                        >
                          {url}
                        </a>
                      )}
                    </div>
                  );
                })}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Container>
  );
};

export default FoodChat;
