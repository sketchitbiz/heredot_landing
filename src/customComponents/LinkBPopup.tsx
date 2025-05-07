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
    projectIntro:
      '2차전지 배터리팩 관제 솔루션을 통한\n실시간 배터리 위험 실시간감지 및 수명 예측 기능을 통한 제품 판매 상승 전략 시장 검증 과제 입니다',
    leftHeader: {
      line1: '배터리 관리 솔루션',
      color: '#FFFFFF',
    },
    features: [
      ['[산업IoT]', 'BMS내 DATA를 KT IoT 단말을 통한 Data 전송'],
      ['[무선 OTA]', '상시 최신 펌웨어 업데이트 지원'],
      ['[원격제어]', '유사 긴급 상황 시 BMS 전류 차단'],
      ['[배터리팩 교체 요청]', '수명 저하 시 배터리팩 교체 지원'],
      ['[배터리팩 관제]', '배터리 상태, 위치, 온도, 수명 관제'],
    ],
    screenshots: ['모바일 & PC 화면'],
    confirmButtons: [
      { title: 'PR 영상 바로가기', href: 'https://www.youtube.com/watch?v=ZGsmnebmjLQ' },
    ],
    volume: '화면 분량 100장 내외',
    scope: ['* 총 2종 웹 구성', '사용자 웹', '관리자 웹'],
    stack: ['FE: Flutter', 'BE: Node.js', 'Server: Cafe24 Cloud', 'OS: Linux', 'DB: PostgreSQL, MongoDB'],
    duration: ['스토리보드 5개월', 'UI/UX 디자인 3개월', 'FE/BE 개발 12개월'],
  },
  en: {
    projectIntro:
      'A secondary battery pack monitoring solution that provides real-time risk detection and lifecycle prediction to improve product sales.',
    leftHeader: {
      line1: 'Battery Management Solution',
      color: '#FFFFFF',
    },
    features: [
      ['[Industrial IoT]', 'Send BMS data via KT IoT devices'],
      ['[Wireless OTA]', 'Support for always-on firmware updates'],
      ['[Remote Control]', 'Shutdown current in emergency-like situations'],
      ['[Battery Pack Replacement]', 'Support for pack replacement when degraded'],
      ['[Monitoring]', 'Status, location, temperature, and lifespan monitoring'],
    ],
    screenshots: ['Mobile & PC Screen'],
    confirmButtons: [
      { title: 'Go to PR Video', href: 'https://www.youtube.com/watch?v=ZGsmnebmjLQ' },
    ],
    volume: 'Approx. 100 screens',
    scope: ['* 2 types of web systems', 'User Web', 'Admin Web'],
    stack: ['FE: Flutter', 'BE: Node.js', 'Server: Cafe24 Cloud', 'OS: Linux', 'DB: PostgreSQL, MongoDB'],
    duration: ['Storyboard: 5 months', 'UI/UX Design: 3 months', 'FE/BE Development: 12 months'],
  },
};

export const LinkBPopup = () => {
  const { lang } = useLang();
  const t = TEXT[lang];

  return (
    <ProjectPopupContent
      imageUrl="/assets/portpolio_popup/link-b.png"
      projectIntro={<Text>{t.projectIntro}</Text>}
      leftHeader={
        <div style={{ position: 'absolute', top: '150px', left: '60px' }}>
          <div style={{
            fontSize: '18px',
            fontWeight: 600,
            color: t.leftHeader.color,
            marginBottom: '8px',
          }}>
            {t.leftHeader.line1}
          </div>
        </div>
      }
      featureList={
        <>
          {t.features.map(([label, desc], i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#3f4347', lineHeight: '24px' }}>{label}</div>
              <div style={{
                fontWeight: 400,
                color: '#3f4347',
                whiteSpace: 'pre-line',
                lineHeight: '24px',
              }}>{desc}</div>
            </div>
          ))}
        </>
      }
      projectScreenshots={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {t.screenshots.map((title, i) => (
            <div key={i}>
              <h4 style={{ fontWeight: 700, fontSize: 16, color: '#3f4347' }}>{title}</h4>
              <img src={`/assets/portpolio_popup/linkB_${i + 1}.png`} alt={title} style={{ width: '100%' }} />
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
              gradient="linear-gradient(to bottom, #3E403C, #3E403C)"
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
