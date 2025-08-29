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
      '사용자가 중고 명품 판매를 요청하면, 딜러들이 매입가를 제시하고,\n그중 가장 높은 가격을 제시한 딜러에게 판매가 이루어지는 역경매 플랫폼입니다.',
    leftHeader: {
      top: '제시 받은 가격 중, 최고가에 거래하세요',
      bottom: '명품역경매',
    },
    features: [
      ['[알림톡]', '사용자와 명품 매입 딜러간 절차 진행 시 내용 인지'],
      ['[로그인]', '웹 프로젝트로 매번 로그인의 불편을 간소화 하기 위하여 2주마다 재로그인 정책화'],
      ['[Process 간소화]', '판매자(User) <> 구매자(Dealer)간 역경매 절차 구현'],
      ['[PG 연계]', '딜러가 매입 시 플랫폼 수수료 결제'],
    ],
    screenshots: ['📱모바일 화면'],
    confirmButtons: [{ title: '서비스 웹 바로가기', href: 'https://rebling.kr/pr' }],
    volume: '화면 분량 25장 내외',
    scope: ['* 총 3종 웹 구성', '구매자 웹', '판매자 웹', '관리자 웹'],
    stack: ['FE: React.js', 'BE: Node.js', 'Server: Cafe24 Cloud', 'OS: Linux', 'DB: PostgreSQL'],
    duration: ['스토리보드 2.5주', 'UI/UX 디자인 1.5주', 'FE/BE 개발 12주'],
  },
  en: {
    projectIntro:
      'A reverse auction platform for secondhand luxury goods where sellers receive offers from dealers, and the highest bidder wins the sale.',
    leftHeader: {
      top: 'Sell at the highest price offered',
      bottom: 'Luxury Reverse Auction',
    },
    features: [
      ['[Notification]', 'Keeps both seller and buyer updated throughout the process'],
      ['[Login]', 'Reduces login inconvenience by enforcing re-login every 2 weeks'],
      ['[Process Simplification]', 'Streamlined bidding between seller (User) and buyer (Dealer)'],
      ['[PG Integration]', 'Payment of platform fee when a dealer purchases an item'],
    ],
    screenshots: ['📱Mobile Screen'],
    confirmButtons: [{ title: 'Visit Web Service', href: 'https://rebling.kr/pr' }],
    volume: 'Approx. 25 screens',
    scope: ['* 3 types of web platforms', 'Buyer Web', 'Seller Web', 'Admin Web'],
    stack: ['FE: React.js', 'BE: Node.js', 'Server: Cafe24 Cloud', 'OS: Linux', 'DB: PostgreSQL'],
    duration: ['Storyboard: 2.5 weeks', 'UI/UX Design: 1.5 weeks', 'FE/BE Development: 12 weeks'],
  },
};

export const ReBlingPopup = () => {
  const { lang } = useLang();
  const t = TEXT[lang];

  return (
    <ProjectPopupContent
      imageUrl="/assets/portpolio_popup/re-bling.webp"
      projectIntro={<CustomPopupText>{t.projectIntro}</CustomPopupText>}
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
              <img
                src={`/assets/portpolio_popup/rebling_${i + 1}.webp`}
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
  gradient="linear-gradient(to bottom, #e6dcc9, #ddc180)"
  onClick={() => {
    void userStamp({
      category: "버튼",
      content: "명품역경매",
      memo: `외부 링크: ${btn.title}`,
    });
    window.open(btn.href, "_blank", "noopener noreferrer");
  }}
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
