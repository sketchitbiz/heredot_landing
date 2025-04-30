'use client';

import React from 'react';
import { useLang } from '@/contexts/LangContext';
import { GradientButton } from '@/components/GradientButton';
import { ProjectPopupContent } from '@/customComponents/ProjectPopupContent';

const Text = ({ children }: { children: React.ReactNode }) => (
  <p style={{ fontSize: 16, fontWeight: 400, color: '#454545', margin: 0, marginBottom: 0,lineHeight : '20px', whiteSpace: 'pre-line' }}>
    {children}
  </p>
);


const TEXT = {
  ko: {
    projectIntro:
      '지역내 대형 병원, 급식, 식당 등에서 영양사 또는 소상공인 사장께서 식자재 발주 시 요청일에 배송 해주는 식자재 발주 시스템',
    features: [
      ['[발주]', '제철 상품, 식자재, 공산품 발주 기능'],
      ['[명세서]', '발주 내역을 명세서로 PDF출력 기능'],
      ['[관리자]', '발주된 식자재를 확인 및 배송 체크 기능'],
      ['[매출관리]', '미수관리, 정산관리, 매출관리 기능'],
    ],
    screenshots: ['관리자 화면'],
    confirmButtons: [{ title: '서비스 웹 바로가기', href: 'https://limefood.co.kr/' }],
    volume: '화면 분량 30장 내외',
    scope: ['* 총 2종 웹 구성', '사용자 웹', '관리자 웹'],
    stack: ['FE: JSP', 'BE: java spring boot', 'Server: Cafe24 Cloud', 'OS: Linux', 'DB: PostgreSQL'],
    duration: ['스토리보드 4주', 'UI/UX 디자인 2주', 'FE/BE 개발 12주'],
  },
  en: {
    projectIntro:
      'A food ordering system that delivers ordered ingredients to hospitals, cafeterias, and restaurants on the requested date.',
    features: [
      ['[Order]', 'Ordering of seasonal items, ingredients, and products'],
      ['[Statement]', 'PDF export of order statements'],
      ['[Admin]', 'Check and manage deliveries of ordered items'],
      ['[Sales Management]', 'Unpaid, settlement, and sales management'],
    ],
    screenshots: ['Admin Screen'],
    confirmButtons: [{ title: 'Visit Web Service', href: 'https://limefood.co.kr/' }],
    volume: 'Approx. 30 screens',
    scope: ['* 2 types of web pages', 'User Web', 'Admin Web'],
    stack: ['FE: JSP', 'BE: java spring boot', 'Server: Cafe24 Cloud', 'OS: Linux', 'DB: PostgreSQL'],
    duration: ['Storyboard: 4 weeks', 'UI/UX Design: 2 weeks', 'FE/BE Development: 12 weeks'],
  },
};

export const LimeFoodPopup = () => {
  const { lang } = useLang();
  const t = TEXT[lang];

  return (
    <ProjectPopupContent
      imageUrl="/assets/portpolio_popup/limefood.png"
      projectIntro={<Text>{t.projectIntro}</Text>}
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
          {t.screenshots.map((title, i) => (
            <div key={i}>
              <h4 style={{ fontWeight: 700, fontSize: 16, color: '#3f4347' }}>{title}</h4>
              <img src={`/assets/portpolio_popup/lime_${i + 1}.png`} alt={title} style={{ width: '100%' }} />
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
              gradient="linear-gradient(to bottom, #5EC2A0, #40AD99)"
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
