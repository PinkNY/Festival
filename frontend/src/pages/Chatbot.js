import React, { useEffect, useState, useRef } from 'react';
import { ChatbotButton, ChatbotWindow, ChatbotMessages, SearchInput, SendWindow, ChatBubble, StyledButton } from './ChatbotSt';
import { MessageCircle, X } from 'lucide-react';
import axios from 'axios';

const Chatbot = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: "안녕하세요! 무엇을 도와드릴까요?", isUser: false }]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isChatbotOpen) {
        setIsChatbotOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isChatbotOpen]);

  const handleSendMessage = async () => {
    if (input.trim()) {
      console.log("Sending message:", input); // 입력된 메시지 확인

      console.log("Clearing input"); // 입력창 비우기 확인
      setInput("");

      setMessages(prevMessages => [...prevMessages, { text: input, isUser: true }]);
      try {
        const url = `${process.env.REACT_APP_API_URL}/api/chat_with_bot/`;
        console.log("Request URL:", url); // 요청 URL 확인
        console.log("Request Payload:", { input_user: input }); // 요청 페이로드 확인

        // 백엔드에 메시지 전송
        const response = await axios.post(url, { input_user: input });
        console.log("Response data:", response.data); // 백엔드 응답 데이터 확인

        setMessages(prevMessages => [...prevMessages, { text: response.data.response, isUser: false }]);
      } catch (error) {
        console.error("챗봇 응답 오류:", error); // 오류 메시지 출력
        console.log("Error config:", error.config); // 오류 설정 확인
        console.log("Error response:", error.response); // 서버 응답 확인
      }      
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      <ChatbotButton onClick={() => setIsChatbotOpen(!isChatbotOpen)}>
        {isChatbotOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </ChatbotButton>
      {isChatbotOpen && (
        <ChatbotWindow>
          <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.5rem' }}>축제 도우미</h3>
          <ChatbotMessages>
            {messages.map((msg, index) => (
              <ChatBubble key={index} isUser={msg.isUser}>{msg.text}</ChatBubble>
            ))}
            <div ref={messagesEndRef} />
          </ChatbotMessages>
          <SendWindow>
            <SearchInput 
              type="text" 
              placeholder="메시지를 입력하세요..." 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyPress={handleKeyPress} 
            />
            <StyledButton primary onClick={handleSendMessage} style={{ width: '20%' }}>전송</StyledButton>
          </SendWindow>
        </ChatbotWindow>
      )}
    </>
  );
};

export default Chatbot;
