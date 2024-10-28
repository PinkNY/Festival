import React from "react";
import { useNavigate } from "react-router-dom";

import { X, Bell } from 'lucide-react';
import { MobileMenu, Button, TopContainer, MiddleContainer } from '../styles/HamSt'; // 필요한 스타일 임포트

const Ham = ({ menuOpen, toggleMenu }) => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };
  const handleListClick = () => {
    navigate('/list')
  }
  const handleNoticeClick = () => {
    navigate('/notice')
  }

  return (
    <MobileMenu open={menuOpen}>
      <TopContainer>
        <Button ghost>
          <Bell size={25} />
        </Button>
        <Button primary onClick={handleLoginClick}>로그인</Button>
      </TopContainer>
      <Button ghost onClick={toggleMenu} className="close-button">
        <X size={35} />
      </Button>
      <MiddleContainer>
        <p>내 정보</p>
        <p style={{ cursor: 'pointer' }} onClick={handleListClick}>축제 목록</p>
        <p style={{ cursor: 'pointer' }} onClick={handleNoticeClick}>공지사항</p>
      </MiddleContainer>
    </MobileMenu>
  );
};

export default Ham;