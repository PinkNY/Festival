import React, { useState } from 'react';
import { ChatbotButton, ChatbotWindow, ChatbotMessages, SearchInput, SendWindow, ChatBubble, StyledButton } from './ChatbotSt';
import { MessageCircle, X } from 'lucide-react';


const Chatbot = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  return (
    <>
      <ChatbotButton onClick={() => setIsChatbotOpen(!isChatbotOpen)}>
        {isChatbotOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </ChatbotButton>
      {isChatbotOpen && (
        <ChatbotWindow>
          <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.5rem' }}>챗봇</h3>
          <ChatbotMessages>
            <ChatBubble>안녕하세요! 무엇을 도와드릴까요?</ChatBubble>
          </ChatbotMessages>
          <SendWindow>
            <SearchInput type="text" placeholder="메시지를 입력하세요..." />
            <StyledButton primary style={{ width: '20%' }}>전송</StyledButton>
          </SendWindow>
        </ChatbotWindow>
      )}
    </>
  );
};

export default Chatbot;