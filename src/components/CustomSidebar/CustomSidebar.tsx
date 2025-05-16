<<<<<<< HEAD
'use client';

import React from 'react';
import styled, { css } from 'styled-components';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export interface MenuItemConfig {
  icon: React.ReactElement;
  title: string;
  path: string;
  subMenu?: MenuItemConfig[] | null;
}

=======
"use client";

import React from "react";
import styled, { css } from "styled-components";
import Link from "next/link"; // Next.js의 Link 컴포넌트 사용
import { usePathname } from "next/navigation"; // App Router용 usePathname 추가

// 메뉴 아이템 설정을 위한 타입 정의
export interface MenuItemConfig {
  icon: React.ReactElement; // 아이콘 컴포넌트
  title: string; // 메뉴 제목
  path: string; // 이동할 경로
}

// 사이드바 Props 정의
>>>>>>> c109fa3 (사이드바 커스텀 추가 ,ai 이미지,파일,링크 추가작업중)
interface CustomSidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  menuItems: MenuItemConfig[];
<<<<<<< HEAD
  footerIcon: React.ReactElement;
  onFooterClick: () => void;
  children: React.ReactNode;
=======
  footerIcon: React.ReactElement; // 푸터 아이콘 컴포넌트
  onFooterClick: () => void; // 푸터 클릭 핸들러 (예: 로그아웃)
  children: React.ReactNode; // 헤더 컴포넌트를 받기 위한 children
>>>>>>> c109fa3 (사이드바 커스텀 추가 ,ai 이미지,파일,링크 추가작업중)
}

