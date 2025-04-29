'use client';

import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Gap from '@/components/Gap';
import DownloadIcon from '@mui/icons-material/Download';
import { useLang } from '@/contexts/LangContext';
import { downloadLinks } from '@/lib/i18n/downloadLinks';
import { AppColors } from '@/styles/colors';
import { AppTextStyles } from '@/styles/textStyles';
import CustomBlockLayout from '@/customComponents/CustomBlockLayout';
import Background1 from '@/customComponents/Background1';
import Background2 from '@/customComponents/Background2';


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
  ${AppTextStyles.title1};
  color: ${AppColors.onSurface};
  margin-bottom: 0px;
  line-height: 1.2;
  white-space: pre-line;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #666;
  line-height: 1.6;
`;

const Tabs = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 10px;
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

const TabTitle = styled.h3`
  font-size: 25px;
  font-weight: bold;
  margin-bottom: 12px;
  position: relative;
  padding-left: 16px;
  color:  #000;

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
`;

const TabImage = styled.img`
  width: 100%;
  height: auto;
  margin-bottom: 16px;
  border-radius: 8px;
`;

const FlexRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  /* align-items: flex-start; */
  /* margin-bottom: 24px; */
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
  justify-content: flex-end; /* ✅ Y축 끝으로 */
  align-items: flex-end; /* ✅ 오른쪽 끝으로 */
  padding-bottom: 20px;
`;




const TabDescription = styled.p`
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin-top: 8px;
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

const AnimatedDescription = styled.div`
  animation: fade 0.5s ease-in-out;

  @keyframes fade {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
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
  const [activeSlide, setActiveSlide] = useState(0);
  const currentSlides = [slides[activeTab]];
  const currentSlide = currentSlides[activeSlide] || null;
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const ignoreScroll = useRef(false);

  const activeTabRef = useRef(activeTab);
  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const slideHeight = window.innerHeight;
    const totalScroll = slideHeight * tabs.length;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        id: 'partner-scroll',
        trigger: sectionRef.current,
        start: 'top top',
        end: `+=${totalScroll }`,
        scrub: true,
        pin: true,
        onUpdate: (self) => {
          const progress = self.progress;
          let index = Math.floor(progress * tabs.length);
          index = Math.min(index, tabs.length - 1);

          if (!ignoreScroll.current && index !== activeTabRef.current) {
            setActiveTab(index);
            setActiveSlide(0);
          }
        },
      });

      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom-=200',
          end: 'top center+=150',
          toggleActions: 'play none none reverse',
        },
      })
        .fromTo(
          leftRef.current,
          { scale: 0.9, opacity: 0, y: 50 },
          { scale: 1, opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
        )
        .fromTo(
          rightRef.current,
          { scale: 0.95, opacity: 0, y: 60 },
          { scale: 1, opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
          '-=0.6'
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleTabClick = (index: number) => {
    const trigger = ScrollTrigger.getById('partner-scroll');
    if (!trigger) return;

    ignoreScroll.current = true;
    setActiveTab(index);
    setActiveSlide(0);

    const scrollY = trigger.start + (trigger.end - trigger.start) * (index / tabs.length);

    window.scrollTo({
      top: scrollY,
      behavior: 'smooth',
    });

    setTimeout(() => {
      ignoreScroll.current = false;
    }, 1000);
  };

  const getDownloadLink = () => {
    switch (activeTab) {
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
    <CustomBlockLayout ref={sectionRef}>
      <CustomBlockLayout.Left ref={leftRef}>
        <Title>{`${title1}\n${title2}`}</Title>
        <Subtitle>{subtitle}</Subtitle>
      </CustomBlockLayout.Left>

      <CustomBlockLayout.Right ref={rightRef}>
        <Tabs>
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              $active={activeTab === index}
              onClick={() => handleTabClick(index)}
            >
              {tab}
            </Tab>
          ))}
        </Tabs>

        {currentSlide && (
  <Slide $isActive={true}>
    <AnimatedDescription key={`${activeTab}-${activeSlide}`}>
      <FlexRow>
        <LeftColumn>
          <TabTitle>{currentSlide.subtitle}</TabTitle>
          <TabDescription dangerouslySetInnerHTML={{ __html: currentSlide.description }} />
        </LeftColumn>

        <RightColumn>
          <DownloadLink href={getDownloadLink()} target="_blank" rel="noopener noreferrer">
            {downloadText}
            <DownloadIcon style={{ fontSize: '16px' }} />
          </DownloadLink>
        </RightColumn>
      </FlexRow>

      <TabImage src={currentSlide.image} alt={currentSlide.title} />
    </AnimatedDescription>
  </Slide>
)}

      </CustomBlockLayout.Right>
    </CustomBlockLayout>
  );
};

export default Partner;
