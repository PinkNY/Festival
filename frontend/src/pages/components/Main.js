import React from 'react';
import { PageWrapper, MainContent, HalfBox } from '../styles/MainSt';
import Notice from './Notice';
import Hotlist from './Hot';
import KakaoMap from './Map';

export default function MainPage() {
  return (
    <PageWrapper>
      <MainContent>
        <Notice />
        <HalfBox>
          <Hotlist />
          <Hotlist />
        </HalfBox>
        <KakaoMap />
      </MainContent>
    </PageWrapper>
  );
}