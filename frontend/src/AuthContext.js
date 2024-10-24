import React, { createContext, useState, useContext } from 'react';

// Context 생성
const AuthContext = createContext();

// Context를 사용하기 위한 커스텀 훅
export const useAuth = () => useContext(AuthContext);

// Provider 컴포넌트
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 로그인 함수: localStorage에 토큰 저장 및 로그인 상태 설정
  const login = (token) => {
    localStorage.setItem('authToken', token);
    setIsLoggedIn(true);
  };

  // 로그아웃 함수: localStorage에서 토큰 제거 및 로그인 상태 해제
  const logout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
