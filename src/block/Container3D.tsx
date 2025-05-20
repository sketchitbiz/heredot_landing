import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

const colors = ['#FF6B6B', '#4ECDC4', '#FFD93D'];
const containerHeight = 600;
const gap = 100;
const step = containerHeight + gap;
const maxRotateXList = [-30, -15, 0];

gsap.registerPlugin(ScrollTrigger);

const Container3DStackScroll: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [relativeScrollY, setRelativeScrollY] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !pinRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        id: '3d',
        trigger: pinRef.current,
        start: 'top top',
        end: () => `${colors.length * step}px`,
        pin: true,
        scrub: true,
        // markers: true, // ← 개발 중 디버깅용 표시
      });
    }, containerRef);

    const handleScroll = () => {
      const rect = pinRef.current!.getBoundingClientRect();
      setRelativeScrollY(-rect.top);
    };

    handleScroll(); // 초기값 설정

    window.addEventListener('scroll', handleScroll);
    return () => {
      ctx.revert();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100vw',
        height: `${colors.length * step + 100}px`,
        background: '#111',
        perspective: '1000px',
        overflowX: 'hidden',
      }}
    >
      <div
        ref={pinRef}
        style={{
          position: 'relative',
          height: `${colors.length * step}px`, // ✅ pin 대상 height 늘림
        }}
      >
        {colors.map((color, index) => {
          const initialY = index * step;
          const endY = initialY * 0.1;

          const visibleY = Math.max(0, initialY - relativeScrollY);
          const top = Math.max(endY, visibleY);

          const maxRotate = maxRotateXList[index];
          let rotateX = 0;
          const rotateStartY = initialY + containerHeight;
          if (maxRotate !== 0 && relativeScrollY >= rotateStartY) {
            const progress = Math.min(1, (relativeScrollY - rotateStartY) / step);
            rotateX = progress * maxRotate;
          }

          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                top,
                left: '50%',
                width: 1200,
                height: containerHeight,
                backgroundColor: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#fff',
                border: '2px solid #000',
                zIndex: index,
                transition: 'top 0.2s ease-out, transform 0.2s ease-out',
                transformStyle: 'preserve-3d',
                transformOrigin: 'top center',
                transform: `translateX(-50%) rotateX(${rotateX}deg)`,
                willChange: 'transform',
              }}
            >
              {rotateX.toFixed(1)}°
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Container3DStackScroll;