const CustomSidebar: React.FC<CustomSidebarProps> = ({
  isCollapsed,
  toggleSidebar,
  menuItems,
  footerIcon,
  onFooterClick,
<<<<<<< HEAD
  children,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [expandedMenu, setExpandedMenu] = React.useState<string | null>(null);

  const isActive = (itemPath: string) => pathname === itemPath;

  const isMenuExpanded = (subMenu?: MenuItemConfig[] | null) => {
    if (!subMenu) return false;
    return subMenu.some((sub) => pathname.startsWith(sub.path));
  };

  const handleMenuClick = (path: string, hasSubMenu: boolean) => {
    if (hasSubMenu) {
      setExpandedMenu(expandedMenu === path ? null : path);
      router.push(path); // ⬅ 이동 추가: 리다이렉트 트리거
    }
  };

  return (
    <SidebarContainer $isCollapsed={isCollapsed}>
      {children}

      <ToggleButton
        onClick={toggleSidebar}
        $isCollapsed={isCollapsed}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <ToggleIconImg
          src="/icon_burger.png"
          alt={isCollapsed ? 'Expand' : 'Collapse'}
          width={16}
          height={24}
          $rotate={isCollapsed}
        />
      </ToggleButton>

      <MenuList $isCollapsed={isCollapsed}>
        {menuItems.map((item) => {
          const hasSubMenu = !!item.subMenu;
          const active = isActive(item.path);
          const expanded = expandedMenu === item.path || isMenuExpanded(item.subMenu);
          const shouldBeActive = active || isMenuExpanded(item.subMenu);

          return (
            <React.Fragment key={item.path}>
              {hasSubMenu ? (
                <MenuItem
                  as="div"
                  $isCollapsed={isCollapsed}
                  $active={shouldBeActive}
                  onClick={() => handleMenuClick(item.path, true)}
                >
                  <Center>
                    <IconWrapper $isCollapsed={isCollapsed}>{item.icon}</IconWrapper>
                    {!isCollapsed && item.title}
                  </Center>
                </MenuItem>
              ) : (
                <Link href={item.path} passHref legacyBehavior>
                  <MenuItem as="a" $isCollapsed={isCollapsed} $active={active}>
                    <Center>
                      <IconWrapper $isCollapsed={isCollapsed}>{item.icon}</IconWrapper>
                      {!isCollapsed && item.title}
                    </Center>
                  </MenuItem>
                </Link>
              )}

              {expanded && item.subMenu && (
                <SubMenuList>
                  {item.subMenu.map((subItem) => (
                    <Link key={subItem.path} href={subItem.path} passHref legacyBehavior>
                      <SubMenuItem $active={pathname === subItem.path}>
                        <IconWrapper>{subItem.icon}</IconWrapper>
                        {subItem.title}
                      </SubMenuItem>
                    </Link>
                  ))}
                </SubMenuList>
              )}
            </React.Fragment>
          );
        })}
      </MenuList>

=======
  children, // 헤더 컴포넌트
}) => {
  const pathname = usePathname(); // 현재 경로 가져오기

  // 현재 경로와 메뉴 아이템 경로 비교하여 활성화 상태 판단
  const isActive = (path: string) => pathname === path || (path !== "/" && pathname.startsWith(path)); // startsWith 로직 보강

  return (
    <SidebarContainer $isCollapsed={isCollapsed}>
      {children} {/* 헤더 컴포넌트 렌더링 */}
      {/* IconClick 대신 ToggleButton 사용 */}
      <ToggleButton
        onClick={toggleSidebar}
        $isCollapsed={isCollapsed}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
        <ToggleIconImg
          src="/icon_burger.png"
          alt={isCollapsed ? "Expand" : "Collapse"}
          width={16}
          height={24}
          $rotate={isCollapsed} // $flip 대신 $rotate 사용 및 조건 변경
        />
      </ToggleButton>
      <MenuList $isCollapsed={isCollapsed}>
        {menuItems.map((item) => (
          <Link key={item.path} href={item.path} passHref legacyBehavior>
            <MenuItem $isCollapsed={isCollapsed} $active={isActive(item.path)} as="a">
              <Center>
                <IconWrapper $isCollapsed={isCollapsed}>{item.icon}</IconWrapper>
                {!isCollapsed && item.title}
              </Center>
            </MenuItem>
          </Link>
        ))}
      </MenuList>
>>>>>>> c109fa3 (사이드바 커스텀 추가 ,ai 이미지,파일,링크 추가작업중)
      <FooterSection onClick={onFooterClick} $isCollapsed={isCollapsed}>
        <IconWrapper $isCollapsed={isCollapsed}>{footerIcon}</IconWrapper>
        {!isCollapsed && <FooterText>Logout</FooterText>}
      </FooterSection>
    </SidebarContainer>
  );
};

export default CustomSidebar;

<<<<<<< HEAD
// --- Styled Components ---
=======
// --- Styled Components --- (기존 스타일 유지 및 ToggleButton, ToggleIconImg 추가)
>>>>>>> c109fa3 (사이드바 커스텀 추가 ,ai 이미지,파일,링크 추가작업중)

const SidebarContainer = styled.div<{ $isCollapsed: boolean }>`
  position: fixed;
  left: 0;
  top: 0;
<<<<<<< HEAD
  width: ${({ $isCollapsed }) => ($isCollapsed ? '80px' : '250px')};
=======
  width: ${({ $isCollapsed }) => ($isCollapsed ? "80px" : "250px")};
>>>>>>> c109fa3 (사이드바 커스텀 추가 ,ai 이미지,파일,링크 추가작업중)
  height: 100vh;
  overflow: hidden;
  background: #2c2e3c;
  color: white;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  z-index: 1000;
`;

<<<<<<< HEAD
const ToggleButton = styled.button<{ $isCollapsed: boolean }>`
  position: absolute;
  top: 50px;
  right: 15px;
  background: none;
  border: none;
  padding: 5px;
  cursor: pointer;
  z-index: 1001;
  display: flex;
=======
// IconClick 스타일을 통합한 ToggleButton
const ToggleButton = styled.button<{ $isCollapsed: boolean }>`
  position: absolute;
  top: 50px; // 위치 조정 (필요시)
  right: 15px; // 접혔을 때도 보이도록 오른쪽 위치 고정
  background: none;
  border: none;
  padding: 5px; // 클릭 영역 확보
  cursor: pointer;
  z-index: 1001;
  display: flex; // 내부 아이콘 정렬
>>>>>>> c109fa3 (사이드바 커스텀 추가 ,ai 이미지,파일,링크 추가작업중)
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.8;
  }
