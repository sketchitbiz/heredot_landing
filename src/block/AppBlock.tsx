'use client';

import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Home, Search, User } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const AppBlockWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 1080px;
  width: 100%;
  padding: 0 120px;
  background-color: #fff;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
`;

const Content = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const LeftTextContainer = styled.div`
  flex: 1;
  color: #111;
`;

const TextTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  line-height: 1.4;
  margin-bottom: 24px;
`;

const TextDescription = styled.p`
  font-size: 16px;
  color: #444;
  line-height: 1.8;
  white-space: pre-line;
`;

const RightContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`;

const PhoneContainer = styled.div`
  width: 360px;
  height: 720px;
  border-radius: 32px;
  background-color: #fff;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
`;

const AnimatedItem = styled.div`
  width: 100%;
  opacity: 0;
  transform: translateY(40px);
`;

const FakeAppBar = () => <div style={{ height: 48, background: '#d24e4e', borderRadius: 8 }} />;
const FakeSearchBar = () => <div style={{ height: 40, background: '#41d8bf', borderRadius: 8 }} />;
const FakeChips = () => <div style={{ height: 32, background: '#321945', borderRadius: 16 }} />;
const FakeCard = () => <div style={{ height: 120, background: '#4b084a', borderRadius: 12 }} />;

const BottomNavContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 56px;
  background: #f2f2f2;
  border-radius: 12px;
`;

const BottomNavItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 10px;
  color: #333;
  gap: 2px;
`;

const FakeBottomNav = () => {
  return [
    <BottomNavContainer key="bottom-nav-wrapper">
      <BottomNavItem>
        <Home size={18} />
        <span>홈</span>
      </BottomNavItem>
      <BottomNavItem>
        <Search size={18} />
        <span>검색</span>
      </BottomNavItem>
      <BottomNavItem>
        <User size={18} />
        <span>마이</span>
      </BottomNavItem>
    </BottomNavContainer>,
  ];
};

const AppBlock = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const total = itemsRef.current.length;
    const interval = 0.3;
    const duration = 0.7;
    const pinScrollDistance = total * interval * 1000;

    const tl = gsap.timeline({
      scrollTrigger: {
        id: 'app-block-scroll', // ✅ 고유 ID 부여!
        trigger: wrapperRef.current,
        start: 'bottom+=100 bottom',
        end: `+=${pinScrollDistance}`,
        pin: true,
        scrub: true,
        pinSpacing: true,
        // markers: true,
      },
    });

    itemsRef.current.forEach((el, i) => {
      if (!el) return;

      const reversedIndex = total - 1 - i;

      tl.fromTo(
        el,
        { y: -500, opacity: 0, scale: 0.8 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration,
          ease: 'power3.out',
        },
        reversedIndex * interval
      );
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  const components = [
    <FakeAppBar key="appbar" />,
    <FakeSearchBar key="searchbar" />,
    <FakeChips key="chips" />,
    <FakeCard key="card" />,
    ...FakeBottomNav(),
  ];

  return (
    <AppBlockWrapper ref={wrapperRef}>
      <Content>
        <LeftTextContainer>
          <TextTitle>
            아토믹 디자인 시스템으로
            <br />
            차곡차곡 쌓아 안정적으로 완성합니다.
          </TextTitle>
          <TextDescription>
            작은 단위부터 미리 설계해
            디자인과 개발을 일관된 구조로 진행할 수 있으며,
            완성도는 물론 추후 유지보수까지 안정적입니다.
          </TextDescription>
        </LeftTextContainer>

        <RightContainer>
          <PhoneContainer>
            {components.map((comp, idx) => (
              <AnimatedItem
                key={idx}
                ref={(el) => {
                  if (el) itemsRef.current[idx] = el;
                }}
              >
                {comp}
              </AnimatedItem>
            ))}
          </PhoneContainer>
        </RightContainer>
      </Content>
    </AppBlockWrapper>
  );
};

export default AppBlock;
