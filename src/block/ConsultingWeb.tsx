'use client';
 
import { useEffect, useRef, useState } from 'react';
import styled, { keyframes }  from 'styled-components';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DownloadIcon from '@mui/icons-material/Download';
import { useLang } from '@/contexts/LangContext';
import { downloadLinks } from '@/lib/i18n/downloadLinks';
import CustomBlockLayout from '@/customComponents/CustomBlockLayout';
import { Breakpoints } from '@/constants/layoutConstants';
import { userStamp } from '@/lib/api/user/api';
 
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface ConsultingProps {
  title: string;
  descriptions: string[];
  downloadText: string;
  gridHeaders: string[];
  gridContents: string[][];
  onEnterSection?: () => void; // ✅ 추가
}
 
gsap.registerPlugin(ScrollTrigger);
 
const logButtonClick = async (content: string, memo: string) => {
  try {
    await userStamp({
      category: '버튼',
      content,
      memo,
    });
  } catch (e) {
  }
};
 
 
const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
`;
 
const DescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 200px;
`;
 
const DownloadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: 16px;
`;
 
const TextTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  line-height: 1.4;
  margin-bottom: 24px;
  color: #000;
`;
 
const TextDescription = styled.p`
  font-size: 16px;
  color: #444;
  line-height: 1.8;
  white-space: pre-line;
  margin: 4px 0;
`;
 
const RightContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: visible;
  position: relative;
`;

const arrowSlide = keyframes`
  0% { transform: translateX(-30%); opacity: 0; }
  30% { opacity: 1; }
  100% { transform: translateX(100%); opacity: 0; }
`;
const typewriter = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

const gradientBorder = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Wrapper = styled.div`
  min-width: ${Breakpoints.desktop}px;
  background-color: #fff;
 
`;
 
const StackWrapper = styled.div`
  position: relative;
  width: 780px;
  height: 580px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
 
const Box = styled.div`
  position: absolute;
  border: 2px solid #000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  box-sizing: border-box;
  overflow: hidden;
  opacity: 0;
  visibility: hidden;
`;
 
const DownloadLink = styled.a`
  position: relative;
  font-size: 14px;
  color: #000000;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 14px;
  border-radius: 8px;
  background-color: white;
  overflow: hidden;
  z-index: 1;
  text-decoration: none;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    padding: 2px;
    border-radius: 8px;
    background: linear-gradient(90deg, #5708fb, #be83ea, #5708fb);
    background-size: 300% 300%;
    animation: ${gradientBorder} 2s ease infinite;
    z-index: -1;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    -webkit-mask-composite: destination-out;
  }

  .icon {
    animation: ${arrowSlide} 2s ease-in-out infinite;
  }

  .text {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    animation: ${typewriter} 2s steps(20, end) infinite;
  }
`;
 
const Grid = styled.div`
  display: grid;
  grid-template-columns: 130px 220px 260px 130px;
  width: 100%;
`;
 
const Cell = styled.div<{ $visible: boolean }>`
  font-size: 14px;
  color: #000;
  text-align: center;
  white-space: normal;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
  transition: opacity 0.4s ease;
  line-height: 1.4;
`;
 
const GridHeader = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 780px;
  display: grid;
  grid-template-columns: 130px 220px 260px 130px;
  padding: 0 16px;
  z-index: 10;
`;
const highlightKeywordsList = [
  'USB',
  '구글 OTP',
  'Google OTP',
  '2Factor',
  '접속 기기 다변화 수용',
  'Expanded device support',
  '전체 기능 요구',
  'Request for all features',
  '핵심/편의 기능 분리',
  'separating core and convenience features',
  '사업성장 최적화',
  'Optimized growth strategy',
  '법적기준 개발 가이드',
  'Legal standards for compliant development',
  '준법 RISK 최소화',
  'Minimization of compliance risk'
];
 
function highlightKeywords(text: string): React.ReactNode {
  // <br /> 유지하고 React 요소로 변환
  const pattern = new RegExp(
    `(${highlightKeywordsList.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
    'g'
  );
 
  // <br />를 기준으로 줄바꿈 처리하며 각 줄 내에서 강조
  return text.split(/<br\s*\/?>/i).flatMap((line, lineIdx, arr) => {
    const parts = line.split(pattern).map((chunk, idx) => {
      const isHighlight = highlightKeywordsList.includes(chunk);
      return (
        <span
          key={`${lineIdx}-${idx}`}
          style={{
            color: isHighlight ? '#3663BC' : '#878787',
            fontWeight: isHighlight ? 700 : 400,
          }}
        >
          {chunk}
        </span>
      );
    });
 
    return lineIdx < arr.length - 1 ? [...parts, <br key={`br-${lineIdx}`} />] : parts;
  });
}
 
