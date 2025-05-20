"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useLang } from "@/contexts/LangContext";
import { dictionary } from "@/lib/i18n/lang";
import { downloadLinks } from "@/lib/i18n/downloadLinks";
import ResponsiveView from "@/layout/ResponsiveView";
import DesignWeb from "@/block/DesignWeb";
import DesignMobile from "@/block/DesignMobile";
import LandingAppBar from "@/components/LandingAppBar";
import LandingBaseWrapper from "@/layout/LandingBaseWrapper";

import HeaderBlock from "@/block/HeaderBlock";
import FirstMapBlock from "@/block/FirstMapBlock";
import Partner from "@/block/Partner";
import Rolling from "@/block/Rolling";
import SecondMapBlock from "@/block/SecondMapBlock";
import { CommunityBlock } from "@/block/CommunityBlock";
import { PortfolioGrid } from "@/block/PortfolioGrid";
import { MembersTabSection } from "@/block/MembersTabSection";
import { VideoGrid } from "@/block/VideoGrid";
import { ContactSection } from "@/components/Landing/ContactSection";
import { Footer } from "@/block/Footer";

import { AppColors } from "@/styles/colors";
import AppBlock from "@/block/AppBlock";
import DesignBlock from "@/block/Design";
import Consulting from "@/block/Consulting";
import { v4 as uuidv4 } from "uuid";
import { userStamp } from "@/lib/api/user/api";
import { AIBlock } from "@/block/AIBlock";
import EventBlock from "@/block/EventBlock";
import Container3D from "@/block/Container3D";

const getOrCreateLogId = () => {
  const logIdKey = "logId";
  const logId = localStorage.getItem(logIdKey);
  if (logId) return logId;
  const newLogId = uuidv4();
  localStorage.setItem(logIdKey, newLogId);
  return newLogId;
};

const sectionMap: Record<string, { content: string; memo: string }> = {
  header: { content: "Header", memo: "header" },
  // partner: { content: "Partner", memo: "anti_drone" },
  // "partner-sensor": { content: "Partner", memo: "partner" },
  consulting: { content: "Consulting", memo: "consulting" },
  // design: { content: "Design", memo: "design" },
  // "design-sensor": { content: "Design", memo: "design" },
  appblock: { content: "AppBlock", memo: "appblock" },
  community: { content: "Community", memo: "community" },
  portfolio: { content: "Portfolio", memo: "portfolio" },
  members: { content: "Members", memo: "members" },
  video: { content: "Video", memo: "video" },
  ai: { content: "AI", memo: "ai" },
  contact: { content: "Contact", memo: "contact" },
};

const logSectionView = async (content: string, memo: string, firstYn?: boolean) => {
  try {
    const res = await userStamp({
      uuid: getOrCreateLogId(),
      category: "스크롤",
      content,
      memo,
      ...(firstYn ? { firstYn: "Y" } : {}), 
    });
  } catch (e) {
  }
};


const logButtonClick = async (content: string, memo: string) => {
  try {
    const res = await userStamp({
      uuid: getOrCreateLogId(),
      category: "버튼",
      content,
      memo,
    });
  } catch (e) {
  }
};

