'use client';

import React, { useRef } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #ececec;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  width: 500px;
  height: 500px;
  perspective: 1200px;
  position: relative;
  transform-style: preserve-3d;
`;

const InnerContainer = styled.div`
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 24px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
  position: absolute;
  transform-style: preserve-3d;
  transform: rotateX(-20deg) rotateY(-65deg) translateZ(0px);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BlueContainer = styled.div`
  width: 100%;
  height: 100%;
  background: #2a7cf7;
  border-radius: 24px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  position: absolute;
  transform-style: preserve-3d;
  transform: rotateX(-20deg) rotateY(-65deg) translateZ(-300px); // ✅ 더 뒤로
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Label = styled.div`
  color: white;
  font-size: 20px;
  font-weight: 600;
  text-align: center;
`;

const Test = () => {
  return (
    <Wrapper>
      <Container>
        <BlueContainer>
          <Label>뒤에 있는 파란 박스 (Z: -300)</Label>
        </BlueContainer>
        <InnerContainer>
          <Label style={{ color: '#111' }}>앞에 있는 흰 박스 (Z: 0)</Label>
        </InnerContainer>
      </Container>
    </Wrapper>
  );
};

export default Test;
