'use client';

import React from 'react';
import styled from 'styled-components';
import { AppColors } from '@/styles/colors';
import { aiChatDictionary } from '@/lib/i18n/aiChat';

// 스타일 컴포넌트
const FreeFormGuideContainer = styled.div<{ $isNarrowScreen?: boolean }>`
  width: 100%;
  /* max-width: 48rem; */
  font-weight: 300;
  padding: 0;
  background-color: ${AppColors.background};
  border-radius: 8px;
  text-align: ${(props) =>
    props.$isNarrowScreen ? 'left' : 'left'}; // 항상 왼쪽 정렬
  color: #9ca3af;
  line-height: 1.6;

  .content {
    margin-top: ${(props) => (props.$isNarrowScreen ? '0.8rem' : '1.5rem')};
    padding-left: 4rem;
  }

  p {
    margin-bottom: 1rem;
    color: ${AppColors.onBackground};
    font-weight: 400;
    font-weight: 300;
  }

  ul {
    list-style: none;
    padding-left: 0;
    margin-bottom: 1.5rem;
    text-align: left; /* 항상 텍스트 왼쪽 정렬 */
  }

  li {
    margin-bottom: 0.75rem;
    color: #ffffff; /* 흰색으로 변경 */
    padding-left: 1.25rem;
    position: relative;
    font-weight: 400;

    &::before {
      content: '•';
      position: absolute;
      left: 0;
      top: 0;
      color: ${AppColors.primary}; /* Bullet 색상 유지 */
    }

    strong {
      font-weight: 400;
    }

    span {
      color: ${AppColors.onPrimaryGray};
      display: block;
      margin-left: 0.5rem;
      margin-top: 0.25rem;
      font-weight: 300;
    }
  }
`;

const ProfileContainer = styled.div<{ $isNarrowScreen?: boolean }>`
  display: flex;
  align-items: center;
  margin-bottom: ${(props) => (props.$isNarrowScreen ? '1rem' : '0')};
  width: ${(props) => (props.$isNarrowScreen ? '100%' : 'auto')};
  justify-content: flex-start; // 항상 왼쪽 정렬
`;

const ProfileImage = styled.img<{ $isNarrowScreen?: boolean }>`
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1rem; /* 항상 오른쪽 여백 유지 */
`;

const ProfileName = styled.p`
  font-size: 20px;
  color: ${AppColors.onBackground};
  font-weight: bold;
  margin: 0; /* 마진 제거 */
  margin-top: 16px;
`;

interface FreeFormGuideProps {
  isNarrowScreen: boolean;
  lang: 'ko' | 'en';
}

const FreeFormGuide: React.FC<FreeFormGuideProps> = ({
  isNarrowScreen,
  lang,
}) => {
  const t = aiChatDictionary[lang];

  return (
    <FreeFormGuideContainer $isNarrowScreen={isNarrowScreen}>
      <ProfileContainer $isNarrowScreen={isNarrowScreen}>
        <ProfileImage
          $isNarrowScreen={isNarrowScreen}
          src="/ai/pretty.png"
          alt="AI 프로필"
        />
        <ProfileName>
          <strong>{t.profileName}</strong>
        </ProfileName>
      </ProfileContainer>

      <div className="content">
        <p>{t.fileSupport.title}</p>
        <ul>
          <li>
            {t.fileSupport.url}
            <br />
            <span>&quot;{t.fileSupport.urlExample}&quot;</span>
          </li>
          <li>{t.fileSupport.image}</li>
          <li>
            {t.fileSupport.pdf}
            <br />
            <span>{t.fileSupport.unsupported}</span>
          </li>
        </ul>
        <p>{t.fileSupport.message}</p>
      </div>
    </FreeFormGuideContainer>
  );
};

export default FreeFormGuide;
