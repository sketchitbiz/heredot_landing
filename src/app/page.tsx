"use client";

import React, { useEffect, useState } from "react";
import { useLang } from "@/contexts/LangContext";
import { dictionary } from "@/lib/i18n/lang";
import LandingAppBar from "@/components/LandingAppBar";
import LandingBaseWrapper from "@/layout/LandingBaseWrapper";

import HeaderBlock from "@/block/HeaderBlock";
import FirstMapBlock from "@/block/FirstMapBlock";
import Partner from "@/block/Partner";
import Rolling from "@/block/Rolling";
import Consulting from "@/block/Consulting";
import Design from "@/block/Design";
import SecondMapBlock from "@/block/SecondMapBlock";
import AppBlock from "@/block/AppBlock";
import { PortfolioGrid } from "@/block/PortfolioGrid";
import { MembersTabSection } from "@/block/MembersTabSection";
import { VideoGrid } from "@/block/VideoGrid";
import { ScrollingBannerSection } from "@/block/ScrollingBannerSection";
import { ContactSection } from "@/components/Landing/ContactSection";
import { Footer } from "@/block/Footer";
import { AppColors } from "@/styles/colors";
import { CustomNavigator } from "@/customComponents/CustomNavigator";
import { downloadLinks } from "@/lib/i18n/downloadLinks";

export default function HomePage() {
  const { lang } = useLang();
  const t = dictionary[lang];

  const [currentSection, setCurrentSection] = useState(t.nav[0]); // 초기값: 핵심강점

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) {
          const id = visible.target.id;
          switch (id) {
            case "firstMap":
            case "secondMap":
              setCurrentSection(t.nav[0]); // 핵심강점
              break;
            case "portfolio":
              setCurrentSection(t.nav[1]); // 포트폴리오
              break;
            case "members":
              setCurrentSection(t.nav[2]); // 팀원소개
              break;
            case "video":
              setCurrentSection(t.customNavigator.review); // 고객후기
              break;
            case "market":
              setCurrentSection(t.customNavigator.event); // 기획전
              break;
            case "contact":
              setCurrentSection(t.customNavigator.contact); // 연락
              break;
            default:
              break;
          }
        }
      },
      { threshold: 0.3 }
    );

    const sectionElements = ["firstMap", "secondMap", "portfolio", "members", "video", "market", "contact"]
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    sectionElements.forEach((el) => observer.observe(el!));

    return () => {
      sectionElements.forEach((el) => observer.unobserve(el!));
    };
  }, [t]);

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
      $zIndex: 1000,
    },
    {
      id: "firstMap",
      $backgroundColor: AppColors.background,
      content: <FirstMapBlock label={t.firstMap.label} />,
      $zIndex: 1,
      $isOverLayout: true,
    },
    {
      id: "partner",
      $backgroundColor: AppColors.surface,
      content: (
        <Partner
          title1={t.partner.title1}
          title2={t.partner.title2}
          subtitle={t.partner.subtitle}
          tabs={t.partner.tabs}
          slides={t.partner.slides}
          downloadText={t.partner.downloadText}
        />
      ),
      $zIndex: 1100,
    },
    {
      id: "rolling",
      $backgroundColor: AppColors.background,
      content: <Rolling />,
      $zIndex: 1100,
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
      $zIndex: 1100,
    },
    {
      id: "design",
      $backgroundColor: AppColors.background,
      content: (
        <Design
          tabs={t.design.tabs}
          tabNumbers={t.design.tabNumbers}
          slides={t.design.slides}
          title={t.design.title}
          downloadText={t.design.downloadText}
        />
      ),
      $zIndex: 1100,
    },
    {
      id: "secondMap",
      $backgroundColor: AppColors.background,
      content: <SecondMapBlock label={t.secondMap.label} />,
      $zIndex: 20,
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
      $zIndex: 1100,
    },
    {
      id: "portfolio",
      $backgroundColor: AppColors.background,
      content: (
        <PortfolioGrid
          title={t.portfolio.title}
          description={t.portfolio.description}
          topLabel={t.departure}
          centerLabel={t.nav[1]} // 포트폴리오
          bottomLabel={t.arrival}
        />
      ),
      $zIndex: 1110,
    },

    {
      id: "members",
      $backgroundColor: AppColors.background,
      content: (
        <MembersTabSection
          title={t.membersSection.title}
          description={t.membersSection.description}
          // tabItems={t.memberTabs}
          memberCards={t.memberCards}
          topLabel={t.departure}
          centerLabel={t.nav[2]} // 포트폴리오
          bottomLabel={t.arrival}
        />
      ),
      $zIndex: 10,
    },

    {
      id: "video",
      $backgroundColor: AppColors.background,
      content: (
        <VideoGrid
          topLabel={t.departure}
          centerLabel={t.customNavigator.review}
          bottomLabel={t.arrival}
          title={t.reviewSection.title}
          description={t.reviewSection.description}
        />
      ),
      $zIndex: 10,
    },
    
    // {
    //   id: 'market',
    //   $backgroundColor: AppColors.background,
    //   content: (
    //     <ScrollingBannerSection
    //     title={t.bannerSection.title}
    //     description={t.bannerSection.description}
    //     topLabel={t.departure}
    //     centerLabel={t.customNavigator.event}
    //     bottomLabel={t.arrival}
    //   />
      
    //   ),
    //   $zIndex: 10,
    // },
    
    {
      id: "contact",
      $backgroundColor: AppColors.background,
      content: <ContactSection
      topLabel={t.departure}
      centerLabel={t.customNavigator.contact}
      bottomLabel={t.arrival}
      title={t.contract.title}
      description={t.contract.description}
      />,
      $zIndex: 10,
    },
    {
      id: "footer",
      $backgroundColor: AppColors.background,
      content: <Footer />,
      $zIndex: 10,
    },
  ];

  return (
    <>
      {/* 🔥 LandingAppBar pinned */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1050,
        }}>
        <LandingAppBar
          logoSrc="/assets/logo.svg"
          logoWidth="169px"
          logoHeight="64px"
          navLinks={[
            { label: t.nav[0], targetId: "partner" },
            { label: t.nav[1], targetId: "portfolio" },
            { label: t.nav[2], targetId: "members" },
            { label: t.nav[3], targetId: "market" },
          ]}
          isShowLanguageSwitcher={true}
        />
      </div>

      {/* 🔥 Sections */}
      <LandingBaseWrapper sections={sections} />
    </>
  );
}
