import React from 'react';
import { PageWrapper, MainContent, HalfBox } from '../styles/MainSt';
import Notice from './Notice';
import Hotlist from './Hot';
import MapContainer from './Map';
import Chatbot from '../Chatbot';

export default function MainPage() {
  return (
    <PageWrapper>
      <MainContent>
        <Notice />
        <HalfBox>
          <Hotlist />
          <Hotlist />
        </HalfBox>
        <MapContainer />
      </MainContent>
      <Chatbot />
    </PageWrapper>
  );
}