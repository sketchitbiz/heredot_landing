'use client';

import { useLang } from '@/contexts/LangContext';
import { dictionary } from '@/lib/i18n/lang';
import LandingAppBar from '@/components/LandingAppBar';
import HeaderBlock from '@/block/HeaderBlock';
import LandingBaseWrapper from '@/layout/LandingBaseWrapper';
import { AppColors } from '@/styles/colors';
import FirstMapBlock from '@/block/FirstMapBlock';
import AppBlock from '@/block/AppBlock';
import Partner from '@/block/Partner';
import { zhCN } from '@mui/material/locale';
import SecondMapBlock from '@/block/SecondMapBlock';
import Consulting from '@/block/Consulting';
import Design from '@/block/Design';
import Rolling from '@/block/Rolling';

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
      content: (
        <HeaderBlock
          title={t.headerTitle}
          subtitle={t.headerSubtitle}
          downloadLabel={t.download}
        />
      ),
    },
    {
      $backgroundColor: AppColors.background,
      content: <FirstMapBlock />, // ✅ 여기 추가
      $zIndex: 1, // ✅ z-index를 0으로 설정
      $isOverLayout: true,
    },

    {
      $backgroundColor: AppColors.surface,
      content: <Partner />, // ✅ 여기 추가
      $zIndex: 10, // ✅ z-index를 1로 설정
    },
    {
      $backgroundColor: AppColors.error,
      content: <Rolling />, // ✅ 여기 추가
      $zIndex: 10, // ✅ z-index를 1로 설정
      $isOverLayout: true,
    },
    {
      $backgroundColor: AppColors.surface,
      content: <Consulting />, // ✅ 여기 추가
      $zIndex: 20, // ✅ z-index를 1로 설정
    },

    {
      $backgroundColor: AppColors.background,
      content: <Design />,
      $zIndex: 10, // ✅ z-index를 1로 설정
    },
    {
      $backgroundColor: AppColors.background,
      content: <SecondMapBlock />, // ✅ 여기 추가
      $zIndex: 20, // ✅ z-index를 1로 설정
      $isOverLayout: true,
    },
    {
      $backgroundColor: AppColors.surface,
      content: <AppBlock />,
      $zIndex: 10, // ✅ z-index를 1로 설정
    }
  ];

  return <LandingBaseWrapper sections={sections} />;
}
