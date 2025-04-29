'use client';

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DownloadIcon from '@mui/icons-material/Download';
import { useLang } from '@/contexts/LangContext';
import { downloadLinks } from '@/lib/i18n/downloadLinks';

interface DesignProps {
  title: string;
  tabs: string[];
  tabNumbers: string[];
  slides: { title: string; image: string }[];
  downloadText: string;
}

gsap.registerPlugin(ScrollTrigger);

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const ActiveDot = styled.div`
  position: absolute;
  left: 0px;
  top: 50%;
  width: 24px;
  height: 24px;
  background: #2979FF;
  border-radius: 50%;
  transform: translateY(20%);
  z-index: 1;
`;

const ArcTrack = styled.div`
  position: absolute;
  top: 50%;
  left: 0%;
  transform: translateY(-50%);
  width: 400px;
  height: 700px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  perspective: 5000px;
`;

const ArcItem = styled.div<{ $active: boolean; $offset: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform:
    translateX(${({ $offset }) => {
      const base = -50;
      const shift = Math.min(Math.abs($offset), 3) * 50;
      return `${base - shift}px`;
    }})
    translateY(${({ $offset }) => $offset * 140}px)
    rotateX(${({ $offset }) => $offset * 2}deg)
    translateZ(${({ $offset }) => Math.max(0, (2 - Math.abs($offset))) * 100}px)
    rotateZ(${({ $offset }) => $offset * 12}deg);

  font-size: ${({ $active }) => ($active ? '32px' : '24px')};
  opacity: ${({ $active }) => ($active ? 1 : 0.3)};
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  color: white;
  transition: all 0.3s ease;
`;

const FixedTitle = styled.div`
  position: absolute;
  top: 20%;
  left: 42%;
  transform: translateX(-50%);
  color: white;
  font-size: 24px;
  font-weight: bold;
  text-shadow: 0 0 8px rgba(0, 0, 0, 0.7);
  white-space: pre-line;
`;

const TabImage = styled.img<{ $hovered: boolean }>`
  position: absolute;
  top: 30%;
  left: 32%;
  width: 800px;
  border-radius: 16px;
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
  transform: ${({ $hovered }) => ($hovered ? 'translateX(-25%) scale(1.46)' : 'none')};
`;

const DownloadLink = styled.a`
  position: absolute; /* 부모(Container)를 기준으로 배치 */
  font-size: 14px;
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  text-decoration: none;
  top: 25%; /* 화면에서의 위치 조정 */
  right: 0%; /* 오른쪽에서의 위치 조정 */
  animation: bounceY 1.5s ease-in-out infinite;

  @keyframes bounceY {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
`;

const Wrapper = styled.div``;

const StickySection = styled.div`
  position: sticky;
  top: 0;
  height: 100vh;
`;

const TabNumber = styled.span<{ $active: boolean }>`
  font-size: 14px;
  margin-left: 8px;
  color: ${({ $active }) => ($active ? 'white' : 'rgba(243, 236, 236, 0.991)')};
  font-weight: 400;
`;

const Design: React.FC<DesignProps> = ({ title, tabs, tabNumbers, slides, downloadText }) => {
    const { lang } = useLang();
  const [activeTab, setActiveTab] = useState(0);
  const [hoverEnabled, setHoverEnabled] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef(activeTab);

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  useEffect(() => {
    const totalScroll = window.innerHeight * (tabs.length - 1);

    const trigger = ScrollTrigger.create({
      id: 'design',
      trigger: sectionRef.current,
      start: 'top top',
      end: `+=${totalScroll}`,
      scrub: true,
      pin: true,
      onUpdate: (self) => {
        const progress = self.progress;
        let index = Math.round(progress * (tabs.length - 1));
        index = Math.min(tabs.length - 1, Math.max(0, index));
        if (index !== activeTabRef.current) {
          setActiveTab(index);
        }
      },
    });

    return () => trigger.kill();
  }, [tabs.length]);

  const getDownloadLink = () => {
    return downloadLinks.designProposal[lang];
  };

  const handleMouseEnter = () => {
    if (hoverEnabled) {
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    if (hoverEnabled) {
      setIsHovering(false);
    }
  };

  const handleClick = () => {
    setHoverEnabled(false);
    setIsHovering(false);
  };

  return (
    <Wrapper ref={sectionRef}>
      <StickySection>
        <Container>
          <ArcTrack>
            <ActiveDot />
            {tabs.map((tab, i) => {
              const offset = i - activeTab;
              const isActive = activeTab === i;
              return (
                <ArcItem key={i} $active={isActive} $offset={offset}>
                  {tab}
                  <TabNumber $active={isActive}>{tabNumbers[i]}</TabNumber>
                </ArcItem>
              );
            })}
          </ArcTrack>

          <FixedTitle
            dangerouslySetInnerHTML={{
              __html: title.replace(/\n/g, '<br />'),
            }}
          />

<DownloadLink href={getDownloadLink()} target="_blank" rel="noopener noreferrer">
            {downloadText}
            <DownloadIcon style={{ fontSize: '16px' }} />
          </DownloadLink>

          <TabImage
            src={slides[activeTab].image}
            alt={slides[activeTab].title}
            $hovered={isHovering}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
          />
        </Container>
      </StickySection>
    </Wrapper>
  );
};

export default Design;
