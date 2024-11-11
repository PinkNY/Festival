import React from 'react';
import { PageWrapper, MainContent, HalfBox } from '../styles/MainSt';
import Notice from './Notice';
import Clicklist from './HotClick';
import Searchlist from './HotSearch';

export default function MainPage() {
  return (
    <PageWrapper>
      <MainContent>
        <Notice />
        <HalfBox>
          <Clicklist />
          <Searchlist />
        </HalfBox>
      </MainContent>
    </PageWrapper>
  );
}