'use client';

import styled from 'styled-components';
import { AppColors } from '@/styles/colors';
import { AppTextStyles } from '@/styles/textStyles';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import ChatIcon from '@mui/icons-material/Chat';
import { useLang } from '@/contexts/LangContext';
import { dictionary } from '@/lib/i18n/lang';

const SectionContainer = styled.div`
  background-color: ${AppColors.backgroundDark};
  padding: 64px 0; /* 왼쪽/오른쪽 패딩 제거 */
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3등분 딱 맞춰 */
  gap: 40px; /* 카드 사이 간격만 */
  width: 100%;
  max-width: 1200px; /* 1200 제한은 유지 */
  margin: 0 auto; /* 가운데 정렬 */
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
`;


const ContactItem = styled.div`
  background-color: #1d1626;
  padding: 32px;
  border-radius: 8px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
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
  padding: 12px 24px;
  background-color: #1d1626;
  color: ${AppColors.onPrimary};
  border-radius: 99px;
  text-decoration: none;
  transition: background-color 0.2s;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: ${AppColors.primary};
  }
`;

export const ContactSection: React.FC = () => {
  const { lang } = useLang();
  const t = dictionary[lang].contactSection;

  return (
    <SectionContainer>
      <ContactGrid>
        {/* 이메일 문의 */}
        <ContactItem>
          <IconWrapper>
            <EmailIcon />
          </IconWrapper>
          <ContactTitle>{t.emailTitle}</ContactTitle>
          <ContactInfo>{t.emailInfo}</ContactInfo>
          <ContactButton href={`mailto:${t.emailInfo}`}>{t.emailButton}</ContactButton>
        </ContactItem>

        {/* 전화 문의 */}
        <ContactItem>
          <IconWrapper>
            <PhoneIcon />
          </IconWrapper>
          <ContactTitle>{t.phoneTitle}</ContactTitle>
          <ContactInfo>{t.phoneInfo}</ContactInfo>
          <ContactButton href={`tel:${t.phoneInfo}`}>{t.phoneButton}</ContactButton>
        </ContactItem>

        {/* 카카오톡 상담 */}
        <ContactItem>
          <IconWrapper>
            <ChatIcon />
          </IconWrapper>
          <ContactTitle>{t.kakaoTitle}</ContactTitle>
          <ContactInfo>{t.kakaoInfo}</ContactInfo>
          <ContactButton href={t.kakaoLink} target="_blank" rel="noopener noreferrer">
            {t.kakaoButton}
          </ContactButton>
        </ContactItem>
      </ContactGrid>
    </SectionContainer>
  );
};
