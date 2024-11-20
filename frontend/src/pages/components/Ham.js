import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { X, Bell } from 'lucide-react';
import { MobileMenu, Button, TopContainer, MiddleContainer } from '../styles/HamSt'; // 필요한 스타일 임포트

const Ham = ({ menuOpen, toggleMenu }) => {
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // 메뉴 외부를 클릭하면 메뉴를 닫는 기능
  useEffect(() => {
    const handleClickOutside = (event) => {
      // 메뉴가 열려 있을 때만 외부 클릭을 감지하여 메뉴를 닫음
      if (menuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
        toggleMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen, toggleMenu]);

  const handleLoginClick = () => {
    toggleMenu(); // 메뉴 닫기
    navigate('/login');
  };
  const handleListClick = () => {
    toggleMenu();
    navigate('/list')
  }

  return (
    <MobileMenu open={menuOpen} ref={menuRef}>
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
        <p style={{ cursor: 'pointer' }} onClick={handleListClick}>축제 목록</p>
        <a style={{ cursor: 'pointer', textDecoration: 'none', color: 'black' }} href="http://localhost:3030" target="_blank" rel="noopener noreferrer">맛집피티</a>
        {/* <p style={{ cursor: 'pointer' }} onClick={handleFestivalChatClick}>맞춤 축제</p> */}
      </MiddleContainer>
    </MobileMenu>
  );
};

export default Ham;