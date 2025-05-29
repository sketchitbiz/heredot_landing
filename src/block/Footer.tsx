'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { useLang } from '@/contexts/LangContext';
import { dictionary } from '@/lib/i18n/lang';
import { AppColors } from '@/styles/colors';
import { AppTextStyles } from '@/styles/textStyles';
import { Breakpoints } from '@/constants/layoutConstants';
import { useEffect, useState } from 'react';
import { userStamp } from '@/lib/api/user/api';

const FooterContainer = styled.footer`
  color: ${AppColors.onBackground};
  padding: 48px 0;
  background-color: ${AppColors.backgroundDark};
  min-width: ${Breakpoints.desktop}px;

  @media (max-width: ${Breakpoints.mobile}px) {
    min-width: auto;
  }
`;

const FooterContent = styled.div`
  margin: 0 auto;
  padding: 0 20px;

  @media (min-width: ${Breakpoints.mobile}) {
    padding: 0;
  }
`;

const LogoImageWrapper = styled.div`
  margin-bottom: 16px;
  width: 150px;
  height: 60px;

  @media (max-width: ${Breakpoints.mobile}px) {
    height: 10px;
    margin-bottom: 0px;
  }
`;

const Separator = styled.hr`
  border: none;
  height: 1px;
  margin: 24px 0;
  background-color: ${AppColors.onBackgroundDark};
`;

const InfoSectionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 24px;
`;

const InfoSectionLeft = styled.div`
  max-width: 600px;
`;

const InfoSectionRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  a {
    ${AppTextStyles.body2}
    color: ${AppColors.onBackgroundDark};
    font-size: 14px;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }

    @media (max-width: ${Breakpoints.mobile}px) {
      font-size: 11px;
    }
  }
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
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= Breakpoints.mobile);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <FooterContainer>
      <FooterContent>
        <LogoImageWrapper>
        <img
  src="/landing/Logo.png"
  alt="Heredot Logo"
  width={isMobile ? 75 : 150}
  height={isMobile ? 30 : 60}
/>

        </LogoImageWrapper>
        <Separator />
        <InfoSectionWrapper>
          <InfoSectionLeft>
            <InfoTitle>@HEREDOT</InfoTitle>
            <InfoText>{t.footer.companyName}</InfoText>
            <InfoText>{t.footer.ceo}</InfoText>
            <InfoText>{t.footer.businessNumber}</InfoText>
            <InfoText>{t.footer.businessLicense}</InfoText>
            <InfoText>{t.footer.address}</InfoText>
            <InfoText>{t.footer.customerService}</InfoText>
            <InfoText
              as="button"
              style={{
                background: 'none',
                border: 'none',
                color: AppColors.onBackgroundDark,
                cursor: 'pointer',
                marginTop: '12px',
                padding: 0,
                fontSize: isMobile ? '11px' : '14px',
                fontWeight: 'bold',
              }}
              onClick={() => {
                setShowMore((prev) => !prev);
                void userStamp({
                  category: '버튼',
                  content: 'Footer',
                  memo: `더보기 ${!showMore ? '열기' : '닫기'}`,
                });
              }}
            >
              {t.footer.moreButton}
            </InfoText>
            {showMore &&
              t.footer.moreInfo.map((text, idx) => (
                <InfoText key={idx}>{text}</InfoText>
              ))}
          </InfoSectionLeft>

          <InfoSectionRight>
            <Link href={`/terms/${lang === 'ko' ? 'terms' : 'terms_en'}`}>
              {t.footer.terms}
            </Link>
            <Link href={`/terms/${lang === 'ko' ? 'privacy' : 'privacy_en'}`}>
              {t.footer.privacy}
            </Link>
            <Link href={`/terms/${lang === 'ko' ? 'company' : 'company_en'}`}>
              {t.footer.companyInfo}
            </Link>
          </InfoSectionRight>
        </InfoSectionWrapper>
        <CopyrightText>{t.footer.copyright}</CopyrightText>
      </FooterContent>
    </FooterContainer>
  );
};
export default Footer;
