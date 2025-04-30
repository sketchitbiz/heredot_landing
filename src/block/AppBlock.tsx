'use client';

import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Home, Search, User, Bell } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CustomBlockLayout from '@/customComponents/CustomBlockLayout';
import { AppColors } from '@/styles/colors';
import { AppTextStyles } from '@/styles/textStyles';

interface AppBlockProps {
  title: string;
  description: string;
}

gsap.registerPlugin(ScrollTrigger);

// 스켈레톤 반짝이
const shine = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const StyledTitle = styled.h2`
  font-size: 32px; /* 원하는 폰트 크기 */
  color: ${AppColors.primary}; /* 원하는 색상 */
  line-height: 1.5;
  margin-bottom: 16px;
`;

const StyledDescription = styled.p`
  font-size: 18px; /* 원하는 폰트 크기 */
  color: ${AppColors.onBackground}; /* 원하는 색상 */
  line-height: 1.6;
`;

const TopTrigger = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 1px;
  pointer-events: none;
`;

const BottomTrigger = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  pointer-events: none;
`;

const AppBlockWrapper = styled.div`
  width: 100%;
  position: relative;
  perspective: 1200px;
`;

const PhoneFrame = styled.div<{ $isFlat: boolean; $painted: boolean }>`
  width: 360px;
  height: 720px;
  border-radius: 32px;
  border: 8px solid white;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  background: transparent;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotateX(-20deg) rotateY(-65deg);
  pointer-events: none;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: white;
    z-index: 1;
    transform: ${({ $painted }) =>
      $painted ? 'scale(1) translate(0, 0)' : 'scale(0) translate(50%, 50%)'};
    transform-origin: bottom right;
    transition: transform 1s ease-out;
  }
`;

const StackLayer = styled.div<{ $translateZ: number; $topOffset: number }>`
  width: 320px;
  position: absolute;
  top: ${({ $topOffset }) => `calc(50% + ${$topOffset}px)`};
  left: 50%;
  transform-style: preserve-3d;
  transform: translate(-50%, -50%) rotateX(-20deg) rotateY(-65deg) translateZ(${({ $translateZ }) => `${$translateZ}px`});
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const AppBar = styled.div`
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  font-weight: bold;
  font-size: 18px;
`;

const Icons = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SearchBar = styled.div`
  width: 100%;
  height: 40px;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  color: #999;
  font-size: 14px;
`;

const ChipsContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Chip = styled.div<{ $highlight?: boolean }>`
  padding: 6px 12px;
  background: ${({ $highlight }) => ($highlight ? '#d1e8ff' : '#eee')};
  color: ${({ $highlight }) => ($highlight ? '#005bbb' : '#555')};
  border-radius: 16px;
  font-size: 12px;
`;

const Card = styled.div`
  width: 100%;
  height: 300px;
  border-radius: 16px;
  border: 1px solid #ccc;
  background: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const CardImage = styled.div`
  width: 100%;
  height: 160px;
  background: #ddd;
`;

const CardContent = styled.div`
  flex: 1;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SkeletonLine = styled.div<{ $animate?: boolean }>`
  width: 100%;
  height: 14px;
  background: #eee;
  border-radius: 8px;
  ${({ $animate }) =>
    $animate &&
    css`
      background: linear-gradient(90deg, #eee 25%, #ddd 50%, #eee 75%);
      background-size: 200px 100%;
      animation: ${shine} 1.5s infinite;
    `}
`;

const BottomNavContainer = styled(StackLayer)<{ $highlight?: boolean }>`
  height: 56px;
  border-radius: 16px;
  background: ${({ $highlight }) => ($highlight ? '#d1e8ff' : '#f2f2f2')};
