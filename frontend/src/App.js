// import React, { useState } from "react";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";

import MainPage from "./pages/components/Main";
import Navbar from './pages/components/Nav';
import LoginPage from "./pages/components/Login";
import SignUp from "./pages/components/Signup";
import NoticeBoard from "./pages/components/NoticeBoard";
import NoticeDetail from "./pages/components/NoticeDetail";
import FestivalList from './pages/components/List';
import Footer from "./pages/components/Footer";

// import ChatbotIcon from "./pages/components/ChatCon"; // 챗봇 아이콘 컴포넌트
// import ChatComponent from "./pages/components/Chat"; // 챗봇 채팅창 컴포넌트

const App = () => {
  // const [chatOpen, setChatOpen] = useState(false); // 챗봇 상태 관리

  // const openChat = () => setChatOpen(true); // 챗봇 열기
  // const closeChat = () => setChatOpen(false); // 챗봇 닫기

  const AuthRoutes = () => {
    const { isLoggedIn } = useAuth();
    return (
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <LoginPage />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/notice' element={<NoticeBoard />} />
        <Route path='/notice-detail' element={<NoticeDetail />} />
        <Route path="/list" element={<FestivalList />} />
      </Routes>
    );
  };

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <AuthRoutes />
        <Footer />
        {/* <ChatbotIcon onClick={openChat} />
        {chatOpen && <ChatComponent closeChat={closeChat} />} */}
      </Router>
    </AuthProvider>
  );
};

export default App;
