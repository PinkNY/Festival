// src/App.js
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

const App = () => {
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
      </Router>
    </AuthProvider>
  );
};

export default App;