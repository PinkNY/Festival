import styled from "styled-components";
import { Search } from 'lucide-react';
import { media } from "../MediaQ";

export const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  width: 30rem;
  justify-content: center;
  gap: 10px;
  margin-right: 10px;
  
  // border: 3px solid black;

  ${media.mobile} {
    width: 18rem;
    gap: 5px;
  }

  ${media.tablet} {
    width: 27rem;
  }
`;

export const SearchInput = styled.input`
  width: 80%;
  font-size: 20px;
  padding: 0.5rem 0 0.5rem 3rem;
  border-radius: 9999px;
  border: 2px solid #3b82f6;

  ${media.mobile} {
    width: 100%;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
  }
`;

export const SearchIcon = styled(Search)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  
  ${media.pc} {
    position: absolute;
    left: 1.2rem;
  }

  ${media.tablet} {
    left: 1rem;
  }

  ${media.mobile} {
    left: 1rem;
  }
`;

export const Button = styled.button`
  padding: 0.5rem 1rem;
  border: 2px solid #3b82f6;
  border-radius: 15px;
  width: 80px;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  background-color: #3b82f6;
  color: white;
  white-space: nowrap;

  ${(props) =>
    props.primary &&
    `
    background-color: #3b82f6;
    color: white;
    &:hover {
      background-color: #2563eb;
    }
  `}

  ${(props) =>
    props.ghost &&
    `
    background-color: transparent;
    &:hover {
      background-color: #f3f4f6;
    }
  `}
`;

export const LoadingSpinner = styled.div`
  margin-top: 10px;
  font-size: 14px;
  color: #888;
`;

export const ErrorMessage = styled.div`
  margin-top: 10px;
  color: red;
  font-size: 14px;
`;

export const ResultsList = styled.ul`
  margin-top: 20px;
  list-style: none;
  padding: 0;

  li {
    padding: 8px 0;
    border-bottom: 3px solid #ddd;
  }
`;