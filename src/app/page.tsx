"use client";

import { useLang } from "@/contexts/LangContext";
import { dictionary } from "@/lib/i18n/lang";
import LandingAppBar from "@/components/LandingAppBar";
import HeaderBlock from "@/block/HeaderBlock";
import LandingBaseWrapper from "@/layout/LandingBaseWrapper";
import { AppColors } from "@/styles/colors";
import FirstMapBlock from "@/block/FirstMapBlock";
import AppBlock from "@/block/AppBlock";
import Partner from "@/block/Partner";
import SecondMapBlock from "@/block/SecondMapBlock";
import Consulting from "@/block/Consulting";
import Design from "@/block/Design";
import Rolling from "@/block/Rolling";

// --- 추가된 import ---
import styled from "styled-components";
import ScreenWrapper from "@/layout/ScreenWrapper";
import { ContactSection } from "@/components/Landing/ContactSection";
import { PortfolioGrid } from "@/components/block/PortfolioGrid";
import { MembersTabSection } from "@/components/block/MembersTabSection";
import { VideoGrid } from "@/components/block/VideoGrid";
import { ScrollingBannerSection } from "@/components/block/ScrollingBannerSection";
// ---------------------

export default function HomePage() {
  const { lang } = useLang();
  const t = dictionary[lang];

  const sections = [
    {
      backgroundColor: AppColors.background,
      content: (
        <LandingAppBar
          logoSrc="/assets/logo.svg"
          logoWidth="169px"
          logoHeight="64px"
          navLinks={t.nav.map((label) => ({
            label,
            onClick: () => {}, // TODO
          }))}
          isShowLanguageSwitcher={true}
        />
      ),
    },
    {
      $backgroundColor: AppColors.background,
      content: <HeaderBlock title={t.headerTitle} subtitle={t.headerSubtitle} downloadLabel={t.download} />,
    },
    {
      $backgroundColor: AppColors.background,
      content: <FirstMapBlock />,
      $zIndex: 1,
      $isOverLayout: true,
    },
    {
      $backgroundColor: AppColors.surface,
      content: <Partner />,
      $zIndex: 10,
    },
    {
      $backgroundColor: AppColors.error,
      content: <Rolling />,
      $zIndex: 10,
      $isOverLayout: true,
    },
    {
      $backgroundColor: AppColors.surface,
      content: <Consulting />,
      $zIndex: 20,
    },
    {
      $backgroundColor: AppColors.background,
      content: <Design />,
      $zIndex: 10,
    },
    {
      $backgroundColor: AppColors.background,
      content: <SecondMapBlock />,
      $zIndex: 20,
      $isOverLayout: true,
    },
    {
      $backgroundColor: AppColors.surface,
      content: <AppBlock />,
      $zIndex: 10,
    },
    {
      $backgroundColor: AppColors.background,
      content: <PortfolioGrid />,
      $zIndex: 10,
    },
    {
      $backgroundColor: AppColors.background,
      content: <MembersTabSection />,
      $zIndex: 10,
    },
    {
      $backgroundColor: AppColors.background,
      content: <VideoGrid />,
      $zIndex: 10,
    },
    {
      $backgroundColor: AppColors.background,
      content: <ScrollingBannerSection />,
      $zIndex: 10,
    },
    {
      $backgroundColor: AppColors.surface,
      content: <ContactSection />,
      $zIndex: 10,
    },
  ];

  return (
    <>
      {/* --- 기존 랜딩 페이지 구조 --- */}
      <LandingBaseWrapper sections={sections} />
    </>
  );
}
