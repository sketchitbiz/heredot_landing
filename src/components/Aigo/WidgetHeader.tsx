'use client'

import React from 'react'
import styled from 'styled-components'
import { useThemeStore } from '@/store/themeStore'
import Icon from '@/components/Aigo/components/Icon'

const HeaderWrapper = styled.header`
  position: relative;
  width: 100%;
  height: 56px;
  background-color: ${({ theme }) => theme.body};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`

const HeaderContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
`

const Logo = styled.div`
  cursor: pointer;
`

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

const ThemeToggle = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
`

// const ProfileImage = styled.div`
//   width: 32px;
//   height: 32px;
//   border-radius: 50%;
//   overflow: hidden;
//   background-color: ${({ theme }) => theme.surface1};
// `

const ProfileName = styled.span`
  font-size: 16px;
  font-weight: 500;
`

const WidgetHeader = () => {
  const { isDarkMode, toggleTheme } = useThemeStore()

  return (
    <HeaderWrapper>
      <HeaderContent>
        <Logo>
          <Icon 
            src={isDarkMode ? '/Aigo-widget/logo_dark.png' : '/Aigo-widget/logo_light.png'} 
            height={32} 
            fallbackIcon="logo"
          />
        </Logo>
        <ProfileSection>
          <ThemeToggle onClick={toggleTheme}>
            <Icon 
              src={isDarkMode ? '/Aigo-widget/dark_mode.png' : '/Aigo-widget/light_mode.png'} 
              width={36} 
              height={36}
              fallbackIcon={isDarkMode ? 'moon' : 'sun'}
            />
          </ThemeToggle>
          <Profile>
            <ProfileName>로그인</ProfileName>
          </Profile>
        </ProfileSection>
      </HeaderContent>
    </HeaderWrapper>
  )
}

export default WidgetHeader