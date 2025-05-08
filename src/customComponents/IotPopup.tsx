'use client';

import React from 'react';
import { useLang } from '@/contexts/LangContext';
import { ProjectPopupContent } from '@/customComponents/ProjectPopupContent';
import { GradientButton } from '@/components/GradientButton';
import { CustomPopupText } from './CustomPopupText';


const TEXT = {
  ko: {
    projectIntro: '캠핑 난방기기 제어 IOT 앱으로\nBLE 기반 온도, 난방시간 조정 IoT 앱',
    leftHeader: {
      line1: '캠핑카 블루투스 난방 제어 앱',
    },
    features: [['[BLE]', '캠핑용 난방기기 연결 및 제어']],
    screenshots: ['서비스 웹 페이지'],
    confirmButtons: [
      {
        title: 'IOS 앱 바로가기',
        href: 'https://apps.apple.com/pl/app/%EC%97%89%EB%94%B0-%EC%BA%A0%ED%95%91%EC%9A%A9-iot-%EC%95%B1/id1617043292',
      },
    ],
    volume: '화면 분량 5장 내외',
    scope: ['AOS APK 앱 1식', 'IOS 앱 1식'],
    stack: ['FE: Flutter'],
    duration: ['스토리보드 1주', 'UI/UX 디자인 1주', 'FE/BE 개발 4주'],
  },
  en: {
    projectIntro:
      'An IoT app for controlling camping heaters\nSupports BLE-based temperature and heating time control.',
    leftHeader: {
      line1: 'Bluetooth Heating Control App for Campers',
    },
    features: [['[BLE]', 'Connect and control camping heater devices']],
    screenshots: ['Service Web Page'],
    confirmButtons: [
      {
        title: 'Open iOS App',
        href: 'https://apps.apple.com/pl/app/%EC%97%89%EB%94%B0-%EC%BA%A0%ED%95%91%EC%9A%A9-iot-%EC%95%B1/id1617043292',
      },
    ],
    volume: 'Approx. 5 screens',
    scope: ['AOS APK app', 'iOS app'],
    stack: ['FE: Flutter'],
    duration: ['Storyboard: 1 week', 'UI/UX Design: 1 week', 'FE/BE Development: 4 weeks'],
  },
};

export const IotPopup = () => {
  const { lang } = useLang();
  const t = TEXT[lang];

  return (
    <ProjectPopupContent
      imageUrl="/assets/portpolio_popup/iot.png"
      projectIntro={<CustomPopupText>{t.projectIntro}</CustomPopupText>}
      leftHeader={
        <div style={{ position: 'absolute', top: '210px', left: '70px' }}>
          <div style={{ fontSize: '18px', fontWeight: 600, color: '#CBC5EB', marginBottom: '8px' }}>
            {t.leftHeader.line1}
          </div>
        </div>
      }
      featureList={
        <>
          {t.features.map(([label, desc], i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#3f4347',
                  lineHeight: '24px',
                }}
              >
                {label}
              </div>
              <div
                style={{
                  fontWeight: 400,
                  color: '#3f4347',
                  whiteSpace: 'pre-line',
                  lineHeight: '24px',
                }}
              >
                {desc}
              </div>
            </div>
          ))}
        </>
      }
      projectScreenshots={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {t.screenshots.map((title, i) => (
            <div key={i}>
              <h4 style={{ fontWeight: 700, fontSize: 16, color: '#3f4347' }}>{title}</h4>
              <img src={`/assets/portpolio_popup/iot_${i + 1}.png`} alt={title} style={{ width: '100%' }} />
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
              gradient="linear-gradient(to bottom, #485DA6, #6D5977)"
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
