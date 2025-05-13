"use client";

import React, { useState } from "react";
import styled from "styled-components"; // 스타일링을 위해 추가
import CustomSidebar, { MenuItemConfig } from "../../components/CustomSidebar/CustomSidebar";
import CustomSidebarHeader from "../../components/CustomSidebar/CustomSidebarHeader";
import GenericListGuide from "../../components/CustomList/GenericListGuide";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import StorageIcon from "@mui/icons-material/Storage";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import DescriptionIcon from "@mui/icons-material/Description";


// 아이콘 임포트 (예시, 실제 아이콘으로 교체 필요)
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

// 메인 콘텐츠 영역 스타일링
const MainContent = styled.div<{ $isSidebarCollapsed: boolean }>`
  margin-left: ${({ $isSidebarCollapsed }) => ($isSidebarCollapsed ? "80px" : "250px")};
  padding: 20px; // 콘텐츠 내부 여백
  transition: margin-left 0.3s ease;
  height: 100vh; // 필요에 따라 조정
  overflow-y: auto; // 콘텐츠가 길어질 경우 스크롤
`;

const TestPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuItems: MenuItemConfig[] = [
    { icon: <DashboardIcon />, title: "대시보드", path: "/" }, // 대시보드
    { icon: <GroupIcon />, title: "관리자회원관리", path: "/adminMng" }, // 관리자 회원 관리
    { icon: <PeopleAltIcon />, title: "고객관리", path: "/userMng" }, // 고객 관리
    { icon: <StorageIcon />, title: "AI 데이터 관리", path: "/aiData" }, // AI 데이터 관리
    { icon: <SettingsApplicationsIcon />, title: "AI 설정", path: "/aiSetting" 
      ,subMenu: [
        { icon: <SettingsIcon />, title: "AI 모델 설정", path: "/aiModel" }, // AI 모델 설정
        { icon: <SettingsIcon />, title: "AI 학습 설정", path: "/aiLearning" }, // AI 학습 설정
        { icon: <SettingsIcon />, title: "AI API 설정", path: "/aiAPI" }, // AI API 설정
        { icon: <SettingsIcon />, title: "AI 보안 설정", path: "/aiSecurity" }, // AI 보안 설정
      ],
    }, // AI 설정
    { icon: <DataUsageIcon />, title: "고객 데이터 관리", path: "/userData" }, // 고객 데이터 관리
    { icon: <ContactSupportIcon />, title: "견적 문의 관리", path: "/inquiry" }, // 견적 문의 관리
    { icon: <DescriptionIcon />, title: "이용 약관 관리", path: "/terms" }, // 이용 약관 관리
  ];

  // 예시 푸터 아이콘 클릭 핸들러
  const handleLogout = () => {
    console.log("Logout clicked");
    // 로그아웃 로직 구현
  };

  return (
    <>
      <CustomSidebar
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
        menuItems={menuItems}
        footerIcon={<LogoutIcon />}
        onFooterClick={handleLogout}>
        {/* CustomSidebarHeader를 children으로 전달 */}
        <CustomSidebarHeader
  isCollapsed={isCollapsed}
  name="테스트 사용자"
  iconSrc="favicon.ico" // logo.svg 경로 설정
/>
      </CustomSidebar>

      {/* 메인 콘텐츠 영역 */}
      <MainContent $isSidebarCollapsed={isCollapsed}>
        {/* 기존 페이지 콘텐츠 */}
        <GenericListGuide />
        {/* 페이지의 다른 콘텐츠들... */}
      </MainContent>
    </>
  );
};

export default TestPage; // 컴포넌트 이름 변경 (optional but recommended)
