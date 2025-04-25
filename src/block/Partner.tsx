import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Gap from "@/components/Gap";
import DownloadIcon from "@mui/icons-material/Download";

const Container = styled.div`
  display: flex;
  width: 100%;
  /* background-color: #f5f5f5; */
  height: 100vh;
  box-sizing: border-box;
  overflow: hidden;
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  /* padding: 80px; */
  /* background-color: #d91818; */
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: bold;
  color: #000;
  margin-bottom: 0px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #666;
  line-height: 1.6;
`;

const RightSection = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  padding: 60px 40px;
  position: relative;
`;

const Tabs = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
`;

const Tab = styled.div<{ $active: boolean }>`
  font-size: 16px;
  font-weight: ${({ $active }) => ($active ? "bold" : "normal")};
  border-bottom: ${({ $active }) => ($active ? "2px solid #000" : "none")};
  padding-bottom: 4px;
  cursor: pointer;
  color: ${({ $active }) => ($active ? "#000" : "#888")};
`;

const Slide = styled.div<{ $isActive: boolean }>`
  display: ${({ $isActive }) => ($isActive ? "block" : "none")};
`;

const TabTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
  position: relative;
  padding-left: 16px; /* 직사각형과 텍스트 간격 */
  
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 8px; /* 직사각형 너비 */
    height: 24px; /* 직사각형 높이 */
    background-color: #000000; /* 직사각형 색상 */
    border-radius: 0px; /* 직사각형 모서리 둥글기 */
  }
`;

const TabImage = styled.img`
  width: 100%;
  height: auto;
  margin-bottom: 16px;
  border-radius: 8px;
`;

const TabDescription = styled.p`
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-top: 8px; /* subtitle과 간격 추가 */
`;

const TabSubtitle = styled.p`
  font-size: 14px;
  color: #444;
  line-height: 1.5;
  position: relative;
  padding-left: 16px; /* 직사각형과 텍스트 간격 */

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 8px; /* 직사각형 너비 */
    height: 16px; /* 직사각형 높이 */
    background-color: #000000; /* 직사각형 색상 */
    border-radius: 0px; /* 직사각형 모서리 둥글기 */
  }
`;

const DownloadLink = styled.a`
  font-size: 14px;
  color: #000000;
  margin-top: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  text-decoration: none;

  animation: bounceY 1.5s ease-in-out infinite;

  @keyframes bounceY {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }
`;

const AnimatedDescription = styled.div`
  animation: fade 0.5s ease-in-out;

  @keyframes fade {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Partner: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);

  const tabs = ["안티드론", "명품역경매", "무역플랫폼", "테이블오더"];

  const slidesByTab = [
    [
      {
        title: "안티드론 솔루션",
        image: "/assets/partner_1.png",
        subtitle: "글로벌 세일즈 관련 수행 방안 제안",
        description:
          "고객사가 엔지니어 중심 조직 구조인 점을 고려하여,<br />  제품 런칭 이후 기술 외에도 세일즈 관점에서의 사업 전략을 제안",
      },
    ],
    [
      {
        title: "명품 역경매",
        image: "/assets/partner_2.png",
        subtitle: "AI를 활용한 시세 조회 방안 제안",
        description: "제품 촬영한 이미지를 AI를 통해 식별 및 인식 하여<br /> 시세를 예측하여 고객 유입 활성 방안 제안",
      },
    ],
    [
      {
        title: "무역플랫폼",
        image: "/assets/partner_3.png",
        subtitle: "복잡한 프로세스 No! 절차 개선 제안",
        description:
          "무역업 특성상 많은 이해 관계자들이 협업 해야 되는 구조를<br /> 정확하게 인지 및 각 구간별 불필요 절차 개선 방안 제안",
      },
    ],
    [
      {
        title: "테이블오더",
        image: "/assets/partner_4.png",
        subtitle: "테이블오더 시장 안착 전력 제안",
        description:
          "시중에 나와 있는 테이블 오더 제품과의 경쟁에서 살아 남기 위한<br /> 고객사만의 기능과 사업전략을 이해하고 프로젝트 킥오프 제안",
      },
    ],
  ];

  const currentSlides = slidesByTab[activeTab] || [];
  const currentSlide = currentSlides[activeSlide] || null;

  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const ignoreScroll = useRef(false);
  
  const handleDownloadClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // 기본 링크 이동 방지
    console.log("Download clicked!");
    // 여기에 파일 다운로드 로직 or 조건 판단 로직 추가
  };

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
        id: "partner-scroll",
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${totalScroll + window.innerHeight / 2}`,
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
      gsap
        .timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
            start: "top bottom-=200",
            end: "top center+=150",
            toggleActions: "play none none reverse",
        },
      })
        .fromTo(
          leftRef.current,
          { scale: 0.9, opacity: 0, y: 50 },
          { scale: 1, opacity: 1, y: 0, duration: 1, ease: "power3.out" }
        )
        .fromTo(
          rightRef.current,
          { scale: 0.95, opacity: 0, y: 60 },
          { scale: 1, opacity: 1, y: 0, duration: 1, ease: "power3.out" },
          "-=0.6"
        );
    }, sectionRef);
  
    return () => ctx.revert();
  }, []);
  
  const handleTabClick = (index: number) => {
    const trigger = ScrollTrigger.getById("partner-scroll");
    if (!trigger) return;
  
    ignoreScroll.current = true;
    setActiveTab(index);
    setActiveSlide(0);
  
    const scrollY = trigger.start + (trigger.end - trigger.start) * (index / tabs.length);
  
    window.scrollTo({
      top: scrollY,
      behavior: "smooth",
    });
  
    setTimeout(() => {
      ignoreScroll.current = false;
    }, 1000);
  };

  return (
    <Container ref={sectionRef}>
      <LeftSection ref={leftRef}>
        <Title>여기닷은</Title>
        <Title>창업자의 전략 파트너입니다</Title>
        <Subtitle>
          여기닷은 고객사의 사업 전반적인 내용을 이해하고 시장에 조기 안착할 수 있도록 다양한 사업을 제안합니다.
        </Subtitle>
      </LeftSection>

      <RightSection ref={rightRef}>
        <Tabs>
          {tabs.map((tab, index) => (
            <Tab key={index} $active={activeTab === index} onClick={() => handleTabClick(index)}>
              {tab}
            </Tab>
          ))}
        </Tabs>

        {currentSlide && (
  <Slide $isActive={true}>
    <TabTitle>{currentSlide.title}</TabTitle>
    <Gap height="16px" />
    <TabImage src={currentSlide.image} alt={currentSlide.title} />
    <AnimatedDescription key={`${activeTab}-${activeSlide}`}>
      <TabSubtitle>{currentSlide.subtitle}</TabSubtitle>
      <TabDescription dangerouslySetInnerHTML={{ __html: currentSlide.description }} />
      <Gap height="16px" />
      <DownloadLink href="#" onClick={handleDownloadClick}>
  사업제안서 다운로드
                <DownloadIcon style={{ fontSize: "16px" }} />
</DownloadLink>
    </AnimatedDescription>
  </Slide>
)}
      </RightSection>
    </Container>
  );
};

export default Partner;