const GridHeaderCell = styled.div<{ $visible: boolean }>`
  font-size: 13px;
  font-weight: 600;
  text-align: center;
  color: #666;
  line-height: 1.4;
  padding: 16px 0;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
  transition: opacity 0.4s ease;
`;
 
const ConsultingWeb: React.FC<ConsultingProps> = ({
  title,
  descriptions,
  downloadText,
  gridHeaders,
  gridContents,
  onEnterSection,
}) => {
  const { lang } = useLang();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const horizontalRefs = useRef<HTMLDivElement[]>([]);
  const verticalRefs = useRef<HTMLDivElement[]>([]);
 
  const [visibleMap, setVisibleMap] = useState<number[][]>(
    Array(3).fill([0, 0, 0, 0])
  );
  const [headerVisible, setHeaderVisible] = useState([0, 0, 0, 0]);
 
  const size = 150;
  const verticalWidth = 220;
  const gap = 20;
  const start = 45;
  const verticalStart = 150;
  const centerTop = 780 / 2 - size / 2;
  const centerLeft = 780 / 2;
    const [isMobile, setIsMobile] = useState(false);
 
      useEffect(() => {
        const checkMobile = () => {
          setIsMobile(window.innerWidth < Breakpoints.mobile);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
      }, []);
 
      const handleDownloadClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const link = downloadLinks.functionalSpecification[lang];
        logButtonClick('Consulting', '기능명세 다운로드');
        logButtonClick('Consulting', '기능명세 다운로드');
        window.open(link, '_blank');
      };
 
  useEffect(() => {
    if (isMobile ||!wrapperRef.current) return;
 
    const initialMap = Array(3).fill([0, 0, 0, 0]);
 
    const tl = gsap.timeline({
      scrollTrigger: {
        id: 'consulting',
        trigger: wrapperRef.current,
        start: 'top top',
        end: '+=1000',
        pin: true,
        // pinType: 'transform',
        scrub: false,
        onEnter: () => {
          setVisibleMap(Array(3).fill([0, 0, 0, 0]));
          setHeaderVisible([0, 0, 0, 0]);
          tl.restart();
          if (!isMobile) {
            onEnterSection?.(); // ✅ 추가
          }
        },
        onEnterBack: () => {
          setVisibleMap(Array(3).fill([0, 0, 0, 0]));
          setHeaderVisible([0, 0, 0, 0]);
          tl.restart();
          if (!isMobile) {
            onEnterSection?.(); // ✅ 추가
          }
        },
        
      },
    });
 
    tl.to(
      [...horizontalRefs.current, ...verticalRefs.current],
      {
        opacity: 1,
        duration: 0.3,
        stagger: 0.02,
        onStart: () => {
          [...horizontalRefs.current, ...verticalRefs.current].forEach((el) => {
            if (el) el.style.visibility = 'visible';
          });
        },
      },
      0
    );
 
    horizontalRefs.current.forEach((el, i) => {
      const top = start + i * (size + gap);
      tl.to(el, { top, left: 0, duration: 0.3, ease: 'power2.out' }, i * 0.1);
    });
 
    verticalRefs.current.forEach((el, i) => {
      const left = verticalStart + i * (verticalWidth + gap);
      tl.to(el, { top: 0, left, duration: 0.3, ease: 'power2.out' }, i * 0.1);
    });
 
    horizontalRefs.current.forEach((el, i) => {
      const expandStart = 0.6 + i * 0.2;
      tl.to(el, {
        width: 780,
        height: size,
        borderRadius: 24,
        duration: 0.6,
        ease: 'power3.out',
      }, expandStart);
 
      tl.call(() => {
        setVisibleMap((prev) => {
          const next = [...prev];
          next[i] = [...next[i]];
          next[i][0] = 1;
          return next;
        });
        setHeaderVisible((prev) => {
          const next = [...prev];
          next[0] = 1;
          return next;
        });
      }, [], expandStart + 0.05);
    });
 
    verticalRefs.current.forEach((el, i) => {
      const vExpandStart = 1.5 + i * 0.4;
      tl.to(el, {
        width: verticalWidth,
        height: 580,
        borderRadius: 24,
        duration: 0.6,
        ease: 'power3.out',
      }, vExpandStart);
 
      tl.call(() => {
        setVisibleMap((prev) =>
          prev.map((row) => {
            const updated = [...row];
            updated[i + 1] = 1;
            return updated;
          })
        );
        setHeaderVisible((prev) => {
          const next = [...prev];
          next[i + 1] = 1;
          return next;
        });
      }, [], vExpandStart + 0.05);
    });
 
    tl.call(() => {
      setVisibleMap((prev) =>
        prev.map((row) => {
          const updated = [...row];
          updated[3] = 1;
          return updated;
        })
      );
      setHeaderVisible((prev) => {
        const next = [...prev];
        next[3] = 1;
        return next;
      });
    }, [], '+=0.01');
 
    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);;
 
  const horizontalBoxes = gridContents.map((row, i) => (
    <Box
      key={`h-${i}`}
      ref={(el) => {
        if (el) horizontalRefs.current[i] = el;
      }}
      style={{
        width: size,
        height: size,
        borderRadius: 100,
        zIndex: 2,
        top: centerTop,
        border: '1px solid #E6E6E6',
        backgroundColor: 'rgba(248, 248, 248, 0.7)',
        left: centerLeft,
      }}
    >
      <Grid>
        {row.map((text, idx) => (
          <Cell key={idx} $visible={!!visibleMap[i]?.[idx]}>
            {highlightKeywords(text)}
          </Cell>
        ))}
      </Grid>
    </Box>
  ));
 
  const verticalBoxes = [0, 1].map((i) => (
    <Box
      key={`v-${i}`}
      ref={(el) => {
        if (el) verticalRefs.current[i] = el;
      }}
      style={{
        width: size,
        height: size,
        borderRadius: 100,
        zIndex: 2,
        top: centerTop,
        left: centerLeft,
        border: '1px solid #E6E6E6',
        backgroundColor: 'rgba(238, 203, 255, 0.7)',
      }}
    />
  ));
 
  return (
    <Wrapper>
    <div ref={wrapperRef}>
      <CustomBlockLayout>
        <CustomBlockLayout.Left>
          <TitleContainer>
            <TextTitle>
              {title.split('\n').map((line, idx) => (
                <span key={idx}>
                  {line}
                  <br />
                </span>
              ))}
            </TextTitle>
          </TitleContainer>
 
          <DescriptionContainer>
            {descriptions.map((desc, idx) => (
              <TextDescription key={idx}>{desc}</TextDescription>
            ))}
          </DescriptionContainer>

          {/* <DownloadContainer> */}
            <DownloadLink href="#" onClick={handleDownloadClick}>
            <span className="text">{downloadText}</span>
            <ArrowForwardIosIcon className="icon" style={{ fontSize: '16px' }} />
            </DownloadLink>
          {/* </DownloadContainer> */}
        </CustomBlockLayout.Left>
 
        <CustomBlockLayout.Right>
          <StackWrapper ref={stackRef}>
            <GridHeader>
              {gridHeaders.map((header, idx) => (
                <GridHeaderCell key={idx} $visible={!!headerVisible[idx]}>
                  {header}
                </GridHeaderCell>
              ))}
            </GridHeader>
            {verticalBoxes}
            {horizontalBoxes}
          </StackWrapper>
        </CustomBlockLayout.Right>
      </CustomBlockLayout>
    </div>
    </Wrapper>
 
  );
};
 
export default ConsultingWeb;