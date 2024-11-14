import styled from "styled-components";
import { media } from "../MediaQ";

export const Card = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: 350px;

  border: 3px solid black;
  
  margin-bottom: 16px;
`;

export const CardHeader = styled.div`
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem;

  border-bottom: 1px solid #e0e0e0;
`;

export const CardTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  justify-content: center;
  margin: 0;

  color: white;
`;

export const MapPlaceholder = styled.div`
  background-color: #e5e7eb;
  height: 16rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  
  ${media.mobile} {
    height: 20rem;
  }

  ${media.tablet} {
    height: 24rem;
  }
`;

export const PositionLabel = styled.div`
  padding: 5px;
  background-color: #f0f0f0;
  color: #0066cc;
  font-weight: bold;
  border-radius: 8px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
`;