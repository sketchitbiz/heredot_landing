'use client';

import React, { useEffect, useState } from 'react';
import { useLang } from '@/contexts/LangContext';
import { ProjectPopupContent } from '@/customComponents/ProjectPopupContent';
import { GradientButton } from '@/components/GradientButton';
import { CustomPopupText } from './CustomPopupText';
import { userStamp } from '@/lib/api/user/api';
import { Breakpoints } from '@/constants/layoutConstants';

const hrefs = [
  'https://exitobiz.co.kr/',
  'https://play.google.com/store/apps/details?id=com.ctns.itda_user&hl=ko',
  'https://apps.apple.com/kr/app/%EC%97%91%EC%8B%9C%ED%86%A0-%ED%95%9C%EB%88%88%EC%97%90-%EB%B3%B4%EB%8A%94-%EC%8A%A4%ED%83%80%ED%8A%B8%EC%97%85-%EC%A7%80%EC%9B%90%EC%82%AC%EC%97%85-%EC%96%B4%ED%94%8C/id1555629389',
];

const TEXT = {
  ko: {
    projectIntro: '산재된 정부지원사업을 1일 단위 자동 수집을 통하여 창업팀에게 지원사업 안내 하는 솔루션 입니다',
    leftHeader: (
      <>
        <span style={{ color: '#FFFFFF' }}>지원사업</span>
        <br />
        <span style={{ color: '#03F4FF' }}>확인</span>
        <span style={{ color: '#FFFFFF' }}> 부터</span>
        <span style={{ color: '#03F4FF' }}> 선정</span>
        <span style={{ color: '#FFFFFF' }}> 까지</span>
      </>
    ),
    features: [
      ['[크롤링]', '200개 지원사업 기관 1일 단위 자동수집'],
      ['[맞춤알림]', '관심분야 , 키워드 , 맞춤 지원사업 알림'],
      ['[편의기능]', '창업 뉴스, 창업 커뮤니티 운영'],
      ['[하이브리드 앱]', '웹뷰 기반 앱 패키징 AOS, IOS 출시'],
    ],
    screenshots: ['서비스 웹 페이지', '💻  PC 화면'],
    confirmButtons: ['서비스 웹 바로가기', 'AOS 앱 바로가기', 'IOS 앱 바로가기'],
    volume: '화면 분량 30장 내외',
    scope: ['* 총 2종 웹·앱(AOS ·IOS) 구성', '사용자 웹·앱', '관리자용 웹'],
    stack: ['FE: React.js, Flutter', 'BE: Node.js', 'Server: Cafe24 Cloud', 'OS: Linux', 'DB: PostgreSQL'],
    duration: ['스토리보드 2.5주', 'UI/UX 디자인 1.5주', 'FE/BE 개발 12주'],
  },
  en: {
    projectIntro:
      'A solution that collects scattered government support programs daily and informs startups of available opportunities.',
    leftHeader: (
      <>
        <span style={{ color: '#FFFFFF' }}>From</span>
        <br />
        <span style={{ color: '#03F4FF' }}>Program</span>
        <span style={{ color: '#FFFFFF' }}> Discovery</span>
        <span style={{ color: '#03F4FF' }}> to</span>
        <span style={{ color: '#FFFFFF' }}> Final Selection</span>
      </>
    ),
    features: [
      ['[Crawling]', 'Auto-crawling over 200 public program sources daily'],
      ['[Custom Alerts]', 'Keyword and interest-based customized notifications'],
      ['[Convenience]', 'Startup news and community features'],
      ['[Hybrid App]', 'Webview-based app for AOS and iOS launched'],
    ],
    screenshots: ['Service Web Page', '💻 PC Screen'],
    confirmButtons: ['Go to Web Service', 'Open AOS App', 'Open iOS App'],
    volume: 'Approx. 30 screens',
    scope: ['* Consists of 2 types (Web/App for AOS·iOS)', 'User Web/App', 'Admin Web'],
    stack: ['FE: React.js, Flutter', 'BE: Node.js', 'Server: Cafe24 Cloud', 'OS: Linux', 'DB: PostgreSQL'],
    duration: ['Storyboard: 2.5 weeks', 'UI/UX Design: 1.5 weeks', 'FE/BE Development: 12 weeks'],
  },
};

export const ExitoPopup = () => {
  const { lang } = useLang();
  const t = TEXT[lang];

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => {
      setIsMobile(window.innerWidth <= Breakpoints.mobile);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <ProjectPopupContent
      imageUrl="/assets/portpolio_popup/exito.webp"
      leftHeader={
        <div
          style={{
            position: 'absolute',
            top: isMobile ? '80px' : '160px',
            left: isMobile ? '50px' : '110px',
            fontSize: isMobile ? '14px' : '30px',
            fontWeight: 700,
            lineHeight: 1.4,
          }}
        >
          {t.leftHeader}
        </div>
      }
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
              <img src={`/assets/portpolio_popup/exito_${i + 1}.webp`} alt={title} style={{ width: '100%' }} />
            </div>
          ))}
        </div>
      }
      pjtConfirm={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {t.confirmButtons.map((title, i) => (
            <GradientButton
              key={i}
              title={title}
              onClick={() => {
                void userStamp({
                  uuid: localStorage.getItem('logId') ?? 'anonymous',
                  category: '버튼',
                  content: '엑시토',
                  memo: `외부 링크: ${title}`,
                });
                window.open(hrefs[i], '_blank', 'noopener noreferrer');
              }}
              titleColor="#FFFFFF"
              gradient="linear-gradient(to bottom, #4c5cd4, #27349D)"
            />
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
