'use client';

import useAuthStore from '@/store/authStore';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useLang } from '@/contexts/LangContext';
import { dictionary } from '@/lib/i18n/lang';
import { downloadLinks } from '@/lib/i18n/downloadLinks';
import LandingAppBar from '@/components/LandingAppBar';
import LandingBaseWrapper from '@/layout/LandingBaseWrapper';
import HeaderBlock from '@/block/HeaderBlock';
import FirstMapBlock from '@/block/FirstMapBlock';
import Partner from '@/block/Partner';
import Rolling from '@/block/Rolling';
import SecondMapBlock from '@/block/SecondMapBlock';
import { CommunityBlock } from '@/block/CommunityBlock';
import { PortfolioGrid } from '@/block/PortfolioGrid';
import { MembersTabSection } from '@/block/MembersTabSection';
import { VideoGrid } from '@/block/VideoGrid';
import { ContactSection } from '@/components/Landing/ContactSection';
import { Footer } from '@/block/Footer';
import { AppColors } from '@/styles/colors';
import AppBlock from '@/block/AppBlock';
import DesignBlock from '@/block/Design';
import Consulting from '@/block/Consulting';
import { v4 as uuidv4 } from 'uuid';
import { userStamp } from '@/lib/api/user/api';
import { AIBlock } from '@/block/AIBlock';
import EventBlock from '@/block/EventBlock';
import { devLog } from '@/lib/utils/devLogger';
import { AdBottomModal } from '@/components/AdBottomMadal';
import { AdContent } from '@/contents/AdContent';
import { OverlayPopup } from '@/components/OverlayPopup';
import { ContactContent } from '@/contents/ContactContent';
import { Breakpoints } from '@/constants/layoutConstants';


const sectionMap: Record<
  string,
  { content: string; memo: string; log?: boolean }
> = {
  header: { content: 'Header', memo: '해더' },
  partner: { content: 'Partner', memo: 'anti_drone' },
  firstMap: { content: 'FirstMap', memo: 'firstMap', log: false }, // ✅ 스탬프 제외
  consulting: { content: 'Consulting', memo: '기능명세' },
  appblock: { content: 'AppBlock', memo: '디자인시스템' },
  community: { content: 'Community', memo: '창업커뮤니티' },
  portfolio: { content: 'Portfolio', memo: '포트폴리오' },
  members: { content: 'Members', memo: '팀원소개' },
  video: { content: 'Video', memo: '고객후기' },
  event: { content: 'Event', memo: '기획전' },
  ai: { content: 'AI', memo: 'AI' },
  contact: { content: 'Contact', memo: '연락' },
};

const logSectionView = async (
  content: string,
  memo: string,
  firstYn?: boolean
) => {
  try {
    const res = await userStamp({
      category: '스크롤',
      content,
      memo,
      ...(firstYn ? { firstYn: 'Y' } : {}),
    });
  } catch (e) {}
};

const logButtonClick = async (content: string, memo: string) => {
  try {
    const res = await userStamp({
      category: '버튼',
      content,
      memo,
    });
  } catch (e) {}
};

export default function HomePage() {
  const { lang } = useLang();
  const t = dictionary[lang];
  const pathname = usePathname();
  const [currentSection, setCurrentSection] = useState(t.nav[0]);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const isAutoScrollingRef = useRef(false);

  const [isShowAdModal, setIsShowAdModal] = useState(false);

  const [isShowContactModal, setIsShowContactModal] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const checkMobile = () => {
    setIsMobile(window.innerWidth < Breakpoints.mobile);
  };
  checkMobile();
  window.addEventListener('resize', checkMobile);
  return () => window.removeEventListener('resize', checkMobile);
}, []);

  useEffect(() => {
    setIsShowAdModal(true);
  }, []);

  const startAutoScroll = () => {
    devLog('[AutoScroll] 시작');
    setIsAutoScrolling(true);
    isAutoScrollingRef.current = true;
  };

  const endAutoScroll = () => {
    devLog('[AutoScroll] 종료');
    setIsAutoScrolling(false);
    isAutoScrollingRef.current = false;
  };

  const handleContactClick = () => {
  void logButtonClick('Contact', '문의하기버튼'); // ✅ 로그 먼저
  setIsShowContactModal(true); // ✅ 팝업 열기
};

  const aliasMap: Record<string, string> = {
    about: 'header',
    portfolio: 'portfolio',
    partner: 'partner',
    appblock: 'appblock',
    members: 'members',
    review: 'video',
    design: 'design',
    contact: 'contact',
    community: 'community',
    market: 'market',
    estimate: 'ai',
    promotion: 'event',
  };

  const baseNavLinks = [
  {
    label: t.nav[0],
    targetId: 'portfolio',
    content: 'appbar',
    memo: 'portfolio',
  },
  {
    label: t.nav[1],
    targetId: 'members',
    content: 'appbar',
    memo: 'members',
  },
  {
    label: t.nav[2],
    targetId: 'event',
    content: 'appbar',
    memo: 'event',
  },
  {
    label: t.nav[3],
    targetId: 'AI Estimate',
    content: 'appbar',
    memo: 'AI Estimate',
  },
];

