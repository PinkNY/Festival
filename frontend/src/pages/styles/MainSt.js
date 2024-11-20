import styled from 'styled-components';
import { media } from '../MediaQ';

export const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #DFF2EB;
`;

export const MainContent = styled.main`
  flex-grow: 1;
  padding: 2rem 1rem;
  display: flex;
  margin: 0 auto;
  justify-content: center;
  flex-direction: column;
  gap: 2rem;

  ${media.mobile} {
    margin: 0;
  }
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

export const Button = styled.button`
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

export const ChatbotButton = styled(Button)`
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

export const ChatbotWindow = styled.div`
  position: fixed;
  bottom: 5rem;
  right: 1rem;
  width: 20rem;
  height: 24rem;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1rem;
  display: flex;
  flex-direction: column;

  ${media.mobile} {
    width: 70vw;
    height: 60vh;
  }
`;

export const ChatbotMessages = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 1rem;
  background-color: white;
  padding: 0.5rem;
  border-radius: 0.25rem;
`;

// 새롭게 추가된 말풍선 스타일
export const ChatBubble = styled.div`
  position: relative;
  background: #f1f0f0; /* 말풍선 배경색 */
  border-radius: 15px;
  padding: 10px 15px;
  margin-bottom: 10px;
  max-width: 80%;
  color: #333;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);

  &::after {
    content: '';
    position: absolute;
    top: 10px;
    left: -10px;
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-right-color: #f1f0f0;
    border-left: 0;
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

export const HalfBox = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;

  ${media.mobile} {
    flex-direction: column;
  }
`;
