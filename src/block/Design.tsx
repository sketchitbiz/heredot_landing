import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const ActiveDot = styled.div`
  position: absolute;
  left: 90px;
  top: 50%;
  width: 24px;
  height: 24px;
  background: #2979FF;
  border-radius: 50%;
  transform: translateY(20%);
  z-index: 1;
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const ArcTrack = styled.div`
  position: relative;
  height: 700px; /* 더 길게 */
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  perspective: 5000px;
  overflow: hidden;
`;

const ArcItem = styled.div<{ $active: boolean; $offset: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform:
    translateX(${({ $offset }) => {
      const base = -50; // 중심일 때 오른쪽으로
      const shift = Math.min(Math.abs($offset), 3) * 50; // 얼마나 왼쪽으로 밀지
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


const RightSection = styled.div`
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  /* background: #111; */
`;

const TabImage = styled.img`
  width: 80%;
  border-radius: 16px;
  box-shadow: 0 0 16px rgba(0,0,0,0.3);
`;

const Wrapper = styled.div`

  /* background: black; */
`;

const StickySection = styled.div`
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
`;

const TabNumber = styled.span<{ $active: boolean }>`
  font-size: 14px;
  margin-left: 8px;
  color: ${({ $active }) => ($active ? 'white' : 'rgba(243, 236, 236, 0.991)')};
  font-weight: 400;
`;

const tabs = ['레퍼런스 조사', '트렌드 파악', '컬러제안', 'UI/UX 제안', '고객의사결정'];
const tabNumbers = ['01', '02', '03', '04', '05'];

const slides = [
  { title: '시장/레퍼런스 조사', image: '/assets/partner_1.png' },
  { title: '트렌드 파악', image: '/assets/partner_2.png' },
  { title: '컬러제안', image: '/assets/partner_3.png' },
  { title: 'UI/UX 제안', image: '/assets/partner_4.png' },
  { title: '고객의사결정', image: '/assets/partner_1.png' },
];

const Design: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0); // 초기 index 0
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
  }, []);

  return (
    <Wrapper ref={sectionRef}>
      <StickySection>
        <Container>
          <LeftSection>
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

          </LeftSection>

          <RightSection>
            <TabImage src={slides[activeTab].image} alt={slides[activeTab].title} />
          </RightSection>
        </Container>
      </StickySection>
    </Wrapper>
  );
};

export default Design;
