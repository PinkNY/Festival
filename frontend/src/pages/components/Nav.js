import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Menu } from 'lucide-react';

import { Nav, NavContent, Logo, NavButtons, Button, SearchCon } from '../styles/NavSt';
import SearchBar from "./Search";
import Ham from "./Ham";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  const handleLogoClick = () => {
    navigate('/');
  };
  const handleLoginClick = () => {
    if (isLoggedIn) {
      // 로그아웃 처리
      setIsLoggedIn(false);
      // 토큰 삭제등의 로그아웃 로직 추가
    } else {
      //  로그인 페이지로 이동
      navigate('/login');
    }
  };

  return (
    <Nav>
      <NavContent>
        <Logo onClick={handleLogoClick}>축제로</Logo>
        <NavButtons>
          {searchOpen && <SearchBar />}
          <SearchCon size={20} onClick={toggleSearch} />

          {/* 데스크탑 및 태블릿: 알림과 로그인 버튼은 네비게이션 바에 직접 표시 */}
          <Button ghost className="bell-icon desktop-only">
            <Bell size={25} />
          </Button>
          <Button
            primary
            className="login-button desktop-only"
            onClick={handleLoginClick}
          >
            {isLoggedIn ? '로그아웃' : '로그인'}
          </Button>
          
          {/* 햄버거 메뉴 아이콘은 모든 환경에서 항상 보이게 */}
          <Button ghost onClick={toggleMenu} className="hamburger-button">
            <Menu size={35} />
          </Button>
        </NavButtons>
      </NavContent>

      {/* 모바일에서 햄버거 메뉴가 열렸을 때 나타나는 메뉴 */}
      <Ham menuOpen={menuOpen} toggleMenu={toggleMenu}/>
    </Nav>
  );
};

export default Navbar;