const navLinks = isMobile
  ? [
      ...baseNavLinks,
      {
        label: t.nav[4], // 문의하기
        targetId: 'contact',
        content: 'appbar',
        memo: 'contact',
      },
    ]
  : baseNavLinks;

  useEffect(() => {
    const path =
      typeof window !== 'undefined'
        ? window.location.pathname.split('/')[1]
        : '';
    const targetId = aliasMap[path];
    if (!targetId) return;

    startAutoScroll();

    const maxWait = 3000;
    const start = Date.now();
    let frameId: number;
    let scrollTimeout: NodeJS.Timeout;
  
    const tryScroll = () => {
      const el = document.getElementById(targetId);
      const elapsed = Date.now() - start;

      if (el && el.offsetHeight > 0) {
        const rect = el.getBoundingClientRect();
        const scrollY = window.scrollY + rect.top;
  
        // ✅ AppBar 높이 보정 (예: 80px)
        const scrollOffset = scrollY - 80;
  
        // 직접 스크롤
        window.scrollTo({ top: scrollOffset, behavior: 'smooth' });
  
        // 보정 체크 (애니메이션 후 확인)
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          const rectAfter = el.getBoundingClientRect();
          if (Math.abs(rectAfter.top - 80) < 10) {
            endAutoScroll();
          } else {
            frameId = requestAnimationFrame(tryScroll);
          }
        }, 600); // 스크롤 애니메이션이 대체로 500~600ms
  
        return;
      }

      if (elapsed > maxWait) {
        console.warn('[AutoScroll] Element not found within timeout:', targetId);
        endAutoScroll();
        return;
      }
  
      frameId = requestAnimationFrame(tryScroll);
    };
  
    frameId = requestAnimationFrame(tryScroll);
  
    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(scrollTimeout);
    };
  }, []);
  const scrollToTargetId = (
    targetId: string,
    content: string,
    memo: string
  ) => {
    // 🔹 AI Estimate일 때는 스크롤 대신 새 창 열기
    if (targetId === 'AI Estimate') {
      window.open('/ai', '_blank', 'noopener,noreferrer');
      void logButtonClick(content, memo); // ✅ 스탬프는 동일하게 찍음
      return;
    }

    const element = document.getElementById(targetId);
    if (element) {
      startAutoScroll();
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });

      let scrollTimer: ReturnType<typeof setTimeout>;
      const handleScroll = () => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          endAutoScroll();
          window.removeEventListener('scroll', handleScroll);
        }, 300);
      };
      window.addEventListener('scroll', handleScroll);

      void logButtonClick(content, memo);
    }
  };

  const firstHeaderLogged = useRef(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let lastLoggedId = '';

    const headerObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isAutoScrollingRef.current) {
          setCurrentSection('Header');

          if (!firstHeaderLogged.current) {
            firstHeaderLogged.current = true;
            logSectionView('Header', 'header', true); // 👈 firstYn: true 전달
          } else {
            logSectionView('Header', 'header');
          }
        }
      },
      { threshold: 0 }
    );

    // 👇 일반 섹션용 Observer
    const generalObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          const isVisible = entry.isIntersecting;
          const currentScrollY = window.scrollY;
    
          devLog(`[Observer] id: ${id}, isVisible: ${isVisible}, scrollY: ${currentScrollY}`);
    
          if (id === 'firstMap' && isVisible && !isAutoScrollingRef.current) {
            if (window.location.pathname !== '/') {
              history.replaceState(null, '', '/');
            }
          }
    
          if (id !== 'header' && isVisible && id !== lastLoggedId && !isAutoScrollingRef.current) {
            devLog(`[Observer] Section 진입: ${id}`);
            lastLoggedId = id;

            if (!isAutoScrollingRef.current) {
            const path = Object.entries(aliasMap).find(([, targetId]) => targetId === id)?.[0];
            if (path) {
              const newUrl = `/${path}`;
              if (window.location.pathname !== newUrl) {
                devLog('[Observer] URL 변경:', newUrl);
                history.replaceState(null, '', newUrl);
              }
            }
            }

            const isScrollingDown = currentScrollY > lastScrollY;
            lastScrollY = currentScrollY;

            const section = sectionMap[id];
            if (section) {
              setCurrentSection(section.content);
              if (isScrollingDown && section.log !== false) {
                devLog(`[Observer] 스탬프 전송: ${section.content}`);
                logSectionView(section.content, section.memo);
              }
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    const headerEl = document.getElementById('header');
    if (headerEl) headerObserver.observe(headerEl);

    const otherEls = Object.keys(sectionMap)
      .filter((id) => id !== 'header')
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    otherEls.forEach((el) => generalObserver.observe(el!));

    return () => {
      if (headerEl) headerObserver.unobserve(headerEl);
      otherEls.forEach((el) => generalObserver.unobserve(el!));
    };
  }, [t]);
  const appBar = (
    <LandingAppBar
      onContact={handleContactClick}
      logoSrc="/assets/logo.svg"
      logoWidth="169px"
      logoHeight="64px"
      isShowLanguageSwitcher={true}
      contactText={t.nav[4]}
        navLinks={navLinks} 
      onNavigate={scrollToTargetId}
      onLogoClick={() => scrollToTargetId('partner', 'appbar', 'partner')}
    />
  );

  const sections = [
    {
      id: 'header',
      $backgroundColor: AppColors.background,
      content: (
        <HeaderBlock
          title={t.headerTitle}
          subtitle={t.headerSubtitle}
          downloadLabel={t.download}
          downloadLink={downloadLinks.companyProfile[lang]}
        />
      ),
    },
    // {
    //   id: '3d',
    //   $backgroundColor: AppColors.background,
    //   content: (
    //     <Container3DStackScroll
    //     />
    //   ),
    //   $zIndex: 1001,
    // },
    {
      id: 'firstMap',
      $backgroundColor: AppColors.background,
      content: <FirstMapBlock label={t.firstMap.label} />,
      $zIndex: 1001,
      $isOverLayout: true,
    },
    {
      id: 'partner',
      $backgroundColor: AppColors.surface,
      content: (
        <Partner
          title1={t.partner.title1}
          title2={t.partner.title2}
          subtitle={t.partner.subtitle}
          tabs={t.partner.tabs}
          slides={t.partner.slides}
          downloadText={t.partner.downloadText}
          onEnterSection={(index, tab) => {
            setCurrentSection('Partner');
            if (isAutoScrollingRef.current) return;
            const newUrl = '/partner'; // 또는 원하는 aliasMap key
            if (window.location.pathname !== newUrl) {
              history.replaceState(null, '', newUrl);
            }
            void logSectionView('Partner', `스크롤: ${tab}`);
          }}
        />
      ),
      $zIndex: 1001,
    },
    {
      id: 'rolling',
      $backgroundColor: AppColors.background,
      content: <Rolling />,
      $zIndex: 1001,
      $isOverLayout: true,
    },
    {
      id: 'consulting',
      $backgroundColor: AppColors.surface,
      $zIndex: 1001,
      content: (
        <Consulting
          title={t.consulting.title}
          descriptions={t.consulting.descriptions}
          downloadText={t.consulting.downloadText}
          gridHeaders={t.consulting.gridHeaders}
          gridContents={t.consulting.gridContents}
          onEnterSection={() => {
            setCurrentSection('Consulting');
            if (isAutoScrollingRef.current) return;

            const newUrl = '/consulting';
            if (window.location.pathname !== newUrl) {
              history.replaceState(null, '', newUrl);
            }

            // void logSectionView('Consulting', '기능명세');
          }}
        />
      ),
    },

    {
      id: 'design',
      $backgroundColor: AppColors.background,
      content: (
        <>
          <div id="design-sensor" style={{ height: '1px' }} />
          <DesignBlock
            title={t.design.title}
            tabs={t.design.tabs}
            tabNumbers={t.design.tabNumbers}
            slides={t.design.slides}
            downloadText={t.design.downloadText}
            onEnterSection={(index, tab) => {
              setCurrentSection('Design');
              if (isAutoScrollingRef.current) return;
              const newUrl = '/design';
              if (window.location.pathname !== newUrl) {
                history.replaceState(null, '', newUrl);
              }
              void logSectionView('Design', `스크롤: ${tab}`);
            }}
          />
        </>
      ),
    },
    {
      id: 'secondMap',
      $backgroundColor: AppColors.background,
      content: <SecondMapBlock label={t.secondMap.label} />,
      $zIndex: 1001,
      $isOverLayout: true,
    },
    {
      id: 'appblock',
      $backgroundColor: AppColors.primary,
      content: (
        <AppBlock
          title={t.appBlock.title}
          description={t.appBlock.description}
        />
      ),
      $zIndex: 1001,
    },
    {
      id: 'community',
      showFloatingBox: true,
      $backgroundColor: AppColors.background,
      content: (
        <CommunityBlock
          topLabel={t.departure}
          centerLabel={t.customNavigator.community}
          bottomLabel={t.customNavigator.portpolio}
          title={t.community.title}
          description={t.community.description}
          sectionTitle={t.community.section.title}
          sectionDescription={t.community.section.description}
          buttonText={t.community.section.buttonText}
          imageUrl="/assets/community.webp"
          onButtonClick={() => {
            window.open('https://open.kakao.com/o/g0u3dOrc', '_blank');
          }}
          onTopArrowClick={() =>
            scrollToTargetId('header', 'community', 'header')
          }
          onBottomArrowClick={() =>
            scrollToTargetId('portfolio', 'community', 'portfolio')
          }
        />
      ),
    },
    {
      id: 'portfolio',
      showFloatingBox: true,
      $backgroundColor: AppColors.background,
      content: (
        <PortfolioGrid
          title={t.portfolio.title}
          description={t.portfolio.description}
          topLabel={t.customNavigator.community}
          centerLabel={t.customNavigator.portpolio}
          bottomLabel={t.customNavigator.member}
          onTopArrowClick={() =>
            scrollToTargetId('community', 'portfolio', 'community')
          }
          onBottomArrowClick={() =>
            scrollToTargetId('members', 'portfolio', 'members')
          }
        />
      ),
    },
    {
      id: 'members',
      showFloatingBox: true,
      $backgroundColor: AppColors.background,
      zIndex  : 1001,
      content: (
        <MembersTabSection
          title={t.membersSection.title}
          description={t.membersSection.description}
          memberCards={t.memberCards}
          topLabel={t.customNavigator.portpolio}
          centerLabel={t.customNavigator.member}
          bottomLabel={t.customNavigator.review}
          onTopArrowClick={() =>
            scrollToTargetId('portfolio', 'members', 'portfolio')
          }
          onBottomArrowClick={() =>
            scrollToTargetId('video', 'members', 'video')
          }
        />
      ),
    },
    {
      id: 'video',
      $backgroundColor: AppColors.background,
      showFloatingBox: true,

      content: (
        <VideoGrid
          topLabel={t.customNavigator.member}
          centerLabel={t.customNavigator.review}
          bottomLabel={t.customNavigator.event}
          title={t.reviewSection.title}
          description={t.reviewSection.description}
          onTopArrowClick={() =>
            scrollToTargetId('members', 'video', 'members')
          }
          onBottomArrowClick={() => scrollToTargetId('event', 'video', 'event')}
        />
      ),
    },
    {
      id: 'event',
      $backgroundColor: AppColors.background,
      content: (
        <EventBlock
          slides={t.event.slides}
          buttonTitle={t.event.buttonTitle}
          topLabel={t.customNavigator.review}
          centerLabel={t.customNavigator.event}
          bottomLabel={t.customNavigator.ai}
          title={t.eventBlock.title}
          description={t.eventBlock.description}
          onTopArrowClick={() => scrollToTargetId('video', 'event', 'video')}
          onBottomArrowClick={() => scrollToTargetId('ai', 'event', 'ai')}
        />
      ),
    },

    {
      id: 'ai',
      $backgroundColor: AppColors.background, // 또는 background로도 가능
      content: (
        <AIBlock
          topLabel={t.customNavigator.event}
          centerLabel={t.customNavigator.ai}
          bottomLabel={t.arrival}
          title={t.aiBlock.title}
          description={t.aiBlock.description}
          buttonText={t.aiBlock.buttonTitle}
          buttonLink={t.aiBlock.buttonLink}
          buttonHeader={t.aiBlock.buttonHeader}
          buttonDescription={t.aiBlock.buttonDescription}
          onTopArrowClick={() => scrollToTargetId('event', 'ai', 'event')}
          onBottomArrowClick={() =>
            scrollToTargetId('contact', 'ai', 'contact')
          }
        />
      ),
    },

    {
      id: 'contact',

      $backgroundColor: AppColors.background,
      content: (
        <ContactSection
          topLabel={t.customNavigator.ai}
          centerLabel={t.arrival}
          bottomLabel={t.arrival}
          title={t.contract.title}
          description={t.contract.description}
          onTopArrowClick={() => scrollToTargetId('ai', 'contact', 'ai')}
          onProjectInquiryClick={handleContactClick}
        />
      ),
    },
    {
      id: 'footer',
      $backgroundColor: AppColors.background,
      content: <Footer />,
    },
  ];


  return (
    <>
      {/* 광고 모달 삽입 */}
<OverlayPopup
  isOpen={isShowAdModal}
  onClose={() => setIsShowAdModal(false)}
>
  <AdContent buttonText={t.aiBlock.buttonTitle} />
</OverlayPopup>

<OverlayPopup
  isOpen={isShowContactModal}
  onClose={() => setIsShowContactModal(false)}
>
<ContactContent onClose={() => setIsShowContactModal(false)} />
</OverlayPopup>




      <LandingBaseWrapper sections={sections} appBar={appBar} />
    </>
  );
}