`;

<<<<<<< HEAD
const ToggleIconImg = styled.img<{ $rotate?: boolean }>`
  display: block;
  transform: ${({ $rotate }) => ($rotate ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.3s ease;
=======
// IconClick의 img 스타일 + rotate 기능
const ToggleIconImg = styled.img<{ $rotate?: boolean }>`
  display: block; // 이미지 하단 여백 제거
  transform: ${({ $rotate }) => ($rotate ? "rotate(180deg)" : "rotate(0deg)")}; // rotate 적용
  transition: transform 0.3s ease; // 부드러운 회전 효과 추가
>>>>>>> c109fa3 (사이드바 커스텀 추가 ,ai 이미지,파일,링크 추가작업중)
`;

const MenuList = styled.ul<{ $isCollapsed: boolean }>`
  list-style: none;
  padding: 0;
  margin: 0;
<<<<<<< HEAD
  overflow-y: auto;
=======
  overflow-y: auto; /* 스크롤 */
>>>>>>> c109fa3 (사이드바 커스텀 추가 ,ai 이미지,파일,링크 추가작업중)
  overflow-x: hidden;
  flex-grow: 1;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  ${({ $isCollapsed }) =>
    $isCollapsed &&
    css`
      display: flex;
      flex-direction: column;
      align-items: center;
    `}
`;

<<<<<<< HEAD
const MenuItem = styled.li<{ $active?: boolean; $isCollapsed: boolean }>`
  height: 60px;
  display: flex;
  justify-content: ${({ $isCollapsed }) => ($isCollapsed ? 'center' : 'flex-start')};
  align-items: center;
  color: ${({ $active }) => ($active ? '#fff' : '#8d8e96')};
=======
const MenuItem = styled.a<{ $active?: boolean; $isCollapsed: boolean }>`
  height: 60px;
  display: flex;
  justify-content: ${({ $isCollapsed }) => ($isCollapsed ? "center" : "flex-start")};
  align-items: center;
  color: #8d8e96;
>>>>>>> c109fa3 (사이드바 커스텀 추가 ,ai 이미지,파일,링크 추가작업중)
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 1px solid #252736;
  transition: background 0.2s, color 0.2s;
<<<<<<< HEAD
  background-color: ${({ $active }) => ($active ? '#4071ed' : '#2c2e3c')};
  padding-left: ${({ $isCollapsed }) => ($isCollapsed ? '0' : '20px')};
=======
  background-color: #2c2e3c;
  padding-left: ${({ $isCollapsed }) => ($isCollapsed ? "0" : "20px")};
>>>>>>> c109fa3 (사이드바 커스텀 추가 ,ai 이미지,파일,링크 추가작업중)
  width: 100%;
  text-decoration: none;
  position: relative;

<<<<<<< HEAD
=======
  color: ${({ $active }) => ($active ? "#4eff63" : "#8d8e96")};

>>>>>>> c109fa3 (사이드바 커스텀 추가 ,ai 이미지,파일,링크 추가작업중)
  &:hover {
    background-color: #3a3f4e;
    color: white;
  }

  ${({ $active, $isCollapsed }) =>
    $active &&
    !$isCollapsed &&
    css`
      &::after {
<<<<<<< HEAD
        content: '';
=======
        content: "";
>>>>>>> c109fa3 (사이드바 커스텀 추가 ,ai 이미지,파일,링크 추가작업중)
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        width: 8px;
        height: 8px;
        background-color: #4eff63;
        border-radius: 50%;
      }
    `}
`;

const Center = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const IconWrapper = styled.span<{ $isCollapsed?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
<<<<<<< HEAD
  margin-right: ${({ $isCollapsed }) => ($isCollapsed ? '0' : '15px')};
=======
  margin-right: ${({ $isCollapsed }) => ($isCollapsed ? "0" : "15px")};
>>>>>>> c109fa3 (사이드바 커스텀 추가 ,ai 이미지,파일,링크 추가작업중)
  flex-shrink: 0;

  & > svg {
    width: 100%;
    height: 100%;
  }
`;

const FooterSection = styled.div<{ $isCollapsed: boolean }>`
  display: flex;
  align-items: center;
<<<<<<< HEAD
  justify-content: ${({ $isCollapsed }) => ($isCollapsed ? 'center' : 'flex-start')};
=======
  justify-content: ${({ $isCollapsed }) => ($isCollapsed ? "center" : "flex-start")};
>>>>>>> c109fa3 (사이드바 커스텀 추가 ,ai 이미지,파일,링크 추가작업중)
  padding: 15px;
  height: 60px;
  color: #8d8e96;
  cursor: pointer;
  transition: color 0.2s, background-color 0.2s;
  border-top: 1px solid #444;
  flex-shrink: 0;

  &:hover {
    color: white;
    background-color: #3a3f4e;
  }
<<<<<<< HEAD
=======

  ${IconWrapper} {
    // IconWrapper 마진은 IconWrapper 자체에서 처리
  }
>>>>>>> c109fa3 (사이드바 커스텀 추가 ,ai 이미지,파일,링크 추가작업중)
`;

const FooterText = styled.span`
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
<<<<<<< HEAD

const SubMenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  /* padding-left: 20px; */
`;

const SubMenuItem = styled.li<{ $active?: boolean }>`
  height: 40px;
  display: flex;
  align-items: center;
  color: ${({ $active }) => ($active ? '#fff' : '#797878')};
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  padding-left: 80px;
  background-color: ${({ $active }) => ($active ? '#3a3f4e' : 'transparent')};

  &:hover {
    background-color: #3a3f4e;
    color: white;
  }
`;
=======
>>>>>>> c109fa3 (사이드바 커스텀 추가 ,ai 이미지,파일,링크 추가작업중)
