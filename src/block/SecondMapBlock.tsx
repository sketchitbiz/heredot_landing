import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useScroll, useTransform, motion } from 'framer-motion';
import { Breakpoints } from '@/constants/layoutConstants';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { AppColors } from '@/styles/colors';

interface SecondMapBlockProps {
  label: string;
}

const originalPath = `M380.902 30C380.902 30 382.902 79.5 403.901 124C424.9 168.5 451.402 235 444.902 299.5C438.402 364 366.902 426.5 345.902 470.5C324.902 514.5 302.902 734.5 289.402 779.5C275.902 824.5 255.401 849.5 241.901 884.5C228.401 919.5 196.402 1027.5 178.402 1068C160.402 1108.5 153.903 1105.5 150.903 1157C147.903 1208.5 198.902 1289 193.402 1349C187.902 1409 165.402 1480.5 152.902 1509.5C140.402 1538.5 83.4013 1641 62.9013 1698.5C42.4013 1756 36.4001 1801 31.4001 1838.5C26.4001 1876 36.3994 2223.5 36.3994 2223.5`;

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
`;

const ContentWrapper = styled.div<{ $isOverLayout?: boolean }>`
  width: ${({ $isOverLayout }) => ($isOverLayout ? '100%' : `${Breakpoints.desktop}px`)};
  margin: 0 auto;
  box-sizing: border-box;
  position: relative;
`;

const Image = styled.img`
  width: 100%;
  display: block;
`;

const StyledPath = styled.path`
  stroke: #a05bff;
  stroke-width: 16;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
  filter: drop-shadow(0 0 12px rgba(160, 91, 255, 0.8))
          drop-shadow(0 0 24px rgba(160, 91, 255, 0.8));
`;

const MarkerIcon = styled(LocationOnIcon)`
  font-size: 92px; /* 기존 BackgroundCircle 크기와 동일 */
  color: rgba(116, 7, 255, 0.8); /* 색상 조정 */
  position: absolute;
  top: calc(50% - 100px);
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
`;

const MarkerGroup = styled.g`
  pointer-events: none;
`;

const MarkerCircle = styled.circle`
  fill: #8455c1;
  fill-opacity: 0.25;
`;

const MarkerImage = styled.image`
  width: 60px;
  height: 60px;
  transform: translate(-30px, -30px);
`;

const IconStack = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%);
  z-index: 10;
  pointer-events: none;
`;

const BackgroundCircle = styled.div`
  width: 92px;
  height: 92px;
  border-radius: 50%;
  background-color: rgba(116, 7, 255, 0.3);
  position: absolute;
  top: calc(50% - 100px);
  left: 50%;
  transform: translate(-50%, -50%);
`;

const DestinationImage = styled(motion.img)`
  width: 48px;
  height: 48px;
  transform-origin: center center;
  position: absolute;
  top: calc(50% - 100px);
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Label = styled.div`
  position: absolute;
  top: calc(0%);
  left: 50%;
  transform: translate(20%, -500%);
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
`;
const SecondMapBlock: React.FC<SecondMapBlockProps> = ({ label }) => {

  const wrapperRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const markerGroupRef = useRef<SVGGElement>(null);

  const { scrollY } = useScroll();

  const [imgHeight, setImgHeight] = useState(0);
  const [scrollRatio, setScrollRatio] = useState(0);
  const [sectionTop, setSectionTop] = useState(0);
  const [sectionHeight, setSectionHeight] = useState(0);
  const [maxScale, setMaxScale] = useState(1);
  const [startScroll, setStartScroll] = useState(0);
  const [endScroll, setEndScroll] = useState(0);
  const [followScrollPath, setFollowScrollPath] = useState(true);

  useEffect(() => {
    const update = () => {
      if (!wrapperRef.current || !imgRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      const height = rect.height;
      const screenW = window.innerWidth;

      setSectionTop(top);
      setSectionHeight(height);
      setMaxScale((screenW * 5) / 48);

      const start = top + height / 2 - window.innerHeight / 2 - 200;

      const end = start + height * 1.5;

      setStartScroll(start);
      setEndScroll(end);
      setImgHeight(imgRef.current.clientHeight);
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const iconScale = useTransform(scrollY, [startScroll, endScroll], [1, maxScale]);
  const iconY = useTransform(scrollY, [startScroll, endScroll], [0, 2000]);

  useEffect(() => {
    const handleScroll = () => {
      const viewportH = window.innerHeight;
      const scrollTop = window.scrollY;
      const start = sectionTop - viewportH;
      const end = sectionTop + sectionHeight;
      const value = (scrollTop - start) / (end - start);
      setScrollRatio(Math.max(0, Math.min(value, 1)));
    };

    handleScroll();
    return scrollY.onChange(handleScroll);
  }, [scrollY, sectionTop, sectionHeight]);

  useLayoutEffect(() => {
    const path = pathRef.current;
    const group = markerGroupRef.current;
    if (!path || !group) return;

    const length = path.getTotalLength();
    const point = path.getPointAtLength(scrollRatio * length);
    const tangent = path.getPointAtLength(Math.min(length, scrollRatio * length + 1));
    const dx = tangent.x - point.x;
    const dy = tangent.y - point.y;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    if (followScrollPath) {
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${(1 - scrollRatio) * length}`;
    } else {
      path.style.strokeDasharray = 'none';
      path.style.strokeDashoffset = '0';
    }

    group.setAttribute('transform', `translate(${point.x}, ${point.y}) rotate(${angle})`);
  }, [scrollRatio, sectionTop]);
 return (
    <Wrapper ref={wrapperRef}>
      <ContentWrapper>
        <Image ref={imgRef} src="/assets/map.svg" alt="Map Section" />
        
        <svg
          style={{
            position: 'absolute',
            top: -20,
            left: 522,
            width: '100%',
            height: `${imgHeight}px`,
            pointerEvents: 'none',
            zIndex: 2,
          }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <StyledPath ref={pathRef} d={originalPath} />
          <MarkerGroup ref={markerGroupRef}>
            <MarkerCircle r="60" />
            <MarkerImage href="/assets/Polygon.svg" />
          </MarkerGroup>
        </svg>
      </ContentWrapper>

      <IconStack>
  {/* 고정된 흰색 원 */}
  <motion.div
    style={{
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      backgroundColor: '#fff',
      position: 'absolute',
      top: 'calc(50% - 100px)',
      left: '50%',
      transform: 'translate(180%, 120%)',
    }}
  />

  {/* 움직이는 LocationOnIcon */}
  <motion.div
    style={{
      position: 'absolute',
      top: 'calc(50% - 100px)', // 기준 위치
      left: '50%',
      transform: 'translate(-50%, -50%)', // 초기 정렬만
      scale: iconScale, // ✅ 커지게
      y: iconY,         // ✅ 내려가게
      zIndex: 2,
    }}
  >
    <LocationOnIcon
      style={{
        fontSize: '92px', // ✅ 시작 크기
        color: AppColors.primary, 
        // ✅ transform 삭제!!!
      }}
    />
  </motion.div>

  <Label>{label}</Label>
</IconStack>

    </Wrapper>
  );
};

export default SecondMapBlock;