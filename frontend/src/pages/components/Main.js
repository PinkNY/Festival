import React from 'react';
import { PageWrapper, MainContent, HalfBox } from '../styles/MainSt';
import Notice from './Notice';
import Clicklist from './HotClick';
import Searchlist from './HotSearch';
import KakaoMap from './Map';

export default function MainPage() {
  return (
    <PageWrapper>
      <MainContent>
        <Notice />
        <HalfBox>
          <Clicklist />
          <Searchlist />
        </HalfBox>
        <KakaoMap />
      </MainContent>
    </PageWrapper>
  );
}