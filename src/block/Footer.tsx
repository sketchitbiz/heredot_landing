'use client';

import styled from 'styled-components';
import Image from 'next/image';
import { useLang } from '@/contexts/LangContext';
import { dictionary } from '@/lib/i18n/lang'; // ✅ 국제화 추가
import { AppColors } from '@/styles/colors';
import { AppTextStyles } from '@/styles/textStyles';
import { Breakpoints } from '@/constants/layoutConstants';
import { useEffect, useState } from 'react';



const FooterContainer = styled.footer`
  color: ${AppColors.onBackground};
  padding: 48px 0;
  background-color: ${AppColors.backgroundDark};
  min-width: ${Breakpoints.desktop}px; /* 기본값: 데스크탑 너비 강제 유지 */

  @media (max-width: ${Breakpoints.mobile}px) {
    min-width: auto; /* 모바일 이하에서 min-width 제거 */
  }
`;



const FooterContent = styled.div`
  margin: 0 auto;
  padding: 0 20px;

  @media (min-width: ${Breakpoints.mobile}) {
    padding: 0; // 데스크탑 사이즈 이상에서는 패딩 제거
  }
`;



const LogoImageWrapper = styled.div`
  margin-bottom: 16px;
  width: 150px;
  height: 60px;
  margin-left: 0;
  padding-left: 0;

  @media (max-width: ${Breakpoints.mobile}px) {
    height: 10px; // 모바일에서 높이 조정
    margin-bottom: 0px;
  }
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
  @media (max-width: ${Breakpoints.mobile}px) {
    font-size: 12px;
  }
`;

const InfoText = styled.p`
  ${AppTextStyles.body2}
  color: ${AppColors.onBackgroundDark};
  margin: 4px 0;
  line-height: 1.6;

  @media (max-width: ${Breakpoints.mobile}px) {
    font-size: 11px;
  }
`;

const CopyrightText = styled.p`
  ${AppTextStyles.caption1}
  color: ${AppColors.onBackgroundDark};
  margin: 0;

  @media (max-width: ${Breakpoints.mobile}px) {
    font-size: 11px;
  }
`;

export const Footer: React.FC = () => {
  const { lang } = useLang();
  const t = dictionary[lang];
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= Breakpoints.mobile);
    };

    // 초기 실행 및 이벤트 리스너 등록
    handleResize();
    window.addEventListener('resize', handleResize);

    // 클린업
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <FooterContainer>
      <FooterContent>
        <LogoImageWrapper>
          <Image
            src="/landing/Logo.png"
            alt="Heredot Logo"
            width={isMobile ? 75 : 150} // 모바일일 때 67, 데스크톱일 때 150
            height={isMobile ? 30 : 60} // 모바일일 때 26, 데스크톱일 때 60
            priority
          />
        </LogoImageWrapper>
        <Separator />
        <InfoSection>
          <InfoTitle>@HEREDOT</InfoTitle>
          <InfoText>{t.footer.companyName}</InfoText>
          <InfoText>{t.footer.ceo}</InfoText>
          <InfoText>{t.footer.businessNumber}</InfoText>
          <InfoText>{t.footer.businessLicense}</InfoText>
          <InfoText>{t.footer.address}</InfoText>
          <InfoText>{t.footer.customerService}</InfoText>
        </InfoSection>
        <CopyrightText>{t.footer.copyright}</CopyrightText>
      </FooterContent>
    </FooterContainer>
  );
};