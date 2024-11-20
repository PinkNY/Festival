import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #DFF2EB;
`;

export const Main = styled.main`
  max-width: 1280px;
  margin: 0 auto;
  padding: 1.5rem;
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1.5rem;
`;

export const FestivalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
`;

export const FestivalCard = styled(Link)`
  background-color: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
`;

export const FestivalImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
`;

export const FestivalInfo = styled.div`
  padding: 1rem;
  text-decoration: none;
`;

export const FestivalName = styled.h3`
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  text-decoration: none !important;

`;

export const FestivalDate = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  text-decoration: none;
`;

export const MoreButton = styled.button`
  display: block;
  margin: 2rem auto 0;
  background-color: #2563eb;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  &:hover {
    background-color: #1d4ed8;
  }
`;

export const FilterContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
`;

export const FilterSelect = styled.select`
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;