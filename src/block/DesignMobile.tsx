'use client';

import React, { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import DownloadIcon from '@mui/icons-material/Download';
import { useLang } from '@/contexts/LangContext';
import { downloadLinks } from '@/lib/i18n/downloadLinks';
import { userStamp } from '@/lib/api/user/api';

interface DesignMobileBlockProps {
  title: string;
  tabs: string[];
  tabNumbers: string[];
  slides: { title: string; image: string }[];
  downloadText: string;
  onEnterSection?: (index: number, tab: string) => void;
}

const bounce = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const Wrapper = styled.section`
  width: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: #000;
  position: relative;
  margin-bottom: 20px;
`;

const TitleWrapper = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  background-color: #000;
  padding-bottom: 16px;
  z-index: 10;
`;

const Title = styled.h2`
  font-size: 25px;
  font-weight: bold;
  color: white;
  text-align: left;
  margin-bottom: 8px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 16px;
`;

const MobileDownloadButton = styled.a`
  display: inline-flex;
  position: sticky;
  align-items: center;
  width: 100%;
  justify-content: center;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  border: 1px solid #ccc;
  border-radius: 6px;
  text-decoration: none;
  gap: 6px;
  margin-top: 0px;
`;

const Tabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  color: white;
`;

const Tab = styled.div`
  font-size: 20px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TabNumber = styled.span`
  font-size: 20px;
  opacity: 0.7;
`;

const DownloadLink = styled.a`
  font-size: 14px;
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  animation: ${bounce} 1.5s ease-in-out infinite;
`;

const Image = styled.img`
  width: 100%;
  max-width: 100%;
  border-radius: 12px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.4);
  margin-bottom: 50px;
`;

const DesignMobile: React.FC<DesignMobileBlockProps> = ({
  title,
  tabs,
  tabNumbers,
  slides,
  downloadText,
  onEnterSection,
}) => {
  const { lang } = useLang();
  const observerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const observer = useRef<IntersectionObserver | null>(null);
  const enteredSet = useRef<Set<number>>(new Set());

  useEffect(() => {
    const visibleMap = new Map<number, boolean>();
    const lastScrollY = { current: window.scrollY };
  
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute('data-index'));
          const isVisible = entry.isIntersecting;
          const scrollY = window.scrollY;
          const isScrollingDown = scrollY > lastScrollY.current;
          lastScrollY.current = scrollY;
  
          const wasVisible = visibleMap.get(index) || false;
  
          // 조건: 아래로 스크롤 & 새롭게 진입
          if (isVisible && !wasVisible && isScrollingDown) {
            visibleMap.set(index, true);
            onEnterSection?.(index, tabs[index]);
          }
  
          // 업데이트: 영역 이탈 시 false로
          if (!isVisible && wasVisible) {
            visibleMap.set(index, false);
          }
        });
      },
      { threshold: Array.from({ length: 11 }, (_, i) => i * 0.1)  }
    );
  
    observerRefs.current.forEach((el) => {
      if (el) observer.current?.observe(el);
    });
  
    return () => observer.current?.disconnect();
  }, [onEnterSection, tabs]);
  ;

  const getDownloadLink = () => {
    return downloadLinks.designProposal[lang];
  };

  const convertImagePath = (src: string) => {
    return src.replace(/\.png$/, '_m.webp');
  };

  return (
    <Wrapper>
      <TitleWrapper>
        <Title>{title}</Title>
      </TitleWrapper>
      {slides.map((slide, i) => (
  <React.Fragment key={i}>
    <Row>
      <Tabs>
        <Tab>
          {tabs[i]} <TabNumber>{tabNumbers[i]}</TabNumber>
        </Tab>
      </Tabs>
    </Row>
    <div
      ref={(el) => {
        observerRefs.current[i] = el;
      }}
      data-index={i}
    >
      <Image
        id={`design-slide-${i}`}
        src={convertImagePath(slide.image)}
        alt={slide.title}
      />
    </div>
  </React.Fragment>
))}

<MobileDownloadButton
  href={getDownloadLink()}
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => {
    userStamp({
      uuid: localStorage.getItem("logId") ?? "anonymous",
      category: "버튼",
      content: "Design",
      memo: "디자인 제안서 다운로드",
    });
  }}
>
  {downloadText} <DownloadIcon style={{ fontSize: '16px' }} />
</MobileDownloadButton>

    </Wrapper>
  );
};

export default DesignMobile;