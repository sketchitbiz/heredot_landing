"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { AdminAuthProvider, useAdminAuth } from "@/contexts/AdminAuthContext";
import { usePathname, useRouter } from "next/navigation";

import CustomSidebar, { MenuItemConfig } from "@/components/CustomSidebar/CustomSidebar";
import CustomSidebarHeader from "@/components/CustomSidebar/CustomSidebarHeader";

// 아이콘 임포트
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import StorageIcon from "@mui/icons-material/Storage";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import SettingsIcon from "@mui/icons-material/Settings";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import DescriptionIcon from "@mui/icons-material/Description";
import LogoutIcon from "@mui/icons-material/Logout";
import AssessmentIcon from "@mui/icons-material/Assessment";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import ChatIcon from "@mui/icons-material/Chat";
import BusinessIcon from "@mui/icons-material/Business";
import TuneIcon from "@mui/icons-material/Tune";
import DownloadIcon from "@mui/icons-material/Download";
import { THEME_COLORS } from "@/styles/theme_colors";
import { toast, ToastContainer } from 'react-toastify';

// 메인 콘텐츠 영역 스타일
const MainContent = styled.div<{ $isSidebarCollapsed: boolean }>`
  margin-left: ${({ $isSidebarCollapsed }) => ($isSidebarCollapsed ? "80px" : "250px")};
  padding: 20px;
  transition: margin-left 0.3s ease;
  height: 100vh;
  overflow-y: auto;
`;


const OuterLayoutContainer = styled.div<{ $themeMode: "light" | "dark" }>`
  width: 100vw;
  min-width: 1200px;
  height: 100vh;
  overflow-x: auto; // 좌우 스크롤 가능
  background-color: ${({ $themeMode }) =>
    $themeMode === "light"
      ? THEME_COLORS.light.background
      : THEME_COLORS.dark.background};
`;


export default function CmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <ProtectedCmsLayout>{children}</ProtectedCmsLayout>
    </AdminAuthProvider>
  );
}

function ProtectedCmsLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, ready } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/cms/login";
  const { logout } = useAdminAuth();

  useEffect(() => {
    if (ready && !isLoggedIn && !isLoginPage) {
      router.replace("/cms/login");
    }
  }, [ready, isLoggedIn, isLoginPage]);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  const handleLogout = () => {
    logout();               // 상태 및 로컬스토리지 정리
    router.replace('/cms/login'); // 로그인 페이지로 리디렉션
    toast.success('로그아웃 되었습니다'); 
  };

  const menuItems: MenuItemConfig[] = [
    { icon: <DashboardIcon />, title: "대시보드", path: "/cms" },
    { icon: <GroupIcon />, title: "관리자회원관리", path: "/cms/adminMng" },
    { icon: <PeopleAltIcon />, title: "고객관리", path: "/cms/userMng" },
    {
      icon: <StorageIcon />,
      title: "AI 데이터 관리",
      path: "/cms/aiData",
      subMenu: [
        { icon: <AssessmentIcon />, title: "기초조사 관리", path: "/cms/aiData/survey" }, // 기초조사 관리
        { icon: <TextFieldsIcon />, title: "AI 프롬프트 관리", path: "/cms/aiData/prompt" }, // AI 프롬프트 관리
        { icon: <QuestionAnswerIcon />, title: "AI 동문서답 관리", path: "/cms/aiData/wrongAnswer" }, // AI 동문서답 관리
        { icon: <ChatIcon />, title: "AI 대화이력 관리", path: "/cms/aiData/conversationHistory" }, // AI 대화이력 관리
      ],
    },
    {
      icon: <SettingsApplicationsIcon />,
      title: "AI 설정",
      path: "/cms/aiSetting",
      subMenu: [
        { icon: <BusinessIcon />, title: "회사정보 관리", path: "/cms/aiSetting/companyInfo" }, // 회사정보 관리
        { icon: <TuneIcon />, title: "AI 설정관리", path: "/cms/aiSetting/mng" }, // AI 설정관리
      ],
    },
    {
      icon: <DataUsageIcon />,
      title: "고객 데이터 관리",
      path: "/cms/userData",
      subMenu: [
        { icon: <DownloadIcon />, title: "견적 다운로드 현황", path: "/cms/userData/proposal" }, // 견적 다운로드 현황
        { icon: <ContactSupportIcon />, title: "견적 문의 관리", path: "/cms/userData/inquiry" }, // 견적 문의 관리
      ],
    },
    { icon: <DescriptionIcon />, title: "이용 약관 관리", path: "/cms/terms" },
  ];

  // 로그인 준비 전이거나, 로그인 안 된 상태인데 로그인 페이지가 아닌 경우 → 아무 것도 렌더링하지 않음
  if (!ready || (!isLoggedIn && !isLoginPage)) return null;

  // 로그인 페이지는 레이아웃 없이 children만 반환
  if (isLoginPage) return <>{children}</>;

  return (
    <OuterLayoutContainer $themeMode="light">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <CustomSidebar
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
        menuItems={menuItems}
        footerIcon={<LogoutIcon />}
        onFooterClick={handleLogout}
      >
        <CustomSidebarHeader
          isCollapsed={isCollapsed}
          name="테스트 사용자"
          iconSrc="/favicon.ico"
          showTime={false} // 시간 표시
        />
      </CustomSidebar>
  
      <MainContent $isSidebarCollapsed={isCollapsed}>{children}</MainContent>
    </OuterLayoutContainer>
    
  );
  
}
