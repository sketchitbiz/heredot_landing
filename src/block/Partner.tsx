'use client';

import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DownloadIcon from '@mui/icons-material/Download';
import { useLang } from '@/contexts/LangContext';
import { downloadLinks } from '@/lib/i18n/downloadLinks';
import { AppColors } from '@/styles/colors';
import { AppTextStyles } from '@/styles/textStyles';
import CustomBlockLayout from '@/customComponents/CustomBlockLayout';
import ResponsiveView from '@/layout/ResponsiveView';
import { Breakpoints } from '@/constants/layoutConstants';

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
}

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
  margin-bottom: 100px; /* ✅ 모바일 간격 */

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

const Slide = styled.div<{ $isActive: boolean }>`
  display: ${({ $isActive }) => ($isActive ? 'block' : 'none')};
`;

const Wrapper = styled.div`
  min-width: ${Breakpoints.desktop}px; 
  background-color: #fff;

  @media (max-width: ${Breakpoints.mobile}px) {
    min-width: 100%;
  }

`;



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

const DownloadLink = styled.a`
  font-size: 14px;
  color: #000000;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  text-decoration: none;
  animation: bounceY 1.5s ease-in-out infinite;

  @keyframes bounceY {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
`;

const MobileDownloadButton = styled.a`
  display: inline-flex;
  align-items: center;
  width: 100%;
  justify-content: center;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #000;
  border: 1px solid #ccc;
  border-radius: 6px;
  text-decoration: none;
  gap: 6px;
  margin-top: 0px;
`;

const AnimatedDescription = styled.div`
  animation: fade 0.5s ease-in-out;

  @keyframes fade {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
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


const Partner: React.FC<PartnerProps> = ({
  title1,
  title2,
  subtitle,
  tabs,
  slides,
  downloadText,
}) => {
  const { lang } = useLang();
  const [activeTab, setActiveTab] = useState(0);
  const currentSlide = slides[activeTab];
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const ignoreScroll = useRef(false);
  const activeTabRef = useRef(activeTab);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < Breakpoints.mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  useEffect(() => {
    if (isMobile || !leftRef.current || !rightRef.current || !sectionRef.current) return;
  
    gsap.registerPlugin(ScrollTrigger);
    const slideHeight = window.innerHeight;
    const totalScroll = slideHeight * tabs.length;
  
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        id: 'partner-scroll',
        trigger: sectionRef.current,
        start: 'top top',
        end: `+=${totalScroll}`,
        scrub: true,
        pin: true,
        onUpdate: (self) => {
          const progress = self.progress;
          let index = Math.floor(progress * tabs.length);
          index = Math.min(index, tabs.length - 1);
  
          if (!ignoreScroll.current && index !== activeTabRef.current) {
            setActiveTab(index);
          }
        },
      });
  
      if (leftRef.current && rightRef.current) {
        gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom-=200',
            end: 'top center+=150',
            toggleActions: 'play none none reverse',
          },
        })
          .fromTo(leftRef.current, { scale: 0.9, opacity: 0, y: 50 }, { scale: 1, opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
          .fromTo(rightRef.current, { scale: 0.95, opacity: 0, y: 60 }, { scale: 1, opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.6');
      }
    }, sectionRef);
  
    return () => ctx.revert();
  }, [isMobile, tabs.length]);
  ;

  const [scrollX, setScrollX] = useState(0);

useEffect(() => {
  const handleScroll = () => {
    setScrollX(window.scrollX || window.pageXOffset);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

  const handleTabClick = (index: number) => {
    const trigger = ScrollTrigger.getById('partner-scroll');
    if (!trigger) return;

    ignoreScroll.current = true;
    setActiveTab(index);

    const scrollY = trigger.start + (trigger.end - trigger.start) * (index / tabs.length);
    window.scrollTo({ top: scrollY, behavior: 'smooth' });

    setTimeout(() => {
      ignoreScroll.current = false;
    }, 1000);
  };

  const getDownloadLink = (index: number) => {
    switch (index) {
      case 0: return downloadLinks.antiDroneProposal[lang];
      case 1: return downloadLinks.luxuryReverseAuctionProposal[lang];
      case 2: return downloadLinks.tradeProposal[lang];
      case 3: return downloadLinks.tableOrderProposal[lang];
      default: return '#';
    }
  };

  return (
    <ResponsiveView
      desktopView={
        <Wrapper>
        <CustomBlockLayout ref={sectionRef}>
          <CustomBlockLayout.Left ref={leftRef}>
            <Title>{`${title1}\n${title2}`}</Title>
            <Subtitle>{subtitle}</Subtitle>
          </CustomBlockLayout.Left>
          <CustomBlockLayout.Right ref={rightRef}>
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
                  <DownloadLink href={getDownloadLink(activeTab)} target="_blank" rel="noopener noreferrer">
                    {downloadText}
                    <DownloadIcon style={{ fontSize: '16px' }} />
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
          <Title style={{ whiteSpace: 'pre-line' }}>{`${title1}\n${title2}`}</Title>
          <Subtitle>{subtitle}</Subtitle>
          {slides.map((slide, index) => (
            <SlideWrapper key={index}>
              <TabTitle>{tabs[index]}</TabTitle>
              <TabDescription>
  {slide.description.replace(/<br\s*\/?>/gi, '')}
</TabDescription>
              <MobileDownloadButton href={getDownloadLink(index)} target="_blank" rel="noopener noreferrer">
                {downloadText}
                <DownloadIcon style={{ fontSize: '16px' }} />
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