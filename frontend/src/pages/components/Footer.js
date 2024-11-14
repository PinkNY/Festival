// Footer.js
import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  padding: 20px;
  text-align: center;
  background-color: #333;
  color: #fff;
  font-size: 14px;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <p>© {new Date().getFullYear()} DOWON. All rights reserved.</p>
      <p>
        <a href="/terms" style={{ color: '#ccc', margin: '0 10px' }}>이용 약관</a> |
        <a href="/privacy" style={{ color: '#ccc', margin: '0 10px' }}>개인정보 처리 방침</a>
      </p>
    </FooterContainer>
  );
};

export default Footer;
