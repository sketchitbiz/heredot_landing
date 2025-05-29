'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Breakpoints } from '@/constants/layoutConstants';
import { AppColors } from '@/styles/colors';
import { CustomNavigator } from '@/customComponents/CustomNavigator';
import { userStamp } from '@/lib/api/user/api';

interface EventBlockProps {
  slides: { image: string }[];
  topLabel: string;
  centerLabel: string;
  bottomLabel: string;
  title: string;
  description: string;
  buttonTitle: string;
  onTopArrowClick?: () => void;
  onBottomArrowClick?: () => void;
}

const LinkButton = styled.div<{ $color: 'white' | 'black' }>`
  position: absolute;
  bottom: 16px;
  right: 16px;
  padding-right: 20px;
  font-size: 24px;
  font-weight: 500;
  color: ${({ $color }) => ($color === 'white' ? '#ffffff' : '#000000')};
  animation: bounceY 1.5s ease-in-out infinite;
  pointer-events: none;

  @keyframes bounceY {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
`;

const Wrapper = styled.div`
  width: 100%;
  min-width: ${Breakpoints.desktop}px;
  background-color: ${AppColors.background};

  @media (max-width: ${Breakpoints.mobile}px) {
    min-width: 0;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 100px;
`;

const ImageBox = styled.div`
  width: 1200px;
  height: 600px;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);

  @media (max-width: ${Breakpoints.mobile}px) {
    width: 100%;
    height: auto;
    padding: 0 16px;
    box-sizing: border-box;

    img {
      width: 100%;
      height: auto;
      display: block;
    }
  }
`;

export default function EventBlock({
  slides,
  topLabel,
  centerLabel,
  bottomLabel,
  title,
  description,
  buttonTitle,
  onTopArrowClick,
  onBottomArrowClick,
}: EventBlockProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < Breakpoints.mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getImageSrc = (src: string) => {
    if (!isMobile) return src;

    const lastDot = src.lastIndexOf('.');
    if (lastDot === -1) return src;
    return src.slice(0, lastDot) + '_m' + src.slice(lastDot);
  };

  const handleImageClick = (href: string) => {
    void userStamp({
      category: '버튼',
      content: 'EventBlock',
      memo: `링크 버튼: ${href}`,
    });

    window.open(href, '_blank');
  };

  return (
    <Wrapper>
      <CustomNavigator
        topLabel={topLabel}
        centerLabel={centerLabel}
        bottomLabel={bottomLabel}
        title={title}
        description={description}
        onTopArrowClick={onTopArrowClick}
        onBottomArrowClick={onBottomArrowClick}
      />

      <Content>
        {slides.map((slide, i) => {
          const color = i === 0 ? 'white' : 'black';
          const href = i === 0
            ? 'https://aigo.framer.website/'
            : 'https://xn--2e0bw7u.com/';

          return (
            <ImageBox key={i}>
              <div
                onClick={() => handleImageClick(href)}
                style={{ display: 'block', width: '100%', height: '100%', cursor: 'pointer' }}
              >
                <img
                  src={getImageSrc(slide.image)}
                  alt=""
                  width={1200}
                  height={600}
                  style={{ objectFit: 'cover' }}
                />
              </div>

              <LinkButton $color={color}>{buttonTitle}</LinkButton>
            </ImageBox>
          );
        })}
      </Content>
    </Wrapper>
  );
}
