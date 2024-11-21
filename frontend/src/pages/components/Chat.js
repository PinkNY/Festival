
// 현재 사용 X

import React, { useState } from "react";
import axios from "axios";
import { Utensils } from "lucide-react";
import {
  ChatContainer,
  ChatMessages,
  ChatInputContainer,
  ChatInput,
  ChatButton,
  ChatMessageBubble,
  ChatHeader,
  ChatFooter,
  LeftHeaders,
  LeftHeader1,
  RightHeader,
  LeftHeader2,
} from "../styles/ChatSt";

const ChatComponent = ({ closeChat }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState([]);
  const [selectedChatbot, setSelectedChatbot] = useState("");

  const handleHeader1Click = (e) => {
    e.preventDefault(); // 기본 동작 차단
    setSelectedChatbot("restaurant_chatbot");
    setAnswer([]);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault(); // 기본 동작 차단
    
    if (!question.trim()) return;

    setAnswer([...answer, { sender: "user", text: question }]);

    try {
      if (selectedChatbot === "restaurant_chatbot") {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/restaurant_chatbot/`, {
            question: question.trim(), // 공백 제거 후 전송
          }
        );

        setAnswer((prev) => [
          ...prev,
          { sender: "bot", text: response.data.response },
        ]);
      }
    } catch (error) {
      console.error("Error connecting to chatbot:", error);
      setAnswer((prev) => [
        ...prev,
        { sender: "bot", text: "챗봇 연결에 문제가 발생했습니다." },
      ]);
    }

    setQuestion("");
  };

  const handleCloseChat = (e) => {
    e.preventDefault(); // 기본 동작 차단
    closeChat(); // 기존 closeChat 함수 호출
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <LeftHeaders>
          <LeftHeader1
            onClick={handleHeader1Click}
            clicked={selectedChatbot === "restaurant_chatbot"}
          >
            전국팔도 맛집피티 1
          </LeftHeader1>
          <LeftHeader2 disabled>
            전국팔도 맛집피티 2
          </LeftHeader2>
        </LeftHeaders>
        <RightHeader>
          {/* 새로고침 방지 */}
          <button type="button" onClick={handleCloseChat}>✖</button>
        </RightHeader>
      </ChatHeader>
      <ChatMessages>
        {answer.map((msg, index) => (
          <ChatMessageBubble key={index} sender={msg.sender}>
            {msg.text}
          </ChatMessageBubble>
        ))}
      </ChatMessages>
      <ChatInputContainer>
        <ChatInput
          type="text"
          placeholder="메시지를 입력해주세요."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage(e)}
          disabled={!selectedChatbot}
        />
        <ChatButton onClick={handleSendMessage} disabled={!selectedChatbot}>
          <Utensils className="w-6 h-6" />
        </ChatButton>
      </ChatInputContainer>
      <ChatFooter>
        <p>
          크게 보고싶으시면{" "}
          <a href="http://localhost:3030" target="_blank" rel="noopener noreferrer">
            여기
          </a>
          를 클릭해주세요.
        </p>
      </ChatFooter>
    </ChatContainer>
  );
};

export default ChatComponent;
