
// 현재 사용 X

import React from "react";
import Draggable from "react-draggable";
import styled from "styled-components";

const IconContainer = styled.div`
  width: 70px;
  height: 70px;
  background-color: #007bff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 32px;
  cursor: pointer;
  position: fixed;
  bottom: 20px;
  right: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);

  &:hover {
    background-color: #0056b3;
  }
`;

const ChatbotIcon = ({ onClick }) => {
  return (
    <Draggable>
      <IconContainer onClick={onClick}>🤖</IconContainer>
    </Draggable>
  );
};

export default ChatbotIcon;
