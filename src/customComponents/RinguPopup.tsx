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
      '소상공인 사장님 대상 상품 생성 후 결제 링크를 고객에게 전달하여\n매달 상품을 구독 할 수 있는 결제 플랫폼 입니다',
    leftHeader: (
      <>
        <span style={{ color: '#FFFFFF' }}>매달 나가는 비용</span>
        <br />
        <span style={{ color: '#FFFFFF' }}>을 간편하게!</span>
      </>
    ),
    features: [
      ['[PG연계]', '신용카드 등록 후 매달 지정일 결제'],
      ['[Native]', 'DeepLink, Gallery, GPS, Push 활용'],
      ['[알림 서비스]', '문자(SMS): 회원가입 전화번호 인증 문자 발송\nPG심사요청: 관리자 문자 발송\n알림톡: 구독 결제 안내\n메일: 결제 영수증 안내'],
      ['[PC/Mobile]', 'PC에서도 모바일 화면 형태 UI/UX 형태로 웹 서비스 진행'],
    ],
    screenshots: ['📱 모바일 화면', '💻 PC 화면', '⚙️ CMS(관리자) 페이지'],
    confirmButtons: [
      { title: '서비스 웹 바로가기', href: 'https://xn--2e0bw7u.com/' },
      {
        title: '사장님 AOS 앱 바로가기',
        href: 'https://play.google.com/store/apps/details?id=com.heredot.link9corp',
      },
      { title: '사장님 IOS 앱 바로가기', href: 'https://naver.me/xiqdvNGH' },
    ],
    volume: '화면 분량 15장 내외',
    scope: ['* 총 3종 웹·앱(AOS ·IOS) 구성', '사용자 웹·앱', '사장님 웹·앱', '관리자용 웹'],
    stack: ['FE: Flutter', 'BE: Node.js', 'Server: Cafe24 Cloud', 'OS: Linux', 'DB: PostgreSQL'],
    duration: ['스토리보드 2주', 'UI/UX 디자인 1주', 'FE/BE 개발 8주'],
  },
  en: {
    projectIntro:
      'A subscription payment platform for small business owners\nwhere they can create product links and share them with customers for recurring payments.',
    leftHeader: (
      <>
        <span style={{ color: '#FFFFFF' }}>Recurring payments</span>
        <br />
        <span style={{ color: '#FFFFFF' }}>made simple!</span>
      </>
    ),
    features: [
      ['[PG Integration]', 'Monthly card billing after credit card registration'],
      ['[Native]', 'Uses DeepLink, Gallery, GPS, and Push'],
      ['[Notification Services]', 'SMS: Phone verification\nPG review: Admin alert\nKakaoTalk: Payment reminder\nEmail: Receipt notification'],
      ['[PC/Mobile]', 'Mobile-first UI/UX even on PC browser'],
    ],
    screenshots: ['📱 Mobile Screen', '💻 PC Screen', '⚙️ CMS (Admin) Page'],
    confirmButtons: [
      { title: 'Visit Web Service', href: 'https://xn--2e0bw7u.com/' },
      {
        title: 'Open AOS App',
        href: 'https://play.google.com/store/apps/details?id=com.heredot.link9corp',
      },
      { title: 'Open iOS App', href: 'https://naver.me/xiqdvNGH' },
    ],
    volume: 'Approx. 15 screens',
    scope: ['* 3 types (Web/App AOS · iOS)', 'User Web/App', 'Owner Web/App', 'Admin Web'],
    stack: ['FE: Flutter', 'BE: Node.js', 'Server: Cafe24 Cloud', 'OS: Linux', 'DB: PostgreSQL'],
    duration: ['Storyboard: 2 weeks', 'UI/UX Design: 1 week', 'FE/BE Development: 8 weeks'],
  },
};

export const RinguPopup = () => {
  const { lang } = useLang();
  const t = TEXT[lang];

  return (
    <ProjectPopupContent
      imageUrl="/assets/portpolio_popup/ringu.png"
      projectIntro={<Text>{t.projectIntro}</Text>}
      leftHeader={
        <div
          style={{
            position: 'absolute',
            top: '50px',
            left: '20px',
            fontSize: '32px',
            fontWeight: 700,
            color: '#FFFFFF',
          }}
        >
          {t.leftHeader}
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
              <h4
                style={{
                  fontWeight: 700,
                  fontSize: 16,
                  color: '#3f4347',
                }}
              >
                {title}
              </h4>
              <img
                src={`/assets/portpolio_popup/ringu_${i + 1}.png`}
                alt={title}
                style={{ width: '100%' }}
              />
            </div>
          ))}
          <div>
            <img
              src="/assets/portpolio_popup/ringu_4.png"
              alt="Additional Screenshot"
              style={{ width: '100%' }}
            />
          </div>
        </div>
      }
      pjtConfirm={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {t.confirmButtons.map((btn, i) => (
            <GradientButton
              key={i}
              title={btn.title}
              href={btn.href}
              gradient="linear-gradient(to bottom, #CBD5E2, #A1C0E9)"
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
