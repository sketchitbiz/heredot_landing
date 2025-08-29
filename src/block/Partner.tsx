'use client';

import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useLang } from '@/contexts/LangContext';
import { downloadLinks } from '@/lib/i18n/downloadLinks';
import { AppColors } from '@/styles/colors';
import { AppTextStyles } from '@/styles/textStyles';
import CustomBlockLayout from '@/customComponents/CustomBlockLayout';
import ResponsiveView from '@/layout/ResponsiveView';
import { Breakpoints } from '@/constants/layoutConstants';
import { userStamp } from '@/lib/api/user/api';

interface PartnerProps {
  title1: string;
  title2: string;
  subtitle: string;
  tabs: string[];
  slides: {
    title: string;
    image: string;
    subtitle: string;
    description: string;
  }[];
  downloadText: string;
  onEnterSection?: (index: number, tab: string) => void;
}

const arrowSlide = keyframes`
  0% { transform: translateX(-30%); opacity: 0; }
  30% { opacity: 1; }
  100% { transform: translateX(100%); opacity: 0; }
`;

const gradientBorder = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const typewriter = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

const Wrapper = styled.div`
  min-width: ${Breakpoints.desktop}px;
  background-color: #fff;

  @media (max-width: ${Breakpoints.mobile}px) {
    min-width: 100%;
  }
`;
const DownloadLink = styled.a`
  position: relative;
  font-size: 14px;
  color: #000000;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 14px;
  border-radius: 8px ;
  background-color: white;
  overflow: hidden;
  z-index: 1;
  text-decoration: none;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    padding: 1px;
    border-radius: 8px;
    background: linear-gradient(90deg, #666, #666, #666);
    background-size: 300% 300%;
    animation: ${gradientBorder} 2s ease infinite;
    z-index: -1;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    -webkit-mask-composite: destination-out;
  }

  .icon {
    animation: ${arrowSlide} 2s ease-in-out infinite;
  }

  .text {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    animation: ${typewriter} 2s steps(20, end) infinite;
  }
`;

const MobileDownloadButton = styled(DownloadLink)`
  width: 100%;
  border-radius: 6px;

  padding: 10px 16px;
`;

const Title = styled.h2`
  ${AppTextStyles.headline2};
  color: ${AppColors.onSurface};
  margin-bottom: 0px;
  line-height: 1.2;
  white-space: pre-line;

  @media (max-width: ${Breakpoints.mobile}px) {
    font-size: 25px;
  }
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  white-space: pre-line;
  margin-bottom: 100px;

  @media (max-width: ${Breakpoints.mobile}px) {
    font-size: 14px;
    white-space: normal;
  }
`;
const Tabs = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 10px;
  flex-wrap: wrap;
`;

const Tab = styled.div<{ $active: boolean }>`
  font-size: 16px;
  font-weight: ${({ $active }) => ($active ? 'bold' : 'normal')};
  border-bottom: ${({ $active }) => ($active ? '2px solid #000' : 'none')};
  padding-bottom: 4px;
  cursor: pointer;
  color: ${({ $active }) => ($active ? '#000' : '#888')};
`;

// const Wrapper = styled.div`
//   min-width: ${Breakpoints.desktop}px;
//   background-color: #fff;

//   @media (max-width: ${Breakpoints.mobile}px) {
//     min-width: 100%;
//   }
// `;

const TabTitle = styled.h3`
  font-size: 25px;
  font-weight: bold;
  margin-bottom: 12px;
  position: relative;
  padding-left: 16px;
  color: #000;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 8px;
    height: 24px;
    background-color: #000000;
  }

  @media (max-width: ${Breakpoints.mobile}px) {
    font-size: 18px;
  }
`;

const TabDescription = styled.p`
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin-top: 8px;

  @media (max-width: ${Breakpoints.mobile}px) {
    font-size: 14px;
  }
`;

const TabImage = styled.img`
  width: 100%;
  height: auto;
  margin-top: 16px;
  margin-bottom: 16px;
  border-radius: 8px;
`;

const FlexRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const LeftColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const RightColumn = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  padding-bottom: 20px;
`;



const AnimatedDescription = styled.div`
  animation: fade 0.5s ease-in-out;

  @keyframes fade {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const MobileContainer = styled.div`
  padding: 24px 20px;
`;

const SlideWrapper = styled.div`
  margin-bottom: 100px;

  &:last-of-type {
    margin-bottom: 0;
  }
`;
const logButtonClick = async (content: string, memo: string) => {
  try {
    await userStamp({
      category: '버튼',
      content,
      memo,
    });
  } catch {
    // 실패 시 무시
  }
};

const Partner: React.FC<PartnerProps> = ({
  title1,
  title2,
  subtitle,
  tabs,
  slides,
  downloadText,
  onEnterSection,
}) => {
  const { lang } = useLang();
  const [activeTab, setActiveTab] = useState(0);
  const currentSlide = slides[activeTab];
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const lastLoggedIndex = useRef<number | null>(null);

  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < Breakpoints.mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Desktop에서도 IntersectionObserver를 사용하여 섹션 진입 감지
  useEffect(() => {
    if (!onEnterSection) return;

    const currentSectionRef = sectionRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          
          // Desktop에서는 현재 활성 탭 인덱스를 사용
          if (!isMobile) {
            const index = activeTab;
            if (index !== lastLoggedIndex.current) {
              lastLoggedIndex.current = index;
              onEnterSection(index, tabs[index]);
            }
          }
        });
      },
      { threshold: 0.6 }
    );

    if (currentSectionRef) {
      observer.observe(currentSectionRef);
    }

    return () => {
      if (currentSectionRef) {
        observer.unobserve(currentSectionRef);
      }
    };
  }, [isMobile, activeTab, tabs, onEnterSection]);

  useEffect(() => {
    if (!isMobile || !onEnterSection) return;

    const currentSlideRefs = slideRefs.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = currentSlideRefs.findIndex(
            (el) => el === entry.target
          );
          if (
            entry.isIntersecting &&
            index !== -1 &&
            index !== lastLoggedIndex.current
          ) {
            lastLoggedIndex.current = index;
            onEnterSection(index, tabs[index]);
          }
        });
      },
      { threshold: 0.6 }
    );

    currentSlideRefs.forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => {
      currentSlideRefs.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, [isMobile, tabs, onEnterSection]);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    logButtonClick('Partner', `탭: ${tabs[index]}`);
  };

  const getDownloadLink = (index: number) => {
    switch (index) {
      case 0:
        return downloadLinks.antiDroneProposal[lang];
      case 1:
        return downloadLinks.luxuryReverseAuctionProposal[lang];
      case 2:
        return downloadLinks.tradeProposal[lang];
      case 3:
        return downloadLinks.tableOrderProposal[lang];
      default:
        return '#';
    }
  };

  return (
    <ResponsiveView
      desktopView={
        <Wrapper>
          <CustomBlockLayout ref={sectionRef}>
  <CustomBlockLayout.Left>
    <Title>{`${title1}\n${title2}`}</Title>
    <Subtitle>{subtitle}</Subtitle>
  </CustomBlockLayout.Left>

  <CustomBlockLayout.Right>
    <Tabs>
      {tabs.map((tab, index) => (
        <Tab key={index} $active={activeTab === index} onClick={() => handleTabClick(index)}>
          {tab}
        </Tab>
      ))}
    </Tabs>

    <AnimatedDescription key={activeTab}>
      <FlexRow>
        <LeftColumn>
          <TabTitle>{currentSlide.subtitle}</TabTitle>
          <TabDescription dangerouslySetInnerHTML={{ __html: currentSlide.description }} />
        </LeftColumn>
        <RightColumn>
        <DownloadLink
                      href={getDownloadLink(activeTab)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => logButtonClick('Partner', `${tabs[activeTab]} 제안서 다운로드`)}
                    >
                      <span className="text">{downloadText}</span>
                      <ArrowForwardIosIcon className="icon" style={{ fontSize: '16px' }} />
                    </DownloadLink>
        </RightColumn>
      </FlexRow>
      <TabImage src={currentSlide.image} alt={currentSlide.title} />
    </AnimatedDescription>
  </CustomBlockLayout.Right>
</CustomBlockLayout>

        </Wrapper>
      }
      mobileView={
        <MobileContainer>
          <h2 style={{ whiteSpace: 'pre-line' }}>{`${title1}\n${title2}`}</h2>
          <p>{subtitle}</p>
          {slides.map((slide, index) => (
            <SlideWrapper
              key={index}
              ref={(el) => {
                slideRefs.current[index] = el;
              }}
            >
              <TabTitle>{tabs[index]}</TabTitle>
              <TabDescription>
                {slide.description.replace(/<br\s*\/?>/gi, '')}
              </TabDescription>
              <MobileDownloadButton
                href={getDownloadLink(index)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => logButtonClick('Partner', `${tabs[index]} 제안서 다운로드`)}
              >
                <span className="text">{downloadText}</span>
                <ArrowForwardIosIcon className="icon" style={{ fontSize: '16px' }} />
              </MobileDownloadButton>
              <TabImage src={slide.image} alt={slide.title} />
            </SlideWrapper>
          ))}
        </MobileContainer>
      }
    />
  );
};

export default Partner;
