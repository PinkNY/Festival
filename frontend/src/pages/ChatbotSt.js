import styled from "styled-components";
import { media } from './MediaQ';

export const ChatbotWindow = styled.div`
  position: fixed;
  bottom: 5rem;
  right: 1rem;
  width: 40%;
  height: 60%;
  background-color: white;
  // border: 5px solid #e5e7eb;
  border: 3px solid #3b82f6;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  z-index: 9999;

  ${media.mobile} {
    width: 70vw;
    height: 60vh;
  }
`;

export const ChatbotMessages = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 1rem;
  background-color: white;
  padding: 0.5rem;
  border-radius: 0.25rem;
  height: 100%;
  overflow-y: auto;

  // border: 2px solid black;
`;

// 새롭게 추가된 말풍선 스타일
export const ChatBubble = styled.div`
  position: relative;
  background: ${(props) => (props.isUser ? '#d0e7ff' : '#f1f0f0')}; /* 사용자와 챗봇에 따라 배경색 변경 */
  border-radius: 15px;
  padding: 10px 15px;
  margin-bottom: 10px;
  max-width: ${(props) => (props.isUser ? '70%' : '70%' )};
  color: #333;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
  align-self: ${(props) => (props.isUser ? 'flex-end' : 'flex-start')};

  &::after {
    content: '';
    position: absolute;
    top: 10px;
    ${(props) =>
      props.isUser
        ? `
          right: -10px;
          border: 10px solid transparent;
          border-left-color: #d0e7ff;
          border-right: 0;
        `
        : `
          left: -10px;
          border: 10px solid transparent;
          border-right-color: #f1f0f0;
          border-left: 0;
        `}
    margin-top: 0;
  }
`;

export const SendWindow = styled.div`
  display: flex;
  width: 100%;
  gap: 10px;
  justify-content: center;
  align-items: center;
`;

export const ChatbotButton = styled.button`
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #3b82f6;
  color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  &:hover {
    background-color: #2563eb;
  }
`;

export const StyledButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #3b82f6;
  border-radius: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  ${(props) =>
    props.primary &&
    `
    background-color: #3b82f6;
    color: white;
    &:hover {
      background-color: #2563eb;
    }
  `}

  ${(props) =>
    props.ghost &&
    `
    background-color: transparent;
    &:hover {
      background-color: #f3f4f6;
    }
  `}
`;

export const SearchInput = styled.input`
  width: 80%;
  padding: 0.5rem 1rem 0.5rem 0.5rem;
  border-radius: 9999px;
  border: 2px solid #3b82f6;
  font-size: 15px;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
  }
`;