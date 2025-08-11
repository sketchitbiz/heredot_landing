'use client'
import styled from 'styled-components'
import { useThemeStore } from '@/store/themeStore'
import Icon, { IconName } from '@/components/Aigo/components/Icon'
import React from 'react'

const FooterWrapper = styled.footer`
  position: relative;
  width: 100%;
  height: 80px;
  background-color: ${({ theme }) => theme.body};
  border-top: 1px solid ${({ theme }) => theme.border};
`

const FooterContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 12px;
`

const NavItem = styled.button<{ $isActive?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  color: ${({ theme, $isActive }) => ($isActive ? theme.accent : theme.subtleText)};
  font-size: 12px;
  min-width: 64px;
  padding: 8px 0;
  background: transparent;
  border: none;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.accent};
  }
`

const IconWrapper = styled.div<{ $isActive?: boolean }>`
  opacity: ${({ $isActive }) => ($isActive ? 1 : 0.7)};
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }
`

// const NavText = styled.span`
//   font-weight: 500;
// `

type TabKey = 'consult' | 'myEstimate' | 'settings' | 'aiEstimate';

interface WidgetFooterProps {
  activeTab: TabKey;
  onChangeTab: (tab: TabKey) => void;
}

const WidgetFooter = ({ activeTab, onChangeTab }: WidgetFooterProps) => {
  const { isDarkMode } = useThemeStore()

  const navItems: { tab: TabKey | 'expand'; icon: string; fallbackIcon: IconName; text: string }[] = [
    {
      tab: 'consult',
      icon: isDarkMode ? '/Aigo-widget/consultation_dark.png' : '/Aigo-widget/consultation_light.png',
      fallbackIcon: 'chat',
      text: '견적상담',
    },
    {
      tab: 'myEstimate',
      icon: isDarkMode ? '/Aigo-widget/estimate_dark.png' : '/Aigo-widget/estimate_light.png',
      fallbackIcon: 'document',
      text: '나의견적',
    },
    {
      tab: 'settings',
      icon: isDarkMode ? '/Aigo-widget/setting_dark.png' : '/Aigo-widget/setting_light.png',
      fallbackIcon: 'settings',
      text: '설정',
    },
    {
      tab: 'expand',
      icon: isDarkMode ? '/Aigo-widget/full_dark.png' : '/Aigo-widget/full_light.png',
      fallbackIcon: 'expand',
      text: '전체화면',
    },
  ]

  return (
    <FooterWrapper>
      <FooterContent>
        {navItems.map((item) => {
          const isActive = item.tab !== 'expand' && activeTab === item.tab;
          const handleClick = () => {
            if (item.tab === 'expand') {
              window.open('/ai', '_blank', 'noopener,noreferrer');
            } else {
              onChangeTab(item.tab as TabKey);
            }
          };
          return (
            <NavItem key={item.text} onClick={handleClick} $isActive={isActive}>
              <IconWrapper $isActive={isActive}>
                <Icon src={item.icon} width={80} height={60} fallbackIcon={item.fallbackIcon} />
              </IconWrapper>
              {/* <NavText>{item.text}</NavText> */}
            </NavItem>
          );
        })}
      </FooterContent>
    </FooterWrapper>
  )
}

export default WidgetFooter