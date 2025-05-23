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
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Breakpoints } from '@/constants/layoutConstants';
import { userStamp } from '@/lib/api/user/api';

interface ContractProps {
  topLabel: string;
  centerLabel: string;
  bottomLabel: string;
  title: string;
  description: string;
  onTopArrowClick?: () => void;
  onBottomArrowClick?: () => void;
}

const SectionContainer = styled.div`
  background-color: ${AppColors.backgroundDark};
  padding-bottom: 64px;
  min-width: ${Breakpoints.desktop}px;

  @media (max-width: ${Breakpoints.mobile}px) {
    min-width: auto;
    padding-bottom: 0px;
  }
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  width: 100%;
  max-width: ${Breakpoints.desktop}px;
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: ${Breakpoints.mobile}px) {
    grid-template-columns: 1fr;
  }
`;

const logButtonClick = (memo: string) => {
  userStamp({
    category: '버튼',
    content: 'Contact',
    memo,
  });
};

const ContactItem = styled.div`
  background-color: #1d1626;
  padding: 50px;
  border-radius: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: space-between;
  gap: 16px;
  height: 250px;
  text-decoration: none;
  color: inherit;
  transition: background-color 0.2s;
  cursor: pointer;

  &:hover {
    background-color: #2a2135;
  }

  @media (max-width: ${Breakpoints.mobile}px) {
    height: 150px;
    padding: 30px;
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

  @media (max-width: ${Breakpoints.mobile}px) {
    font-size: 18px;
  }
`;

const ContactInfo = styled.p`
  ${AppTextStyles.body1}
  color: ${AppColors.onBackground};
  margin: 0;

  @media (max-width: ${Breakpoints.mobile}px) {
    font-size: 14px;
  }
`;

const ContactButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  color: inherit;

  @media (max-width: ${Breakpoints.mobile}px) {
    font-size: 16px;
  }
`;

const ArrowIcon = styled(ArrowForwardIosIcon)`
  font-size: 1em; // 기본 크기 유지
  transform: scale(1); // 크기를 80%로 축소

  @media (max-width: ${Breakpoints.mobile}px) {
    transform: scale(0.7); // 모바일에서 더 작은 크기로 설정
  }
`;

const ContactButton = styled.a`
  ${AppTextStyles.button}
  display: inline-block;
  color: ${AppColors.onPrimary};
  border-radius: 99px;
  text-decoration: none;
  transition: background-color 0.2s;
  border: none;
  cursor: pointer;
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
      <CustomNavigator
        topLabel={topLabel}
        centerLabel={centerLabel}
        title={title}
        description={description}
        onTopArrowClick={() => {
          onTopArrowClick?.();
        }}
        onBottomArrowClick={() => {
          onBottomArrowClick?.();
        }}
      />
      <SectionContainer>
        <ContactGrid>
          {/* 이메일 */}
          <ContactItem
           onClick={() => {
            logButtonClick('이메일 문의');
            window.location.href = `mailto:${t.emailInfo}`;
          }}
          >
            <ContactTitle>{t.emailTitle}</ContactTitle>
            <ContactInfo>{t.emailInfo}</ContactInfo>
            <ContactButtonRow>
              <div>{t.emailButton}</div>
              <ArrowIcon />
            </ContactButtonRow>
          </ContactItem>

          {/* 전화 */}
          <ContactItem
         onClick={() => {
          logButtonClick('전화 문의');
          window.location.href = `tel:${t.phoneInfo}`;
        }}
          >
            <ContactTitle>{t.phoneTitle}</ContactTitle>
            <ContactInfo>{t.phoneInfo}</ContactInfo>
            <ContactButtonRow>
              <div>{t.phoneButton}</div>
              <ArrowIcon />
            </ContactButtonRow>
          </ContactItem>

          {/* 카카오톡 */}
          <ContactItem
             onClick={() => {
              logButtonClick('카카오톡 문의');
              window.open(t.kakaoLink, '_blank', 'noopener noreferrer');
            }}
          >
            <ContactTitle>{t.kakaoTitle}</ContactTitle>
            <ContactInfo>{t.kakaoInfo}</ContactInfo>
            <ContactButtonRow>
              <div>{t.kakaoButton}</div>
              <ArrowIcon />
            </ContactButtonRow>
          </ContactItem>
        </ContactGrid>
      </SectionContainer>
    </>
  );
};
