'use client';

import styled from 'styled-components';
import { AppColors } from '@/styles/colors';
import { AppTextStyles } from '@/styles/textStyles';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import ChatIcon from '@mui/icons-material/Chat';
import { useLang } from '@/contexts/LangContext';
import { dictionary } from '@/lib/i18n/lang';
import { CustomNavigator } from '@/customComponents/CustomNavigator';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'; // iOS 스타일 화살표 아이콘
import { Breakpoints } from '@/constants/layoutConstants';


const ContactButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px; /* Space between text and icon */
  font-size: inherit; /* Inherit font size from parent */
  color: inherit; /* Inherit text color */
`;



interface ContractProps {
  topLabel: string;
  centerLabel: string;
  bottomLabel: string;
  title: string;
  description: string;
  onTopArrowClick?: () => void;     // ✅ 추가
  onBottomArrowClick?: () => void;  // ✅ 추가
}
const SectionContainer = styled.div`
  background-color: ${AppColors.backgroundDark};
  padding-bottom: 64px;
  min-width: ${Breakpoints.desktop}px; /* 기본값: 데스크탑 너비 강제 유지 */

  @media (max-width: ${Breakpoints.mobile}px) {
    min-width: auto; /* 모바일 이하에서 min-width 제거 */
    padding-bottom: 0px;
  }
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 기본: 3열 */
  gap: 40px;
  width: 100%;
  max-width: ${Breakpoints.desktop}px;
  margin: 0 auto;
  padding: 0 20px; /* ✅ 좌우 패딩 추가 */
/* 
  @media (max-width: ${Breakpoints.tablet}px) {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  } */

  @media (max-width: ${Breakpoints.mobile}px) {
    grid-template-columns: 1fr; /* ✅ 모바일에서는 하나씩만 */
  }
`;



const ContactItem = styled.div`
  background-color: #1d1626;
  padding: 50px;
  border-radius: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: space-between; /* Ensures equal spacing between items */
  gap: 16px;
  height: 250px;
  text-decoration: none; /* Remove underline */
  color: inherit; /* Inherit text color */
  transition: background-color 0.2s;
  cursor: pointer;

  &:hover {
    background-color: #2a2135; /* Add hover effect */
  }
`;

const IconWrapper = styled.div`
  color: ${AppColors.onBackground};
  .MuiSvgIcon-root {
    font-size: 2.5rem;
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
  /* padding: 12px 24px; */
  /* background-color: ${AppColors.primary}; */
  color: ${AppColors.onPrimary};
  border-radius: 99px;
  text-decoration: none;
  transition: background-color 0.2s;
  border: none;
  cursor: pointer;

  /* &:hover {
    background-color: ${AppColors.primary};
  } */
`;
export const ContactSection: React.FC<ContractProps> = ({
  topLabel,
  centerLabel,
  bottomLabel,
  title,
  description,
  onTopArrowClick,
  onBottomArrowClick,
}) => {
  const { lang } = useLang();
  const t = dictionary[lang].contactSection;

  return (
    <>
      {/* 🔥 CustomNavigator 추가 */}
      <CustomNavigator
        topLabel={topLabel}
        centerLabel={centerLabel}
        // bottomLabel={bottomLabel}
        title={title}
        description={description}
        onTopArrowClick={() => {
          onTopArrowClick?.(); // 부모(HomePage)로 전달
        }}
        onBottomArrowClick={() => {
          onBottomArrowClick?.();
        }}
      />
      <SectionContainer>
        <ContactGrid>
          {/* 이메일 문의 */}
          <ContactItem
            onClick={() => window.location.href = `mailto:${t.emailInfo}`}
          >
            <ContactTitle>{t.emailTitle}</ContactTitle>
            <ContactInfo>{t.emailInfo}</ContactInfo>
            <ContactButtonRow>
              <div>{t.emailButton}</div>
              <ArrowForwardIosIcon />
            </ContactButtonRow>
          </ContactItem>

          {/* 전화 문의 */}
          <ContactItem
            onClick={() => window.location.href = `tel:${t.phoneInfo}`}
          >
            <ContactTitle>{t.phoneTitle}</ContactTitle>
            <ContactInfo>{t.phoneInfo}</ContactInfo>
            <ContactButtonRow>
              <div>{t.phoneButton}</div>
              <ArrowForwardIosIcon />
            </ContactButtonRow>
          </ContactItem>

          {/* 카카오톡 상담 */}
          <ContactItem
            onClick={() => window.open(t.kakaoLink, '_blank', 'noopener noreferrer')}
          >
            <ContactTitle>{t.kakaoTitle}</ContactTitle>
            <ContactInfo>{t.kakaoInfo}</ContactInfo>
            <ContactButtonRow>
              <div>{t.kakaoButton}</div>
              <ArrowForwardIosIcon />
            </ContactButtonRow>
          </ContactItem>
        </ContactGrid>
      </SectionContainer>
    </>
  );
};