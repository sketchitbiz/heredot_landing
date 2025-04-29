"use client";

import React, { useState } from "react";
import styled from "styled-components"; // 스타일링을 위해 추가
import CustomSidebar, { MenuItemConfig } from "../../components/CustomSidebar/CustomSidebar";
import CustomSidebarHeader from "../../components/CustomSidebar/CustomSidebarHeader";
import GenericListGuide from "../../components/CustomList/GenericListGuide";

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

  // 예시 메뉴 아이템
  const menuItems: MenuItemConfig[] = [
    { icon: <HomeIcon />, title: "Home", path: "/" },
    { icon: <SettingsIcon />, title: "Settings", path: "/ai" },
    { icon: <SettingsIcon />, title: "Settings", path: "/ai" },
    { icon: <SettingsIcon />, title: "Settings", path: "/ai" },
    { icon: <SettingsIcon />, title: "Settings", path: "/ai" },
    { icon: <SettingsIcon />, title: "Settings", path: "/ai" },
    // 필요한 만큼 메뉴 아이템 추가
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
        <CustomSidebarHeader isCollapsed={isCollapsed} name="테스트 사용자" />
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
