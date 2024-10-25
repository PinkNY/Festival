import styled from "styled-components";
// import { media } from "../MediaQ";

import { FaSearch } from "react-icons/fa";

export const Nav = styled.nav`
  background-color: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  padding: 1rem;
  position: sticky;
  top: 0;
  z-index: 10;
`;

export const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Logo = styled.div`
  font-size: 3rem;
  font-weight: bold;
  color: #3b82f6;
  cursor: pointer;
`;

export const SearchCon = styled(FaSearch)`
  cursor: pointer;
`;

export const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  ${(props) =>
    props.primary &&
    `
    width: 80px;
    height: 35px;
    font-size: 15px;
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

export const NavButtons = styled.div`
  display: flex;
  align-items: center;

  /* 데스크탑 및 태블릿에서는 알림과 로그인 버튼이 보이게 설정 */
  .desktop-only {
    display: none;
  }

  /* 모바일에서는 햄버거 메뉴 안으로 들어감 */
  @media (min-width: 768px) {
    .desktop-only {
      display: block;
    }
  }
`;

export const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 50%;
  height: 100vh;
  background-color: white;
  display: ${({ open }) => (open ? 'block' : 'none')};
  z-index: 9999;

  .close-button {
    position: absolute;
    top: 20px;
    right: 20px;
  }
`;

export const MobileMenuCon1 = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  border: 3px solid black;
`;