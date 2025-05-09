'use client';

import React from 'react';
import { useLang } from '@/contexts/LangContext';
import { GradientButton } from '@/components/GradientButton';
import { ProjectPopupContent } from '@/customComponents/ProjectPopupContent';
import { CustomPopupText } from './CustomPopupText';
import { userStamp } from '@/lib/api/user/api';

const TEXT = {
  ko: {
    projectIntro:
      '창업자들이 자금 조달을 더 쉽고 빠르게 할 수 있도록\n정부지원사업을 기반으로 한 기본형 / 합격형 / 환불형\n상품 컨설팅 서비스를 제공합니다',
    leftHeader: {
      line1: '정부 지원 사업 획득은',
      line2: '로켓업',
      color: '#FA273F',
    },
    features: [
      ['[랜딩]', '서비스 특장 점 및 상품 안내 PR'],
      ['[SMS]', '상품 문의 접수 시 관리자 SMS 수신 기능'],
      ['[크롤링]', '주요 지원사업 1일 단위 자동 수집'],
      ['[크롤링 관제]', '크롤링 수집 상태를 1일 단위 메일링으로 헬스체크 하는 기능'],
    ],
    screenshots: ['사용자 화면', '관리자 화면'],
    confirmButtons: [{ title: '서비스 웹 바로가기', href: 'https://roketup.com' }],
    volume: '화면 분량 10장 내외',
    scope: ['* 총 2종 웹 구성', '사용자 웹', '관리자용 웹'],
    stack: ['FE: Flutter', 'BE: Node.js', 'Server: Cafe24 Cloud', 'OS: Linux', 'DB: PostgreSQL'],
    duration: ['UI/UX 디자인 2주', 'FE/BE 개발 2주'],
  },
  en: {
    projectIntro:
      'A consulting platform that helps startups secure funding faster and easier\nthrough government support programs, offering basic/success/refund-based packages.',
    leftHeader: {
      line1: 'Get government funding with',
      line2: 'RoketUp',
      color: '#FA273F',
    },
    features: [
      ['[Landing]', 'PR for product strengths and service info'],
      ['[SMS]', 'Receive SMS alerts when inquiries are submitted'],
      ['[Crawling]', 'Daily auto-collection of key government support programs'],
      ['[Health Check]', 'Daily mailing to monitor crawling status'],
    ],
    screenshots: ['User Screen', 'Admin Screen'],
    confirmButtons: [{ title: 'Visit Web Service', href: 'https://roketup.com' }],
    volume: 'Approx. 10 screens',
    scope: ['* 2 types of web interfaces', 'User Web', 'Admin Web'],
    stack: ['FE: Flutter', 'BE: Node.js', 'Server: Cafe24 Cloud', 'OS: Linux', 'DB: PostgreSQL'],
    duration: ['UI/UX Design: 2 weeks', 'FE/BE Development: 2 weeks'],
  },
};

export const RocketPopup = () => {
  const { lang } = useLang();
  const t = TEXT[lang];

  return (
    <ProjectPopupContent
      imageUrl="/assets/portpolio_popup/roketup.png"
      projectIntro={<CustomPopupText>{t.projectIntro}</CustomPopupText>}
      leftHeader={
        <div style={{ position: 'absolute', top: '50px', left: '20px' }}>
          <div style={{ fontSize: '18px', fontWeight: 600, color: t.leftHeader.color, marginBottom: '8px' }}>
            {t.leftHeader.line1}
          </div>
          <div style={{ fontSize: '30px', fontWeight: 700, color: t.leftHeader.color }}>
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
              <img src={`/assets/portpolio_popup/roket_${i + 1}.png`} alt={title} style={{ width: '100%' }} />
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
              onClick={() => {
                                              void userStamp({
                                                uuid: localStorage.getItem("logId") ?? "anonymous",
                                                category: "버튼",
                                                content: "로켓업",
                                                memo: `외부 링크: ${btn.title}`,
                                              });
                                              window.open(btn.href, "_blank", "noopener noreferrer");
                                            }}
              titleColor={t.leftHeader.color}
              gradient="linear-gradient(to bottom, #F8F6F6, #E6C4CC)"
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
