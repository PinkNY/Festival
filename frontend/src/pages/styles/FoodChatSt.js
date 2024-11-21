import styled from 'styled-components'


export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #1a1a1a;
  padding: 2rem;
`;

export const Title = styled.h1`
  color: #ffffff;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-align: center;
`;

export const Subtitle = styled.h2`
  color: #a1a1a1;
  font-size: 1rem;
  margin-bottom: 2rem;
  text-align: center;
`;

export const InputContainer = styled.div`
  position: relative;
  width: 70%;
`;

export const Input = styled.input`
  width: 100%;
  padding: 1rem;
  padding-right: 3rem;
  background-color: #2d2d2d;
  border: 1px solid #404040;
  border-radius: 0.5rem;
  color: #ffffff;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #666666;
  }

  &::placeholder {
    color: #666666;
  }
`;

export const SubmitButton = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666666;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s;

  &:hover {
    color: #ffffff;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;