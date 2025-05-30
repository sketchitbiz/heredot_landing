'use client';

import React from 'react';
import styled, { css } from 'styled-components';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface MenuItemConfig {
  icon: React.ReactElement;
  title: string;
  path: string;
  subMenu?: MenuItemConfig[] | null;
}

interface CustomSidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  menuItems: MenuItemConfig[];
  footerIcon: React.ReactElement;
  onFooterClick: () => void;
  children: React.ReactNode;
}

const CustomSidebar: React.FC<CustomSidebarProps> = ({
  isCollapsed,
  toggleSidebar,
  menuItems,
  footerIcon,
  onFooterClick,
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
      router.push(path);
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
          const expanded =
            expandedMenu === item.path || isMenuExpanded(item.subMenu);
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
                  <Center $isCollapsed={isCollapsed}>
                    <IconWrapper $isCollapsed={isCollapsed}>
                      {item.icon}
                    </IconWrapper>

                    {!isCollapsed && (
                      <RightContent>
                        <span>{item.title}</span>
                        {hasSubMenu && (
                          <ArrowWrapper>
                            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </ArrowWrapper>
                        )}
                      </RightContent>
                    )}

                  </Center>


                </MenuItem>
              ) : (
                <Link href={item.path} passHref legacyBehavior>
                  <MenuItem as="a" $isCollapsed={isCollapsed} $active={active}>
                    <Center $isCollapsed={isCollapsed}>
                      <IconWrapper $isCollapsed={isCollapsed}>
                        {item.icon}
                      </IconWrapper>
                      {!isCollapsed && (
                        <RightContent>
                          <span>{item.title}</span>
                          {/* 서브메뉴 없으면 ArrowWrapper 렌더 안함 */}
                        </RightContent>
                      )}
                    </Center>
                  </MenuItem>
                </Link>

              )}

              {expanded && item.subMenu && (
                <SubMenuList>
                  {item.subMenu.map((subItem) => (
                    <Link
                      key={subItem.path}
                      href={subItem.path}
                      passHref
                      legacyBehavior
                    >
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

      <FooterSection onClick={onFooterClick} $isCollapsed={isCollapsed}>
        <IconWrapper $isCollapsed={isCollapsed}>{footerIcon}</IconWrapper>
        {!isCollapsed && <FooterText>Logout</FooterText>}
      </FooterSection>
    </SidebarContainer>
  );
};

export default CustomSidebar;

// --- Styled Components ---

const SidebarContainer = styled.div<{ $isCollapsed: boolean }>`
  position: fixed;
  left: 0;
  top: 0;
  width: ${({ $isCollapsed }) => ($isCollapsed ? '80px' : '250px')};
  height: 100vh;
  overflow: hidden;
  background: #2c2e3c;
  color: white;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  z-index: 1000;
`;

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
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.8;
  }
`;

const RightContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
  gap: 8px;
  padding-right: 20px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;


const ToggleIconImg = styled.img<{ $rotate?: boolean }>`
  display: block;
  transform: ${({ $rotate }) => ($rotate ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.3s ease;
`;

const MenuList = styled.ul<{ $isCollapsed: boolean }>`
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
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

const MenuItem = styled.li<{ $active?: boolean; $isCollapsed: boolean }>`
  height: 60px;
  display: flex;
  justify-content: ${({ $isCollapsed }) =>
    $isCollapsed ? 'center' : 'flex-start'};
  align-items: center;
  color: ${({ $active }) => ($active ? '#fff' : '#8d8e96')};
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 1px solid #252736;
  transition: background 0.2s, color 0.2s;
  background-color: ${({ $active }) => ($active ? '#4071ed' : '#2c2e3c')};
  padding-left: ${({ $isCollapsed }) => ($isCollapsed ? '0' : '20px')};
  width: 100%;
  text-decoration: none;
  position: relative;

  &:hover {
    background-color: #3a3f4e;
    color: white;
  }
`;

const Center = styled.div<{ $isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  overflow: hidden;
  ${({ $isCollapsed }) =>
    $isCollapsed
      ? css`
          justify-content: center;
        `
      : css`
          justify-content: flex-start;
        `}
`;

const ArrowWrapper = styled.span`
  margin-left: 8px;
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.span<{ $isCollapsed?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-right: ${({ $isCollapsed }) => ($isCollapsed ? '0' : '15px')};
  flex-shrink: 0;

  & > svg {
    width: 100%;
    height: 100%;
  }
`;

const FooterSection = styled.div<{ $isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ $isCollapsed }) =>
    $isCollapsed ? 'center' : 'flex-start'};
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
`;

const FooterText = styled.span`
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SubMenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
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
