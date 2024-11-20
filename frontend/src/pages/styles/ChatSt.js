import styled from "styled-components";

export const ChatContainer = styled.div`
  position: fixed;
  bottom: 50px;
  right: 50px;
  width: 500px;
  height: 600px;
  background-color: #111;
  color: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  z-index: 1001;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #222;
`;

export const LeftHeaders = styled.div`
  flex: 9;
  display: flex;
  align-items: center;
`;

export const LeftHeader1 = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  font-size: 18px;
  font-weight: bold;
  justify-content: center;
  cursor: pointer;

  /* clicked 상태에 따라 동적 스타일링 */
  background-color: ${({ clicked }) => (clicked ? "black" : "#222")};

  transition: all 0.3s ease-in-out; /* 부드러운 전환 효과 */
`;

export const LeftHeader2 = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  font-size: 18px;
  font-weight: bold;
  justify-content: center;
  cursor: pointer;

  /* clicked 상태에 따라 동적 스타일링 */
  background-color: ${({ clicked }) => (clicked ? "black" : "#222")};

  transition: all 0.3s ease-in-out; /* 부드러운 전환 효과 */
`;


export const RightHeader = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  justify-content: center;

  button {
    background: none;
    border: none;
    color: #fff;
    font-size: 20px;
    cursor: pointer;

    &:hover {
      color: #f00;
    }
  }
`;

export const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`;

export const ChatInputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 20px 0 20px;
  background-color: #222;
`;

export const ChatInput = styled.input`
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #333;
  border-radius: 5px;
  background-color: #111;
  color: #fff;
  font-size: 16px;
  outline: none;

  &::placeholder {
    color: #666;
  }
`;

export const ChatButton = styled.button`
  margin-left: 10px;
  padding: 10px 20px;
  background-color: #111;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #0056b3;
  }
`;

export const ChatMessageBubble = styled.div`
  text-align: ${({ sender }) => (sender === "user" ? "right" : "left")};
  margin: 5px 0;

  span {
    display: inline-block;
    padding: 10px 15px;
    border-radius: 15px;
    background-color: ${({ sender }) =>
      sender === "user" ? "#007bff" : "#333"};
    color: #fff;
    max-width: 70%;
    word-wrap: break-word;
  }
`;

export const ChatFooter = styled.div`
  text-align: center;
  font-size: 0.9rem;
  color: #666;
  background-color: #222;

  a {
    color: #007bff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;