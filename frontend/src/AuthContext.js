// AuthContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // 서버에 토큰 유효성을 확인하는 API 요청
      fetch('/api/validate-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.valid) {
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
            localStorage.removeItem('authToken');
          }
        })
        .catch((error) => {
          console.error('Token validation failed:', error);
          setIsLoggedIn(false);
          localStorage.removeItem('authToken');
        });
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const login = async (username, password) => {
    try {
      // 서버에 로그인 요청
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        setIsLoggedIn(true);
      } else {
        console.error('Login failed:', data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

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
