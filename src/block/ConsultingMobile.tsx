import React from 'react';
import styled from 'styled-components';
import DownloadIcon from '@mui/icons-material/Download';
import { downloadLinks } from '@/lib/i18n/downloadLinks';
import { useLang } from '@/contexts/LangContext';

interface ConsultingProps {
  title: string;
  descriptions: string[];
  gridHeaders: string[];
  gridContents: string[][];
  downloadText: string;
}



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
  // 1. <br /> 태그 제거
  const plainText = text.replace(/<br\s*\/?>/gi, '');

  // 2. 강조 키워드 매칭 패턴
  const pattern = new RegExp(
    `(${highlightKeywordsList.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
    'g'
  );

  // 3. 분할 및 스타일 적용
  return plainText.split(pattern).map((chunk, idx) => {
    const isHighlight = highlightKeywordsList.includes(chunk);

    return (
      <span
        key={idx}
        style={{
          color: isHighlight ? '#3663BC' : '#878787',
          fontWeight: isHighlight ? 700 : 400,
        }}
      >
        {chunk}
      </span>
    );
  });
}

const MobileDownloadButton = styled.a`
  display: inline-flex;
  align-items: center;
  width: 100%;
  justify-content: center;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #000;
  border: 1px solid #ccc;
  border-radius: 6px;
  text-decoration: none;
  gap: 6px;
  margin-top: 0px;
`;

const Container = styled.div`
  padding: 24px 16px;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 25px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #000;
`;

const Description = styled.p`
  font-size: 14px;
  color: #878787;
  font-weight: 500;
  margin-bottom: 8px;
  white-space: pre-line;
`;

const BottomContainer = styled.div`
  margin-bottom: 50px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 24px;
`;

const CardTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 16px;
`;

const ItemRow = styled.div<{ $isLast?: boolean }>`
  display: flex;
  flex-direction: column;
  background-color: ${({ $isLast }) => ($isLast ? 'rgba(227, 240, 255, 0.8)' : '#FAFAFA')};
  border: 1px solid #EFEFEF;
  border-radius: 5px;
  padding: 12px;
`;

const Label = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #4F555A;
  margin-bottom: 4px;
`;

const Content = styled.div`
  font-size: 14px;
  color: #111;
  line-height: 1.6;
`;

const LineConnector = styled.div<{ $hasArrow?: boolean }>`
  width: 1px;
  height: ${({ $hasArrow }) => ($hasArrow ? '36px' : '28px')};
  background-color: #C7CDD3;
  margin: 0 auto;
  position: relative;

  ${({ $hasArrow }) =>
    $hasArrow &&
    `
    &::after {
      content: '';
      position: absolute;
      top: 28px;
      left: -4px;
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 6px solid #C7CDD3;
    }
  `}
`;


const ConsultingMobile: React.FC<ConsultingProps> = ({
  title,
  descriptions,
  gridHeaders,
  gridContents,
  downloadText,
}) => {

    const { lang } = useLang();

  const handleDownloadClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const link = downloadLinks.functionalSpecification[lang];
    window.open(link, '_blank');
  };
  return (
    <Container>
      <Title>
        {title.split('\n').map((line, i) => (
          <span key={i}>
            {line}
            <br />
          </span>
        ))}
      </Title>

      <BottomContainer>
        {descriptions.map((desc, idx) => (
          <Description key={idx}>{desc}</Description>
        ))}
      </BottomContainer>

      {gridContents.map((row, i) => (
        <Card key={i}>
          <CardTitle>{highlightKeywords(row[0])}</CardTitle>

          {[1, 2, 3].map((j) => (
            <React.Fragment key={j}>
              <ItemRow $isLast={j === 3}>
                <Label>{gridHeaders[j]}</Label>
                <Content>{highlightKeywords(row[j])}</Content>
              </ItemRow>

              {j === 1 && <LineConnector />}
              {j === 2 && <LineConnector $hasArrow />}
            </React.Fragment>
          ))}
        </Card>
        
      ))}
               <MobileDownloadButton href="#" onClick={handleDownloadClick}>
              {downloadText}
              <DownloadIcon style={{ fontSize: '16px' }} />
          </MobileDownloadButton>
    </Container>
  );
};

export default ConsultingMobile;
