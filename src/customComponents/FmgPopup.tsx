'use client';

import React from 'react';
import { useLang } from '@/contexts/LangContext';
import { ProjectPopupContent } from '@/customComponents/ProjectPopupContent';
import { GradientButton } from '@/components/GradientButton';
import { CustomPopupText } from './CustomPopupText';


const TEXT = {
  ko: {
    projectIntro:
      'FMG는 Find Me a Golf sponsor 약어로\n스크린골프 / 필드에서 홀인원 시 최대 1천만원을 지급하는 골프 스폰서십 플랫폼 입니다.',
    leftHeader: {
      line1: '부담없이 홀인원이 기다려지는',
      line2: '스크린 한 게임 가격의 멤버십',
    },
    features: [
      ['[상품운영]', '구독형 스폰서십 상품 운영'],
      ['[PG연계]', '신용카드 등록 후 매달 지정일 결제'],
      ['[PC/Mobile]', 'PC에서도 모바일 화면 형태 UI/UX 형태로 웹 서비스 진행'],
    ],
    screenshots: ['📱모바일 화면', '관리자 화면'],
    confirmButtons: [
      { title: '서비스 웹 바로가기', href: 'https://xn--bb0bq9znnr.com/' },
      { title: 'AOS 앱 바로가기', href: 'https://play.google.com/store/apps/details?id=com.hclub.fmgs&hl=ko' },
      { title: 'IOS 앱 바로가기', href: 'https://apps.apple.com/kr/app/%ED%8C%8C%EB%AF%B8%EA%B3%A8-%EB%82%98%EB%A7%8C%EC%9D%98-%EA%B3%A8%ED%94%84-%EC%8A%A4%ED%8F%B0%EC%84%9C/id6508168269' },
    ],
    volume: '화면 분량 35장 내외',
    scope: ['총 2종 웹·앱(AOS ·IOS) 구성', '사용자 웹·앱', '관리자용 웹'],
    stack: ['FE: Flutter', 'BE: Node.js', 'Server: Cafe24 Cloud', 'OS: Linux', 'DB: PostgreSQL'],
    duration: ['스토리보드 2주', 'UI/UX 디자인 1주', 'FE/BE 개발 8주'],
  },
  en: {
    projectIntro:
      'FMG stands for "Find Me a Golf sponsor".\nIt is a golf sponsorship platform that offers up to 10 million KRW when a hole-in-one is achieved in screen golf or on the field.',
    leftHeader: {
      line1: 'Enjoy the thrill of a hole-in-one, worry-free',
      line2: 'Membership at the price of one round of screen golf',
    },
    features: [
      ['[Product Model]', 'Subscription-based sponsorship product model'],
      ['[PG Integration]', 'Monthly billing after credit card registration'],
      ['[PC/Mobile]', 'Mobile-first UI/UX provided even in PC web version'],
    ],
    screenshots: ['📱Mobile Screen', 'Admin Screen'],
    confirmButtons: [
      { title: 'Visit Web Service', href: 'https://xn--bb0bq9znnr.com/' },
      { title: 'Open AOS App', href: 'https://play.google.com/store/apps/details?id=com.hclub.fmgs&hl=ko' },
      { title: 'Open iOS App', href: 'https://apps.apple.com/kr/app/%ED%8C%8C%EB%AF%B8%EA%B3%A8-%EB%82%98%EB%A7%8C%EC%9D%98-%EA%B3%A8%ED%94%84-%EC%8A%A4%ED%8F%B0%EC%84%9C/id6508168269' },
    ],
    volume: 'Approx. 35 screens',
    scope: ['2 platforms (Web/App for AOS · iOS)', 'User Web/App', 'Admin Web'],
    stack: ['FE: Flutter', 'BE: Node.js', 'Server: Cafe24 Cloud', 'OS: Linux', 'DB: PostgreSQL'],
    duration: ['Storyboard: 2 weeks', 'UI/UX Design: 1 week', 'FE/BE Development: 8 weeks'],
  },
};

export const FmgPopup = () => {
  const { lang } = useLang();
  const t = TEXT[lang];

  return (
    <ProjectPopupContent
      imageUrl="/assets/portpolio_popup/fmg.png"
      projectIntro={<CustomPopupText>{t.projectIntro}</CustomPopupText>}
      leftHeader={
        <div style={{ position: 'absolute', top: '50px', left: '20px' }}>
          <div style={{ fontSize: '18px', fontWeight: 600, color: '#7d7d7d', marginBottom: '8px' }}>
            {t.leftHeader.line1}
          </div>
          <div style={{ fontSize: '30px', fontWeight: 700, color: '#463F40' }}>
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
              <img
                src={`/assets/portpolio_popup/fmg_${i + 1}.png`}
                alt={title}
                style={{ width: '100%' }}
              />
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
              gradient="linear-gradient(to bottom, #CFFFE4, #ABE8C6)"
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
