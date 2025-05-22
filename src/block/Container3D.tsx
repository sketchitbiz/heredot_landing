'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

const colors = ['#FF6B6B', '#4ECDC4', '#FFD93D'];
const containerHeight = 600;
const gap = 100;

gsap.registerPlugin(ScrollTrigger);

const Container3DStackScroll: React.FC = () => {
  const boxRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const triggers: ScrollTrigger[] = [];

    boxRefs.current.forEach((el, i) => {
      if (!el) return;

      // 초기 상태 설정
      gsap.set(el, {
        transformStyle: 'preserve-3d',
        rotateX: 0,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: `top-=${i * gap} top`,
          end: `+=${containerHeight}`,
          scrub: true, // ✅ 스크롤에 따라 자연스럽게
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,
        },
      });

      tl.to(el, {
        rotateX: -30,
        ease: 'none',
        yPercent: -50,
        x: '0%',
        y: '50%',
      });
      

      triggers.push(tl.scrollTrigger!);
    });

    return () => {
      triggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div
      style={{
        height: `${colors.length * (containerHeight + gap)}px`,
        position: 'relative',
        perspective: '1000px', // ✅ 원근감 부여
      }}
    >
      {colors.map((color, index) => (
        <div
          key={index}
          ref={(el) => {
            boxRefs.current[index] = el;
          }}
          style={{
            position: 'relative',
            width: '100%',
            height: `${containerHeight}px`,
            backgroundColor: color,
            zIndex: colors.length - index,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            color: 'white',
            fontWeight: 'bold',
            transformOrigin: 'center center',
            willChange: 'transform', // ✅ 성능 최적화
          }}
        >
          Box {index + 1}
        </div>
      ))}
    </div>
  );
};

export default Container3DStackScroll;
