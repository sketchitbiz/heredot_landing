'use client';

import React from 'react';
import styled, { keyframes } from 'styled-components';
import DownloadIcon from '@mui/icons-material/Download';
import { useLang } from '@/contexts/LangContext';
import { downloadLinks } from '@/lib/i18n/downloadLinks';

interface DesignMobileBlockProps {
  title: string;
  tabs: string[];
  tabNumbers: string[];
  slides: { title: string; image: string }[];
  downloadText: string;
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
  font-size: 20px;
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
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TabNumber = styled.span`
  font-size: 12px;
  opacity: 0.7;
`;

const DownloadWrapper = styled.div`
  position: sticky;
  bottom: 0;
  width: 100%;
  height: 56px;
  padding-top: 20px;
  margin-top: 50px;
  background-color: #000;
  z-index: 10;
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
}) => {
  const { lang } = useLang();

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
          <Image src={convertImagePath(slide.image)} alt={slide.title} />
        </React.Fragment>
      ))}
      <MobileDownloadButton href={getDownloadLink()} target="_blank" rel="noopener noreferrer">
          {downloadText} <DownloadIcon style={{ fontSize: '16px' }} />
      </MobileDownloadButton>
    </Wrapper>
  );
};

export default DesignMobile;