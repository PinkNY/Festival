import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border: 1px solid #ddd;
  background-color: #1c1c1c; /* 검은 배경 */
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  color: white;
  text-align: center;
`;

export const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 8px;
`;

export const Subtitle = styled.p`
  font-size: 14px;
  margin-bottom: 16px;
  color: #aaa;
`;

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const Input = styled.input`
  width: 100%;
  padding: 8px 40px 8px 16px;
  font-size: 14px;
  border: 1px solid #555;
  border-radius: 4px;
  background-color: #333;
  color: white;
  outline: none;

  ::placeholder {
    color: #888;
  }
`;

export const SearchIcon = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  color: #aaa;
`;
