'use client';

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DownloadIcon from '@mui/icons-material/Download';
import { useLang } from '@/contexts/LangContext';
import { downloadLinks } from '@/lib/i18n/downloadLinks';
import { Breakpoints } from '@/constants/layoutConstants';
import { AppColors } from "@/styles/colors";
import { userStamp } from '@/lib/api/user/api';


interface DesignProps {
  title: string;
  tabs: string[];
  tabNumbers: string[];
  slides: { title: string; image: string }[];
  downloadText: string;
  onEnterSection?: (index: number, tab: string) => void;
}

gsap.registerPlugin(ScrollTrigger);


const Container = styled.div`
  width: ${Breakpoints.desktop}px; // 고정된 콘텐츠 너비
  margin: 0 auto;
  position: relative;
  height: 100vh;
`;

const ActiveDot = styled.div`
  position: absolute;
  left: 100px;
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
  left: -5%;
  transform: translateY(-50%);
  width: 450px;
  height: 700px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  perspective: 5000px;
`;

const ArcItem = styled.div<{ $active: boolean; $offset: number }>`
  position: absolute;
  cursor: pointer;
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
  left: 31%;
  width: 800px;
  border-radius: 16px;
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
  transform: ${({ $hovered }) => ($hovered ? 'translateX(-21%) scale(1.42)' : 'none')};
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
  right: 3%; /* 오른쪽에서의 위치 조정 */
  animation: bounceY 1.5s ease-in-out infinite;

  @keyframes bounceY {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
`;

const PageWrapper = styled.div`
  width: 100%;
  min-width: ${Breakpoints.desktop}px; // 데스크탑 이하로 안 줄어들게
  background-color: ${AppColors.background};
`;

const ScrollContent = styled.div`
  width: ${Breakpoints.desktop}px; // 가로 스크롤 대상
  height: 100%;
  position: relative;
`;


const StickySection = styled.div`
  /* position: sticky; */
  top: 0;
  height: 100vh;
`;

const TabNumber = styled.span<{ $active: boolean }>`
  font-size: 14px;
  margin-left: 8px;
  color: ${({ $active }) => ($active ? 'white' : 'rgba(243, 236, 236, 0.991)')};
  font-weight: 400;
`;

const DesignWeb: React.FC<DesignProps> = ({
  title,
  tabs,
  tabNumbers,
  slides,
  downloadText,
  onEnterSection,
}) => {
  const { lang } = useLang();
  const [activeTab, setActiveTab] = useState(0);
  const [hoverEnabled, setHoverEnabled] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef(activeTab);
  const lastLoggedIndex = useRef<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const ignoreScroll = useRef(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < Breakpoints.mobile);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  useEffect(() => {
    if (isMobile || !sectionRef.current) return;

    const slideHeight = window.innerHeight;
    const totalScroll = slideHeight * (tabs.length - 1);
    const lastScrollY = { current: window.scrollY };

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        id: "design",
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${totalScroll}`,
        scrub: true,
        pin: true,
        onUpdate: (self) => {
          const progress = self.progress;
          let index = Math.floor(progress * tabs.length);
          index = Math.min(index, tabs.length - 1);

          const currentScrollY = window.scrollY;
          const isScrollingDown = currentScrollY > lastScrollY.current;
          lastScrollY.current = currentScrollY;

          if (!ignoreScroll.current) {
            if (index !== activeTabRef.current) {
              setActiveTab(index);
            }

            if (
              isScrollingDown &&
              index !== lastLoggedIndex.current &&
              currentScrollY > self.start
            ) {
              lastLoggedIndex.current = index;
              onEnterSection?.(index, tabs[index]); // ✅ 부모에 콜백 위임
            }
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [tabs.length, isMobile]);

  const handleTabClick = (index: number) => {
    const trigger = ScrollTrigger.getById("design");
    if (!trigger) return;

    ignoreScroll.current = true;
    setActiveTab(index);

    const scrollY = trigger.start + (trigger.end - trigger.start) * (index / tabs.length);
    window.scrollTo({ top: scrollY, behavior: "smooth" });

    // 버튼 로그는 여전히 여기서 찍을 수 있음 (옵션)
    userStamp({
      category: "버튼",
      content: "Design",
      memo: `탭: ${tabs[index]}`,
    });

    setTimeout(() => {
      ignoreScroll.current = false;
    }, 1000);
  };

  const getDownloadLink = () => downloadLinks.designProposal[lang];

  return (
    <PageWrapper>
      <div ref={sectionRef}>
        <StickySection>
          <Container>
            <ArcTrack>
              <ActiveDot />
              {tabs.map((tab, i) => {
                const offset = i - activeTab;
                const isActive = activeTab === i;
                return (
                  <ArcItem key={i} $active={isActive} $offset={offset} onClick={() => handleTabClick(i)}>
                    {tab}
                    <TabNumber $active={isActive}>{tabNumbers[i]}</TabNumber>
                  </ArcItem>
                );
              })}
            </ArcTrack>

            <FixedTitle
              dangerouslySetInnerHTML={{
                __html: title.replace(/\n/g, "<br />"),
              }}
            />

            <DownloadLink
              href={getDownloadLink()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                userStamp({
                  category: "버튼",
                  content: "Design",
                  memo: "디자인 제안서 다운로드",
                })
              }
            >
              {downloadText}
              <DownloadIcon style={{ fontSize: "16px" }} />
            </DownloadLink>

            <TabImage
              src={slides[activeTab].image}
              alt={slides[activeTab].title}
              $hovered={isHovering}
              onMouseEnter={() => hoverEnabled && setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onClick={() => {
                setHoverEnabled(false);
                setIsHovering(false);
              }}
            />
          </Container>
        </StickySection>
      </div>
    </PageWrapper>
  );
};

export default DesignWeb;