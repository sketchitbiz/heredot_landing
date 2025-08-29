import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 384px;
  height: 217px;
  background: linear-gradient(135deg, #1e1b4b, #312e81, #1e1b4b);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.4),
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 16px 64px rgba(0, 0, 0, 0.2);
  color: white;
  font-family: "Pretendard", sans-serif;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 18px;
    background: linear-gradient(45deg, #8b5cfc, #22c55e, #8b5cfc, #22c55e);
    background-size: 400% 400%;
    z-index: -1;
    animation: gradientFlow 3s ease-in-out infinite;
  }
  
  @keyframes gradientFlow {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  background: #8b5cfc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Icon = styled.img`
  width: 22px;
  height: 22px;
`;

const TitleWrap = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: 700;
  margin: 0;
`;

const SubTitle = styled.p`
  font-size: 14px;
  font-weight: 400;
  margin: 4px 0 0 0;
  color: #d1d5db;
`;

const Button = styled.button`
  background: #8b5cfc;
  border: none;
  border-radius: 8px;
  padding: 12px;
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 8px 0;

  &:hover {
    background: #6a2ce3;
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: #4b5563;
  margin: 8px 0;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #9ca3af;
`;

const Status = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #aaa;
  font-size: 20px;
  cursor: pointer;
  margin-left: auto;

  &:hover {
    color: #fff;
  }
`;

const ProjectInquiryCard: React.FC<{
  onContactClick?: () => void;
}> = ({ onContactClick }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Container>
      <Header>
        <IconWrapper>
          <Icon src="/landing/recommendation/svg.png" alt="icon" />
        </IconWrapper>
        <TitleWrap>
          <Title>프로젝트 문의</Title>
          <SubTitle>새로운 프로젝트를 시작하고 싶으신가요?</SubTitle>
        </TitleWrap>
        <CloseButton onClick={handleClose}>×</CloseButton>
      </Header>

      <Button onClick={onContactClick}>
        <img src="/landing/recommendation/i.png" alt="send" width={16} height={24} />
        지금 문의하기
      </Button>

      <Divider />

      <Footer>
        <Status>
          <Dot />
          온라인
        </Status>
        <div>평균 응답시간: 2시간</div>
      </Footer>
    </Container>
  );
};

export default ProjectInquiryCard;