export default function HomePage() {
  const { lang } = useLang();
  const t = dictionary[lang];
  const pathname = usePathname();
  const [currentSection, setCurrentSection] = useState(t.nav[0]);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const isAutoScrollingRef = useRef(false);

  const startAutoScroll = () => {
    setIsAutoScrolling(true);
    isAutoScrollingRef.current = true;
  };

  const endAutoScroll = () => {
    setIsAutoScrolling(false);
    isAutoScrollingRef.current = false;
  };

  const aliasMap: Record<string, string> = {
    about: "header",
    portfolio: "portfolio",
    contact: "contact",
    service: "community",
    market: "market",
    estimate: "ai",  
    promotion: "event",
  };

  useEffect(() => {
    const path = typeof window !== "undefined" ? window.location.pathname.split("/")[1] : "";
    const targetId = aliasMap[path];
    if (targetId) {
      startAutoScroll();
      const el = document.getElementById(targetId);
      if (el) {
        requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
      let scrollTimer: ReturnType<typeof setTimeout>;
      const handleScroll = () => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          endAutoScroll();
        }, 300);
      };
      window.addEventListener("scroll", handleScroll);
      return () => {
        clearTimeout(scrollTimer);
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  const scrollToTargetId = (targetId: string, content: string, memo: string) => {
    // 🔹 AI Estimate일 때는 스크롤 대신 새 창 열기
    if (targetId === "AI Estimate") {
      window.open("/ai", "_blank", "noopener,noreferrer");
      void logButtonClick(content, memo); // ✅ 스탬프는 동일하게 찍음
      return;
    }
  
    const element = document.getElementById(targetId);
    if (element) {
      startAutoScroll();
      element.scrollIntoView({ behavior: "smooth", block: "start" });
  
      let scrollTimer: ReturnType<typeof setTimeout>;
      const handleScroll = () => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          endAutoScroll();
          window.removeEventListener("scroll", handleScroll);
        }, 300);
      };
      window.addEventListener("scroll", handleScroll);
  
      void logButtonClick(content, memo);
    }
  };
  
  

  const firstHeaderLogged = useRef(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let lastLoggedId = "";
  
    const headerObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isAutoScrollingRef.current) {
          setCurrentSection("Header");
  
          if (!firstHeaderLogged.current) {
            firstHeaderLogged.current = true;
            logSectionView("Header", "header", true); // 👈 firstYn: true 전달
          } else {
            logSectionView("Header", "header");
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
          const isScrollingDown = currentScrollY > lastScrollY;
          lastScrollY = currentScrollY;
  
          if (
            id !== "header" &&
            isVisible &&
            isScrollingDown &&
            id !== lastLoggedId &&
            !isAutoScrollingRef.current
          ) {
            lastLoggedId = id;
            const section = sectionMap[id];
            if (section) {
              setCurrentSection(section.content);
              logSectionView(section.content, section.memo);
            }
          }
        });
      },
      { threshold: 0.3 }
    );
  
    const headerEl = document.getElementById("header");
    if (headerEl) headerObserver.observe(headerEl);
  
    const otherEls = Object.keys(sectionMap)
      .filter((id) => id !== "header")
      .map((id) => document.getElementById(id))
      .filter(Boolean);
  
    otherEls.forEach((el) => generalObserver.observe(el!));
  
    return () => {
      if (headerEl) headerObserver.unobserve(headerEl);
      otherEls.forEach((el) => generalObserver.unobserve(el!));
    };
  }, [t]);
  ;

  const appBar = (
    <LandingAppBar
      logoSrc="/assets/logo.svg"
      logoWidth="169px"
      logoHeight="64px"
      isShowLanguageSwitcher={true}
      navLinks={[
        { label: t.nav[0], targetId: "partner", content: "appbar", memo: "partner" },
        { label: t.nav[1], targetId: "portfolio", content: "appbar", memo: "portfolio" },
        { label: t.nav[2], targetId: "members", content: "appbar", memo: "members" },
        { label: t.nav[3], targetId: "AI Estimate", content: "appbar", memo: "ai" },
        { label: t.nav[4], targetId: "event", content: "appbar", memo: "event" },
      ]}
      onNavigate={scrollToTargetId}
    />
  );

  const sections = [
    {
      id: "header",
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
    //     <Container3D
    //     />
    //   ),
    // },
    {
      id: "firstMap",
      $backgroundColor: AppColors.background,
      content: <FirstMapBlock label={t.firstMap.label} />,
      $zIndex: 1001,
      $isOverLayout: true,
    },
    {
      id: "partner",
      $backgroundColor: AppColors.surface,
      content: (
        <>
          {/* <div id="partner-sensor" style={{ height: "1px" }} /> */}
          <Partner
            title1={t.partner.title1}
            title2={t.partner.title2}
            subtitle={t.partner.subtitle}
            tabs={t.partner.tabs}
            slides={t.partner.slides}
            downloadText={t.partner.downloadText}
            onEnterSection={(index, tab) => {
              setCurrentSection("Partner");
              if (isAutoScrollingRef.current) return;
              void logSectionView("Partner", `스크롤: ${tab}`);
            }}
          />
        </>
      ),
      $zIndex: 1001,
    },
    {
      id: "rolling",
      $backgroundColor: AppColors.background,
      content: <Rolling />,
      $zIndex: 1001,
      $isOverLayout: true,
    },
    {
      id: "consulting",
      $backgroundColor: AppColors.surface,
      content: (
        <Consulting
          title={t.consulting.title}
          descriptions={t.consulting.descriptions}
          downloadText={t.consulting.downloadText}
          gridHeaders={t.consulting.gridHeaders}
          gridContents={t.consulting.gridContents}
        />
      ),
      $zIndex: 1001,
    },
    {
      id: "design",
      $backgroundColor: AppColors.background,
      content: (
        <>
          <div id="design-sensor" style={{ height: "1px" }} />
          <DesignBlock
            title={t.design.title}
            tabs={t.design.tabs}
            tabNumbers={t.design.tabNumbers}
            slides={t.design.slides}
            downloadText={t.design.downloadText}
            onEnterSection={(index, tab) => {
              setCurrentSection("Design");
              if (isAutoScrollingRef.current) return;
              void logSectionView("Design", `스크롤: ${tab}`);
            }}
          />
        </>
      ),
    },
    {
      id: "secondMap",
      $backgroundColor: AppColors.background,
      content: <SecondMapBlock label={t.secondMap.label} />,
      $zIndex: 1001,
      $isOverLayout: true,
    },
    {
      id: "appblock",
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
      id: "community",
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
            window.open("https://open.kakao.com/o/g0u3dOrc", "_blank");
          }}
          onTopArrowClick={() => scrollToTargetId("header", "community", "header")}
          onBottomArrowClick={() => scrollToTargetId("portfolio", "community", "portfolio")}
        />
      ),
    },
    {
      id: "portfolio",
      showFloatingBox: true,
      $backgroundColor: AppColors.background,
      content: (
        <PortfolioGrid
          title={t.portfolio.title}
          description={t.portfolio.description}
          topLabel={t.customNavigator.community}
          centerLabel={t.customNavigator.portpolio}
          bottomLabel={t.customNavigator.member}
          onTopArrowClick={() => scrollToTargetId("community", "portfolio", "community")}
          onBottomArrowClick={() => scrollToTargetId("members", "portfolio", "members")}
        />
      ),
    },
    {
      id: "members",
      showFloatingBox: true,
      $backgroundColor: AppColors.background,
      content: (
        <MembersTabSection
          title={t.membersSection.title}
          description={t.membersSection.description}
          memberCards={t.memberCards}
          topLabel={t.customNavigator.portpolio}
          centerLabel={t.customNavigator.member}
          bottomLabel={t.customNavigator.review}
          onTopArrowClick={() => scrollToTargetId("portfolio", "members", "portfolio")}
          onBottomArrowClick={() => scrollToTargetId("video", "members", "video")}
        />
      ),
    },
    {
      id: "video",
      $backgroundColor: AppColors.background,
      showFloatingBox: true,
       
      content: (
        <VideoGrid
          topLabel={t.customNavigator.member}
          centerLabel={t.customNavigator.review}
          bottomLabel={t.customNavigator.event}
          title={t.reviewSection.title}
          description={t.reviewSection.description}
          onTopArrowClick={() => scrollToTargetId("members", "video", "members")}
          onBottomArrowClick={() => scrollToTargetId("event", "video", "event")}
        />
      ),
    },
    {
      id: "event",
      $backgroundColor: AppColors.background,
      content: <EventBlock
      slides={t.event.slides}
      buttonTitle={t.event.buttonTitle}
      topLabel={t.customNavigator.review}
      centerLabel={t.customNavigator.event}
      bottomLabel={t.customNavigator.ai}
      title={''}
      description={''}
      onTopArrowClick={() => scrollToTargetId("video", "event", "video")}
      onBottomArrowClick={() => scrollToTargetId("ai", "event", "ai")}
    />
    ,
    },
    
    {
      id: "ai",
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
          onTopArrowClick={() => scrollToTargetId("event", "ai", "event")}
          onBottomArrowClick={() => scrollToTargetId("contact", "ai", "contact")}
        />
      ),
    },
    
    {
      id: "contact",
      
      $backgroundColor: AppColors.background,
      content: (
        <ContactSection
          topLabel={t.customNavigator.ai}
          centerLabel={t.arrival}
          bottomLabel={t.arrival}
          title={t.contract.title}
          description={t.contract.description}
          onTopArrowClick={() => scrollToTargetId("video", "contact", "video")}
        />
      ),
    },
    {
      id: "footer",
      $backgroundColor: AppColors.background,
      content: <Footer />,
    },
  ];

  return <LandingBaseWrapper sections={sections} appBar={appBar} />;
}
