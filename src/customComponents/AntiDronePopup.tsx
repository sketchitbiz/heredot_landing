'use client';

import React from 'react';
import { useLang } from '@/contexts/LangContext';
import { ProjectPopupContent } from '@/customComponents/ProjectPopupContent';
import { CustomPopupText } from './CustomPopupText';


const TEXT = {
  ko: {
    projectIntro:
      '하드웨어 센서 기반으로 자폭 · 공격 드론을 식별·탐지한 뒤, 이를 무력화하는 시스템으로, 국방 및 주요 국가 시설에 납품되는 제품입니다.',
    features: [

      ['[RabbitMQ]', '센싱 데이터를 실시간 연계 및 활용'],
      ['[Web Push]', '드론 침입 · 무력화 시 실시간 알림'],
      ['[3D Map]', '드론 위치를 실시간으로 3D 맵 이동 구현'],
      ['[RealTime]', 'Streaming API를 통한 실시간 이동 식별'],
      ['[Dashboard]', '드론 위치별 현황 데이터, 침입현황, 처리현황, 드론정보관련 지표'],
    ],
    screenshots: ['사용자 화면', '관리자 화면'],
    volume: '화면 분량 30장 내외',
    scope: ['* 총 3종 웹 구성', '사용자 관제 웹', '하드웨어 설정 웹', '관리자용 웹'],
    stack: ['FE: React.js', 'BE: Python', 'Server: 독립 서버', 'OS: Linux', 'DB: PostgreSQL, MongoDB'],
    duration: ['스토리보드 4주', 'UI/UX 디자인 4주', 'FE/BE 개발 14주'],
  },
  en: {
    projectIntro:
      'A system that detects and disables suicide or attack drones using hardware sensors. Delivered to national defense and key government facilities.',
    features: [
     
      ['[RabbitMQ]', 'Real-time data integration from sensors'],
      ['[Web Push]', 'Instant alerts when drones are neutralized'],
      ['[3D Map]', 'Live drone movement on 3D maps'],
      ['[RealTime]', 'Live tracking using streaming APIs'],
      ['[Dashboard]', 'Drone location status data, intrusion status, processing status, and drone information indicators'],
    ],
    screenshots: ['User View', 'Admin View'],
    volume: 'Approximately 30 screens',
    scope: ['* 3 types of web systems', 'User Control Web', 'Hardware Config Web', 'Admin Web'],
    stack: ['FE: React.js', 'BE: Python', 'Server: Dedicated', 'OS: Linux', 'DB: PostgreSQL, MongoDB'],
    duration: ['Storyboard: 4 weeks', 'UI/UX Design: 4 weeks', 'FE/BE Development: 14 weeks'],
  },
};

export const AntiDronePopup = () => {
  const { lang } = useLang();
  const t = TEXT[lang];

  return (
    <ProjectPopupContent
      imageUrl="/assets/portpolio_popup/antidrone.webp"
      projectIntro={<CustomPopupText>{t.projectIntro}</CustomPopupText>}
      featureList={
        <>
          {t.features.map(([label, desc], i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#3f4347', lineHeight: '24px' }}>{label}</div>
              <div style={{ fontWeight: 400, color: '#3f4347', whiteSpace: 'pre-line' , lineHeight: '24px'}}>{desc}</div>
            </div>
          ))}
        </>
      }
      projectScreenshots={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* 기존 스크린샷 렌더링 */}
          {t.screenshots.map((title, i) => (
            <div key={i}>
              <h4 style={{ fontWeight: 700, fontSize: 16, color: '#3f4347' }}>{title}</h4>
              <img
                src={`/assets/portpolio_popup/antidron_${i + 1}.webp`}
                alt={title}
                style={{ width: '100%' }}
              />
            </div>
          ))}
      
          {/* antidron_4 이미지 추가 */}
          <div>
            <img
              src="/assets/portpolio_popup/antidron_4.webp"
              alt="Additional Screenshot"
              style={{ width: '100%' }}
            />
          </div>
        </div>
      }
      pjtVolume={<CustomPopupText>{t.volume}</CustomPopupText>}
      pjtScope={<>{t.scope.map((line, i) => <CustomPopupText key={i}>{line}</CustomPopupText>)}</>}
      pjtStack={<>{t.stack.map((line, i) => <CustomPopupText key={i}>{line}</CustomPopupText>)}</>}
      pjtDuration={<>{t.duration.map((line, i) => <CustomPopupText key={i}>{line}</CustomPopupText>)}</>}
    />
  );
};