`;

const AppBlock: React.FC<AppBlockProps> = ({ title, description }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const appBarRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const bottomNavRef = useRef<HTMLDivElement>(null);
  const topTriggerRef = useRef<HTMLDivElement>(null);
  const bottomTriggerRef = useRef<HTMLDivElement>(null);

  const [isFlat, setIsFlat] = useState(false);
  const [painted, setPainted] = useState(false);
  const canPlayRef = useRef(false);

  const layers = [
    { ref: appBarRef, translateZ: -200 },
    { ref: searchBarRef, translateZ: 100 },
    { ref: chipsRef, translateZ: 150 },
    { ref: cardRef, translateZ: -300 },
    { ref: bottomNavRef, translateZ: -200 },
  ];

  useEffect(() => {
    if (!sectionRef.current || !phoneRef.current || !topTriggerRef.current || !bottomTriggerRef.current) return;

    const resetState = async () => {
      if (phoneRef.current) {
        gsap.set(phoneRef.current, {
          clearProps: 'transform',
          scale: 1,
          rotateX: -20,
          rotateY: -65,
          xPercent: -50,
          yPercent: -50,
        });
      }
      layers.forEach(({ ref }) => {
        if (ref.current) {
          gsap.set(ref.current, {
            clearProps: 'transform',
            rotateX: -20,
            rotateY: -65,
            xPercent: -50,
            yPercent: -50,
          });
        }
      });
      setIsFlat(false);
      setPainted(false);
      await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=1000',
        pin: true,
        scrub: false,
        onEnter: async () => {
          if (canPlayRef.current) {
            canPlayRef.current = false;
            await resetState();
            tl.restart();
          }
        },
        onEnterBack: async () => {
          if (canPlayRef.current) {
            canPlayRef.current = false;
            await resetState();
            tl.restart();
          }
        },
      },
    });

    tl.fromTo(
      phoneRef.current,
      { scale: 0.5, y: -200 },
      { scale: 1, y: 0, duration: 0.5, ease: 'power3.out' },
      0
    );

    layers.forEach(({ ref }, idx) => {
      if (ref.current) {
        tl.fromTo(
          ref.current,
          { y: -500, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.3, ease: 'power3.out' },
          idx * 0.2
        );
      }
    });

    const lastLayerDelay = (layers.length - 1) * 0.2 + 0.3;

    tl.add(() => {
      layers.forEach(({ ref }) => {
        if (ref.current) {
          gsap.to(ref.current, {
            duration: 0.5,
            ease: 'power3.out',
            transform: `translate(-50%, -50%) rotateX(-20deg) rotateY(-65deg) translateZ(0px)`,
          });
        }
      });
    }, lastLayerDelay + 0.1);

    tl.add(() => {
      layers.forEach(({ ref }) => {
        if (ref.current) {
          gsap.to(ref.current, {
            duration: 0.5,
            ease: 'power3.out',
            transform: `translate(-50%, -50%) rotateX(0deg) rotateY(0deg) translateZ(0px)`,
          });
        }
      });
      if (phoneRef.current) {
        gsap.to(phoneRef.current, {
          duration: 0.5,
          ease: 'power3.out',
          transform: 'translate(-50%, -50%) rotateX(0deg) rotateY(0deg)',
          onComplete: () => setIsFlat(true),
        });
      }
    }, lastLayerDelay + 0.2 + 0.5);

    tl.add(() => {
      setPainted(true);
    }, lastLayerDelay + 0.9);

    const topLeaveTrigger = ScrollTrigger.create({
      trigger: topTriggerRef.current,
      start: 'top bottom',
      onLeaveBack: () => {
        canPlayRef.current = true;
        resetState();
      },
    });

    const bottomLeaveTrigger = ScrollTrigger.create({
      trigger: bottomTriggerRef.current,
      start: 'bottom+=3000 top',
      onLeave: () => {
        canPlayRef.current = true;
        resetState();
      },
    });

    return () => {
      tl.kill();
      topLeaveTrigger.kill();
      bottomLeaveTrigger.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} style={{ position: 'relative', overflow: 'hidden' }}>
      <TopTrigger ref={topTriggerRef} />
      <CustomBlockLayout>
        <CustomBlockLayout.Left>
          <h2 dangerouslySetInnerHTML={{ __html: title.replace(/\n/g, '<br/>') }} />
          <p dangerouslySetInnerHTML={{ __html: description.replace(/\n/g, '<br/>') }} />
        </CustomBlockLayout.Left>

        <CustomBlockLayout.Right>
          <AppBlockWrapper>
            <PhoneFrame ref={phoneRef} $isFlat={isFlat} $painted={painted} />
            <StackLayer ref={appBarRef} $translateZ={-200} $topOffset={-300}>
              <AppBar>
                <span style={{ color: painted ? '#000' : '#fff' }}>HereDot.</span>
                <Icons>
                  <Bell size={20} color={painted ? '#000' : '#fff'} />
                  <User size={20} color={painted ? '#000' : '#fff'} />
                </Icons>
              </AppBar>
            </StackLayer>

            <StackLayer ref={searchBarRef} $translateZ={100} $topOffset={-200}>
              <SearchBar>
                <Search size={18} />
                <span style={{ marginLeft: 8 }}>Search</span>
              </SearchBar>
            </StackLayer>

            <StackLayer ref={chipsRef} $translateZ={150} $topOffset={-140}>
              <ChipsContainer>
                <Chip $highlight={painted}>Chip1</Chip>
                <Chip>Chip2</Chip>
                <Chip>Chip3</Chip>
                <Chip>Chip4</Chip>
                <Chip>Chip5</Chip>
              </ChipsContainer>
            </StackLayer>

            <StackLayer ref={cardRef} $translateZ={-250} $topOffset={50}>
              <Card>
                <CardImage />
                <CardContent>
                  <SkeletonLine $animate={painted} />
                  <SkeletonLine $animate={painted} style={{ width: '80%' }} />
                  <SkeletonLine $animate={painted} style={{ width: '60%' }} />
                </CardContent>
              </Card>
            </StackLayer>

            <BottomNavContainer ref={bottomNavRef} $translateZ={100} $topOffset={260} $highlight={painted}>
              <div style={{ display: 'flex', gap: '80px' }}>
                <div><Home size={18} color="#000" /></div>
                <div><Search size={18} color="#000" /></div>
                <div><User size={18} color="#000" /></div>
              </div>
            </BottomNavContainer>
          </AppBlockWrapper>
        </CustomBlockLayout.Right>
      </CustomBlockLayout>
      <BottomTrigger ref={bottomTriggerRef} />
    </section>
  );
};

export default AppBlock;
