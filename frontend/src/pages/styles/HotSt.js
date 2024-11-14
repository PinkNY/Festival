import styled from "styled-components";

export const Card = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.4);
  overflow: hidden;
`;

export const CardHeader = styled.div`
  background-color: #3b82f6;
  color: white;
  padding: 1rem;
`;

export const CardTitle = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  display: flex;
  justify-content: center;
  margin: 0;
`;

export const BottomRightText = styled.div`
  position: absolute;
  right: 10px;
  bottom: 10px;
  font-size: 10px;
  color: white;
`;

export const CardContent = styled.div`
  padding: 1rem;
`;

export const FestivalGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const FestivalCard = styled(Card)`
  cursor: pointer;
  
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
`;

export const MoreCard = styled(Card)`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  font-weight: bold;
  font-size: 20px;

  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
`;