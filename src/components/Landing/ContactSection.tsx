"use client";

import styled from "styled-components";
import { AppColors } from "@/styles/colors"; // 경로 확인 필요
import { AppTextStyles } from "@/styles/textStyles"; // 경로 확인 필요
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import ChatIcon from "@mui/icons-material/Chat"; // 예시 아이콘 (적절한 카카오 아이콘 사용 권장)

const SectionContainer = styled.div`
  background-color: ${AppColors.backgroundDark}; // 섹션 배경색
  padding: 64px 40px; // 패딩
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); // 반응형 그리드
  gap: 40px;
  max-width: 1000px; // 최대 너비 제한
  margin: 0 auto; // 중앙 정렬
`;

const ContactItem = styled.div`
  background-color: #1d1626; // 각 아이템 배경색
  padding: 32px;
  border-radius: 8px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px; // 내부 요소 간격
`;

const IconWrapper = styled.div`
  color: ${AppColors.onBackground}; // 아이콘 색상
  .MuiSvgIcon-root {
    font-size: 2.5rem; // 아이콘 크기
  }
`;

const ContactTitle = styled.h3`
  ${AppTextStyles.title3}
  color: ${AppColors.onBackground};
  margin: 0;
`;

const ContactInfo = styled.p`
  ${AppTextStyles.body1}
  color: ${AppColors.onBackground};
  margin: 0;
`;

const ContactButton = styled.a`
  ${AppTextStyles.button}
  display: inline-block;
  padding: 12px 24px;
  background-color: #1d1626;
  color: ${AppColors.onPrimary};
  border-radius: 99px;
  text-decoration: none;
  transition: background-color 0.2s;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: ${AppColors.primary}; // Hover 색상 필요시 AppColors에 추가
  }
`;

export const ContactSection: React.FC = () => {
  return (
    <SectionContainer>
      <ContactGrid>
        {/* 이메일 문의 */}
        <ContactItem>
          <IconWrapper>
            <EmailIcon />
          </IconWrapper>
          <ContactTitle>이메일 문의</ContactTitle>
          <ContactInfo>heredot83@heredotcorp.com</ContactInfo>
          <ContactButton href="mailto:heredot83@heredotcorp.com">메일 보내기</ContactButton>
        </ContactItem>

        {/* 전화 문의 */}
        <ContactItem>
          <IconWrapper>
            <PhoneIcon />
          </IconWrapper>
          <ContactTitle>전화 문의</ContactTitle>
          <ContactInfo>031-8039-7981</ContactInfo>
          <ContactButton href="tel:031-8039-7981">전화 연결</ContactButton>
        </ContactItem>

        {/* 카카오톡 채팅 상담 */}
        <ContactItem>
          <IconWrapper>
            <ChatIcon />
          </IconWrapper>
          {/* 적절한 카카오 아이콘으로 변경 */}
          <ContactTitle>카카오톡 채팅 상담</ContactTitle>
          <ContactInfo>Kakao</ContactInfo> {/* 카카오 채널 ID 또는 설명 추가 */}
          <ContactButton href="https://open.kakao.com/o/smVyiMig" target="_blank" rel="noopener noreferrer">
            {/* 실제 URL로 변경 */}
            채팅방 연결
          </ContactButton>
        </ContactItem>
      </ContactGrid>
    </SectionContainer>
  );
};
