'use client';

import React from 'react';
import { useLang } from '@/contexts/LangContext';
import { GradientButton } from '@/components/GradientButton';
import { ProjectPopupContent } from '@/customComponents/ProjectPopupContent';

const Text = ({ children }: { children: React.ReactNode }) => (
  <p style={{
    fontSize: 16,
    fontWeight: 400,
    color: '#454545',
    margin: 0,
    marginBottom: 0,
    lineHeight: '20px',
    whiteSpace: 'pre-line',
  }}>
    {children}
  </p>
);

const TEXT = {
  ko: {
    projectIntro: '휠체어 사용자들을 위한 지도 기반 매장 정보 제공 플랫폼 입니다',
    leftHeader: {
      line1: '일상을 잇다,',
      line2: '윌체어',
    },
    features: [
      ['[GPS]', '단말 위치기반 가까운 매장 정보 안내'],
      ['[필터]', '관심 분야 , 지역별 정보 필터'],
      ['[지도]', '네이버 지도 기반 10만개 가게정보\n1초내 마커 출력 및 클러스터링 기술 적용'],
      ['[크롤링]', '전국 가게 생성 및 폐업 정보 수집'],
      ['[Data 선별]', '장애인관점 매장정보 선별\n장애인 주차장·화장실 ·엘베 ·경사로 여부등'],
    ],
    screenshots: ['서비스 페이지'],
    confirmButtons: [
      { title: '서비스 웹 바로가기', href: 'https://we.willchair.co.kr/' },
      { title: 'AOS 앱 바로가기', href: 'https://play.google.com/store/apps/details?id=com.js.willchair&hl=ko' },
      { title: 'IOS 앱 바로가기', href: 'https://apps.apple.com/kr/app/%EC%9C%8C%EC%B2%B4%EC%96%B4/id1577352377' },
    ],
    volume: '화면 분량 30장 내외',
    scope: ['* 총 2종 웹·앱(AOS ·IOS) 구성', '사용자 앱', '관리자용 웹'],
    stack: ['FE: Flutter', 'BE: Java Spring boot', 'Server: Cafe 24 Cloud', 'OS: Linux', 'DB: PostgreSQL'],
    duration: ['스토리보드 4주', 'UI/UX 디자인 2주', 'FE/BE 개발 12주'],
  },
  en: {
    projectIntro: 'A map-based store information platform for wheelchair users',
    leftHeader: {
      line1: 'Connecting Daily Life,',
      line2: 'WillChair',
    },
    features: [
      ['[GPS]', 'Guide to nearby stores using device location'],
      ['[Filter]', 'Filter by interest or region'],
      ['[Map]', '10K+ store data based on Naver Map\nClustering + marker loading within 1 second'],
      ['[Crawling]', 'Nationwide store creation/closure data scraping'],
      ['[Data Curation]', 'Store data filtered for wheelchair-accessibility:\nParking · Restroom · Elevator · Ramp'],
    ],
    screenshots: ['Service Page'],
    confirmButtons: [
      { title: 'Visit Web Service', href: 'https://we.willchair.co.kr/' },
      { title: 'Visit AOS App', href: 'https://play.google.com/store/apps/details?id=com.js.willchair&hl=ko' },
      { title: 'Visit iOS App', href: 'https://apps.apple.com/kr/app/%EC%9C%8C%EC%B2%B4%EC%96%B4/id1577352377' },
    ],
    volume: 'Approx. 30 screens',
    scope: ['* 2 types: Web + App (AOS · iOS)', 'User App', 'Admin Web'],
    stack: ['FE: Flutter', 'BE: Java Spring boot', 'Server: Cafe 24 Cloud', 'OS: Linux', 'DB: PostgreSQL'],
    duration: ['Storyboard: 4 weeks', 'UI/UX Design: 2 weeks', 'FE/BE Development: 12 weeks'],
  },
};

export const WillChairPopup = () => {
  const { lang } = useLang();
  const t = TEXT[lang];

  return (
    <ProjectPopupContent
      imageUrl="/assets/portpolio_popup/willchair.png"
      projectIntro={<Text>{t.projectIntro}</Text>}
      leftHeader={
        <div style={{ position: 'absolute', top: '150px', left: '50px' }}>
          <div style={{ fontSize: '30px', fontWeight: 700, color: '#fffefe', marginBottom: '8px' }}>
            {t.leftHeader.line1}
          </div>
          <div style={{ fontSize: '30px', fontWeight: 700, color: '#fffefe' }}>
            {t.leftHeader.line2}
          </div>
        </div>
      }
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
              <img src={`/assets/portpolio_popup/willchair_${i + 1}.png`} alt={title} style={{ width: '100%' }} />
            </div>
          ))}
        </div>
      }
      pjtConfirm={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {t.confirmButtons.map((btn, i) => (
            <GradientButton
              key={i}
              title={btn.title}
              href={btn.href}
              titleColor="#FFFFFF"
              gradient="linear-gradient(to bottom, #f4b3a3, #f4947c)"
            />
          ))}
        </div>
      }
      pjtVolume={<Text>{t.volume}</Text>}
      pjtScope={<>{t.scope.map((line, i) => <Text key={i}>{line}</Text>)}</>}
      pjtStack={<>{t.stack.map((line, i) => <Text key={i}>{line}</Text>)}</>}
      pjtDuration={<>{t.duration.map((line, i) => <Text key={i}>{line}</Text>)}</>}
    />
  );
};
