'use client';

import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { usePathname, useRouter } from 'next/navigation';
import { AdminAuthProvider, useAdminAuth } from '@/contexts/AdminAuthContext';
import { useDevice } from '@/contexts/DeviceContext';
import ResponsiveSidebar from '@/components/CustomSidebar/ResponsiveSidebar';
import CustomSidebarHeader from '@/components/CustomSidebar/CustomSidebarHeader';
import { THEME_COLORS } from '@/styles/theme_colors';
import { toast, ToastContainer } from 'react-toastify';
import {
  Dashboard as DashboardIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  People as PeopleIcon,
  Dataset as DatasetIcon,
  Settings as SettingsIcon,
  Description as DescriptionIcon,
  Logout as LogoutIcon,
  Assessment as AssessmentIcon,
  TextFields as TextFieldsIcon,
  QuestionAnswer as QuestionAnswerIcon,
  Chat as ChatIcon,
  Business as BusinessIcon,
  Tune as TuneIcon,
  Download as DownloadIcon,
  ContactSupport as ContactSupportIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';
import type { MenuItemConfig } from '@/components/CustomSidebar/CustomSidebar';
import ScrollAwareWrapper from '@/layout/ScrollAwareWrapper';

export default function CmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <ProtectedCmsLayout>{children}</ProtectedCmsLayout>
    </AdminAuthProvider>
  );
}

function ProtectedCmsLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, ready, logout } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();
  const device = useDevice();
  const isLoginPage = pathname === '/cms/login';

  useEffect(() => {
    if (ready && !isLoggedIn && !isLoginPage) {
      router.replace('/cms/login');
    }
  }, [ready, isLoggedIn, isLoginPage]);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  const handleLogout = () => {
    logout();
    router.replace('/cms/login');
    toast.success('로그아웃 되었습니다');
  };

  const effectiveSidebarExpanded = useMemo(
    () => (device === 'mobile' ? isMobileSidebarOpen : !isCollapsed),
    [device, isMobileSidebarOpen, isCollapsed]
  );

  const menuItems: MenuItemConfig[] = [
    { icon: <DashboardIcon />, title: '대시보드', path: '/cms' },
    { icon: <AdminPanelSettingsIcon />, title: '관리자회원관리', path: '/cms/adminMng' },
    { icon: <PeopleIcon />, title: '고객관리', path: '/cms/userMng' },
    {
      icon: <DatasetIcon />,
      title: 'AI 데이터 관리',
      path: '/cms/aiData',
      subMenu: [
        { icon: <AssessmentIcon />, title: '기초조사 관리', path: '/cms/aiData/survey' },
        { icon: <TextFieldsIcon />, title: 'AI 프롬프트 관리', path: '/cms/aiData/prompt' },
        { icon: <QuestionAnswerIcon />, title: 'AI 동문서답 관리', path: '/cms/aiData/wrongAnswer' },
        { icon: <ChatIcon />, title: 'AI 대화이력 관리', path: '/cms/aiData/conversationHistory' },
      ],
    },
    {
      icon: <SettingsIcon />,
      title: 'AI 설정',
      path: '/cms/aiSetting',
      subMenu: [
        { icon: <BusinessIcon />, title: '회사정보 관리', path: '/cms/aiSetting/companyInfo' },
        { icon: <TuneIcon />, title: 'AI 설정관리', path: '/cms/aiSetting/mng' },
      ],
    },
    {
      icon: <StorageIcon />,
      title: '고객 데이터 관리',
      path: '/cms/userData',
      subMenu: [
        { icon: <DownloadIcon />, title: '견적 다운로드 현황', path: '/cms/userData/proposal' },
        { icon: <ContactSupportIcon />, title: '견적 문의 관리', path: '/cms/userData/inquiry' },
      ],
    },
    { icon: <DescriptionIcon />, title: '이용 약관 관리', path: '/cms/terms' },
  ];

  if (!ready || (!isLoggedIn && !isLoginPage)) return null;
  if (isLoginPage) return <>{children}</>;

  return (
    <ScrollAwareWrapper>
    <OuterLayoutContainer $themeMode="light">
      <ToastContainer position="top-center" autoClose={3000} />
      <ResponsiveSidebar
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
        menuItems={menuItems}
        footerIcon={<LogoutIcon />}
        onFooterClick={handleLogout}
        onMobileSidebarOpenChange={setIsMobileSidebarOpen}
      >
        <CustomSidebarHeader
          isCollapsed={isCollapsed}
          iconSrc="/favicon.ico"
          showTime={false}
        />
      </ResponsiveSidebar>
      <MainContent
  $device={device}
  $isSidebarExpanded={effectiveSidebarExpanded}
>
  {children}
</MainContent>
    </OuterLayoutContainer>
    </ScrollAwareWrapper>
  );
}

// --- Styled Components ---

const OuterLayoutContainer = styled.div<{ $themeMode: 'light' | 'dark' }>`
  /* width: 100vw; */
  min-width: 1450px;
  min-height: 100vh;
  /* height: auto; */
  /* overflow-x: auto; */
  background-color: ${({ $themeMode }) =>
    $themeMode === 'light'
      ? THEME_COLORS.light.background
      : THEME_COLORS.dark.background};
`;

const MainContent = styled.div<{
  $device: 'mobile' | 'tablet' | 'desktop';
  $isSidebarExpanded: boolean;
}>`
  transition: all 0.3s ease;
  /* height: 100vh; */
  /* overflow-x: auto;
  overflow-y: auto; */
  min-width: 1200px;
  box-sizing: border-box;

  ${({ $device, $isSidebarExpanded }) => {
    if ($device === 'mobile') {
      return `
        margin-top: 56px;
        margin-left: ${$isSidebarExpanded ? '250px' : '0'};
      `;
    } else {
      return `
        margin-top: 0;
        margin-left: ${$isSidebarExpanded ? '250px' : '80px'};
      `;
    }
  }}
`;


