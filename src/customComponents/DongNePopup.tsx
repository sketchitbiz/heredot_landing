'use client';

import React from 'react';
import { useLang } from '@/contexts/LangContext';
import { ProjectPopupContent } from '@/customComponents/ProjectPopupContent';
import { CustomPopupText } from './CustomPopupText';
import { userStamp } from '@/lib/api/user/api';

const TEXT = {
  ko: {
    projectIntro:
      '1인 가구가 늘어나는 시대,\n비슷한 동네 사람들과 함께 야식 먹고, 소소한 대화도 나눌 수 있는\n성인 대상 소셜 커뮤니티 앱입니다',
    features: [
      ['[GPS]', '지역기반 야식 함께 먹을 친구 모집 기능'],
      ['[레벨]', '활동 경험치 기반 등급 시스템 제공'],
      ['[AI 맛집추천]', '챗봇형태의 주변 맛집 가게 추천 및 레이드 모임장소 개설 기능'],
    ],
    screenshots: ['서비스 웹 페이지'],
    volume: '화면 분량 30장 내외',
    scope: ['* 총 2종 웹·앱(AOS ·IOS) 구성', '사용자 웹·앱', '관리자용 웹'],
    stack: ['FE: Flutter', 'BE: Java Spring boot', 'Server: Cafe24 Cloud', 'OS: Linux', 'DB: PostgreSQL'],
    duration: ['스토리보드 4주', 'UI/UX 디자인 2주', 'FE/BE 개발 8주'],
  },
  en: {
    projectIntro:
      'In an era of increasing single-person households,\nthis social community app helps nearby adults share late-night meals and casual chats together.',
    features: [
      ['[GPS]', 'Find friends nearby to enjoy late-night snacks together'],
      ['[Level]', 'Gamified user leveling system based on activity'],
      ['[AI Restaurant Recs]', 'Chatbot-style local restaurant recommendations & group meeting setup'],
    ],
    screenshots: ['Service Web Page'],
    volume: 'Approx. 30 screens',
    scope: ['* Includes 2 types (Web/App for AOS·iOS)', 'User Web/App', 'Admin Web'],
    stack: ['FE: Flutter', 'BE: Java Spring Boot', 'Server: Cafe24 Cloud', 'OS: Linux', 'DB: PostgreSQL'],
    duration: ['Storyboard: 4 weeks', 'UI/UX Design: 2 weeks', 'FE/BE Development: 8 weeks'],
  },
};

export const DongNePopup = () => {
  const { lang } = useLang();
  const t = TEXT[lang];

  return (
    <ProjectPopupContent
      imageUrl="/assets/portpolio_popup/dongne.webp"
      projectIntro={<CustomPopupText>{t.projectIntro}</CustomPopupText>}
      featureList={
        <>
          {t.features.map(([label, desc], i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#3f4347', lineHeight: '24px' }}>{label}</div>
              <div style={{ fontWeight: 400, color: '#3f4347', whiteSpace: 'pre-line', lineHeight: '24px' }}>{desc}</div>
            </div>
          ))}
        </>
      }
      projectScreenshots={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {t.screenshots.map((title, i) => (
            <div key={i}>
              <h4 style={{ fontWeight: 700, fontSize: 16, color: '#3f4347' }}>{title}</h4>
              <img src={`/assets/portpolio_popup/dongne_${i + 1}.webp`} alt={title} style={{ width: '100%' }} />
            </div>
          ))}
        </div>
      }
      pjtVolume={<CustomPopupText>{t.volume}</CustomPopupText>}
      pjtScope={<>{t.scope.map((line, i) => <CustomPopupText key={i}>{line}</CustomPopupText>)}</>}
      pjtStack={<>{t.stack.map((line, i) => <CustomPopupText key={i}>{line}</CustomPopupText>)}</>}
      pjtDuration={<>{t.duration.map((line, i) => <CustomPopupText key={i}>{line}</CustomPopupText>)}</>}
    />
  );
};
