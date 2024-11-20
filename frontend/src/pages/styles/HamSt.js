import styled from "styled-components";

export const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  ${(props) =>
    props.primary &&
    `
    width: 80px;
    height: 35px;
    font-size: 15px;
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

export const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 35%;
  height: 100vh;
  display: ${({ open }) => (open ? 'block' : 'none')};
  z-index: 9999;
  background-color: white;

  // border: 1px solid black;
  // background-color: transparent;

  .close-button {
    position: absolute;
    top: 20px;
    right: 20px;
  }
`;

export const TopContainer = styled.div`
  display: flex;
  width: 75%;
  align-items: center;
  justify-content: flex-end;
  height: 90px;
  z-index: 999;
  gap: 5px;

  // border: 1px solid black;
`;

export const MiddleContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  font-size: 30px;
  z-index: 999;

  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  
  // border: 1px solid black; 
`;