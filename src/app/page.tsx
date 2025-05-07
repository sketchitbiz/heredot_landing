"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLang } from "@/contexts/LangContext";
import { dictionary } from "@/lib/i18n/lang";
import { downloadLinks } from "@/lib/i18n/downloadLinks";

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

export default function HomePage() {
  const { lang } = useLang();
  const t = dictionary[lang];
  const pathname = usePathname();
  const router = useRouter();

  const [currentSection, setCurrentSection] = useState(t.nav[0]);

  const aliasMap: Record<string, string> = {
    about: "header",
    portfolio: "portfolio",
    contact: "contact",
    service: "community",
    market: "market",
  };

  useEffect(() => {
    const path = typeof window !== "undefined" ? window.location.pathname.split("/")[1] : "";
    const targetId = aliasMap[path];
    if (targetId) {
      setTimeout(() => {
        requestAnimationFrame(() => {
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        });
      }, 100);
    }
  }, []);

  const scrollToTargetId = (targetId: string) => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) {
          const id = visible.target.id;
          switch (id) {
            case "header":
              setCurrentSection(t.nav[0]);
              break;
            case "portfolio":
              setCurrentSection(t.nav[1]);
              break;
            case "members":
              setCurrentSection(t.nav[2]);
              break;
            case "market":
              setCurrentSection(t.customNavigator.event);
              break;
            case "contact":
              setCurrentSection(t.customNavigator.contact);
              break;
            default:
              break;
          }
        }
      },
      { threshold: 0.3 }
    );

    const sectionElements = Object.values(aliasMap)
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    sectionElements.forEach((el) => observer.observe(el!));
    return () => sectionElements.forEach((el) => observer.unobserve(el!));
  }, [t]);

  const appBar = (
    <LandingAppBar
      logoSrc="/assets/logo.svg"
      logoWidth="169px"
      logoHeight="64px"
      navLinks={[
        { label: t.nav[0], targetId: "header" },
        { label: t.nav[1], targetId: "portfolio" },
        { label: t.nav[2], targetId: "members" },
        { label: t.nav[3], targetId: "market" },
      ]}
      isShowLanguageSwitcher={true}
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
        <Partner
          title1={t.partner.title1}
          title2={t.partner.title2}
          subtitle={t.partner.subtitle}
          tabs={t.partner.tabs}
          slides={t.partner.slides}
          downloadText={t.partner.downloadText}
        />
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
        <DesignBlock
          tabs={t.design.tabs}
          tabNumbers={t.design.tabNumbers}
          slides={t.design.slides}
          title={t.design.title}
          downloadText={t.design.downloadText}
        />
      ),
      $zIndex: 1001,
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
          imageUrl="/assets/community.png"
          onButtonClick={() => {
            window.open("https://open.kakao.com/o/g0u3dOrc", "_blank");
          }}
          onTopArrowClick={() => scrollToTargetId("header")}
          onBottomArrowClick={() => scrollToTargetId("portfolio")}
        />
      ),
    },
    {
      id: "portfolio",
      $backgroundColor: AppColors.background,
      content: (
        <PortfolioGrid
          title={t.portfolio.title}
          description={t.portfolio.description}
          topLabel={t.customNavigator.community}
          centerLabel={t.customNavigator.portpolio}
          bottomLabel={t.customNavigator.member}
          onTopArrowClick={() => scrollToTargetId("community")}
          onBottomArrowClick={() => scrollToTargetId("members")}
        />
      ),
    },
    {
      id: "members",
      $backgroundColor: AppColors.background,
      content: (
        <MembersTabSection
          title={t.membersSection.title}
          description={t.membersSection.description}
          memberCards={t.memberCards}
          topLabel={t.customNavigator.portpolio}
          centerLabel={t.customNavigator.member}
          bottomLabel={t.customNavigator.review}
          onTopArrowClick={() => scrollToTargetId("portfolio")}
          onBottomArrowClick={() => scrollToTargetId("video")}
        />
      ),
    },
    {
      id: "video",
      $backgroundColor: AppColors.background,
      content: (
        <VideoGrid
          topLabel={t.customNavigator.member}
          centerLabel={t.customNavigator.review}
          bottomLabel={t.arrival}
          title={t.reviewSection.title}
          description={t.reviewSection.description}
          onTopArrowClick={() => scrollToTargetId("members")}
          onBottomArrowClick={() => scrollToTargetId("contact")}
        />
      ),
    },
    {
      id: "contact",
      $backgroundColor: AppColors.background,
      content: (
        <ContactSection
          topLabel={t.customNavigator.review}
          centerLabel={t.arrival}
          bottomLabel={t.arrival}
          title={t.contract.title}
          description={t.contract.description}
          onTopArrowClick={() => scrollToTargetId("video")}
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
