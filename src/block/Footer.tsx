'use client';

import styled from 'styled-components';
import Image from 'next/image';
import { useLang } from '@/contexts/LangContext';
import { dictionary } from '@/lib/i18n/lang'; // ✅ 국제화 추가
import { AppColors } from '@/styles/colors';
import { AppTextStyles } from '@/styles/textStyles';

const FooterContainer = styled.footer`
  color: ${AppColors.onBackground};
  background-color: ${AppColors.backgroundDark}; /* 배경 넣어줄 수도 있음 */
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;


const LogoImageWrapper = styled.div`
  margin-bottom: 16px;
  width: 150px;
  height: 50px;
  margin-left: 0;
  padding-left: 0;
`;

const Separator = styled.hr`
  border: none;
  height: 1px;
  margin: 24px 0;
  background-color: ${AppColors.onBackgroundDark};
`;

const InfoSection = styled.div`
  margin-bottom: 24px;
`;

const InfoTitle = styled.h3`
  ${AppTextStyles.title3}
  margin: 0 0 12px 0;
`;

const InfoText = styled.p`
  ${AppTextStyles.body2}
  color: ${AppColors.onBackgroundDark};
  margin: 4px 0;
  line-height: 1.6;
`;

const CopyrightText = styled.p`
  ${AppTextStyles.caption1}
  color: ${AppColors.onBackgroundDark};
  margin: 0;
`;

export const Footer: React.FC = () => {
  const { lang } = useLang();
  const t = dictionary[lang];

  return (
    <FooterContainer>
      <FooterContent>
        <LogoImageWrapper>
          <Image src="/landing/Logo.png" alt="Heredot Logo" width={150} height={60} priority />
        </LogoImageWrapper>
        <Separator />
        <InfoSection>
          <InfoTitle>@HEREDOT</InfoTitle>
          <InfoText>{t.footer.companyName}</InfoText>
          <InfoText>{t.footer.ceo}</InfoText>
          <InfoText>{t.footer.businessNumber}</InfoText>
          <InfoText>{t.footer.address}</InfoText>
          <InfoText>{t.footer.customerService}</InfoText>
        </InfoSection>
        <CopyrightText>{t.footer.copyright}</CopyrightText>
      </FooterContent>
    </FooterContainer>
  );
};
