'use client';

import React from 'react';
import { useLang } from '@/contexts/LangContext';
import { GradientButton } from '@/components/GradientButton';
import { ProjectPopupContent } from '@/customComponents/ProjectPopupContent';

const Text = ({ children }: { children: React.ReactNode }) => (
  <p
    style={{
      fontSize: 16,
      fontWeight: 400,
      color: '#454545',
      margin: 0,
      marginBottom: 0,
      lineHeight: '20px',
      whiteSpace: 'pre-line',
    }}
  >
    {children}
  </p>
);

const TEXT = {
  ko: {
    projectIntro:
      '기존 식당 수저를 자동으로 살균하는 살균박스에\n디스플레이를 결합하여 음식 주문 + 광고 영상 송출 가능한\n올인원 제품을 홍보 하기 위한 목업 웹·앱 입니다',
    leftHeader: {
      top: '사장님의 창업메이트',
      bottom: '루카스 테이블오더',
    },
    features: [
      ['[키오스크]', '앱 종료 방지, 단말 부팅 시 앱 자동 실행'],
      ['[핵심기능]', '대표 음식점별 키오스크 활용 기능 구현'],
      ['[편의기능]', '사용자 설문조사 + 직원호출 기능 등'],
    ],
    screenshots: ['사용자 화면', '관리자 화면'],
    confirmButtons: [
      {
        title: '서비스 웹 바로가기',
        href: 'http://121.157.229.40:8080',
      },
    ],
    volume: '화면 분량 5장 내외',
    scope: ['목업 웹 · 앱 (APK) 1식 구현'],
    stack: ['FE: Flutter', 'BE: Node.js'],
    duration: ['UI/UX 디자인 1주', 'FE/BE 개발 3주'],
  },
  en: {
    projectIntro:
      'A mock web/app to promote an all-in-one kiosk product that combines a\ncutlery sterilization box with a display for ordering food and showing advertisements.',
    leftHeader: {
      top: 'Your startup buddy',
      bottom: 'LUCAS Table Order',
    },
    features: [
      ['[Kiosk]', 'Prevents app termination, auto-runs app on boot'],
      ['[Key Functions]', 'Kiosk demo features per restaurant brand'],
      ['[Convenience]', 'Includes survey & staff call feature'],
    ],
    screenshots: ['User Screen', 'Admin Screen'],
    confirmButtons: [
      {
        title: 'Visit Web Service',
        href: 'http://121.157.229.40:8080',
      },
    ],
    volume: 'Approx. 5 screens',
    scope: ['1 mock web + APK app'],
    stack: ['FE: Flutter', 'BE: Node.js'],
    duration: ['UI/UX Design: 1 week', 'FE/BE Development: 3 weeks'],
  },
};

export const TableOrderPopup = () => {
  const { lang } = useLang();
  const t = TEXT[lang];

  return (
    <ProjectPopupContent
      imageUrl="/assets/portpolio_popup/tableorder.png"
      projectIntro={<Text>{t.projectIntro}</Text>}
      leftHeader={
        <div style={{ position: 'absolute', top: '50px', left: '20px' }}>
          <div
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#7d7d7d',
              marginBottom: '8px',
              whiteSpace: 'pre-line',
            }}
          >
            {t.leftHeader.top}
          </div>
          <div
            style={{
              fontSize: '30px',
              fontWeight: 700,
              color: '#463F40',
              whiteSpace: 'pre-line',
            }}
          >
            {t.leftHeader.bottom}
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
              <img src={`/assets/portpolio_popup/table_${i + 1}.png`} alt={title} style={{ width: '100%' }} />
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
              gradient="linear-gradient(to bottom, #FFFFFF, #FFE6EC)"
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
