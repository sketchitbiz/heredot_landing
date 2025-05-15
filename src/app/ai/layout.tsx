'use client';

import styled from 'styled-components';
import AiNavigationBar from '@/components/Ai/AiNavigationBar';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Menu, Search, Edit } from '@mui/icons-material';
import useAuthStore from '@/store/authStore';
import { AppTextStyles } from '@/styles/textStyles';
import React from 'react';
import { useLang } from '@/contexts/LangContext';
import DropdownInput from '@/components/DropdownInput';
import { userStamp } from '@/lib/api/user/api';

// PageLoader를 클라이언트 사이드에서만 렌더링하도록 dynamic import
const ClientOnlyPageLoader = dynamic(() => import('@/components/PageLoader'), {
  ssr: false,
});

// layout.tsx에서 사용할 커스텀 LanguageSwitcher
const HeaderLanguageSwitcher = () => {
  const { lang, setLang } = useLang();

  const languageOptions = [
    { label: '한국어', value: 'ko' },
    { label: 'English', value: 'en' },
  ];

  const logLanguageChange = (lang: 'ko' | 'en') => {
    userStamp({
      uuid: localStorage.getItem('logId') ?? 'anonymous',
      category: '버튼',
      content: 'LanguageSwitcher',
      memo: `언어 변경: ${lang}`,
    });
  };

  return (
    <DropdownInput
      value={lang}
      onChange={(value) => {
        const selectedLang = value as 'ko' | 'en';
        setLang(selectedLang);
        logLanguageChange(selectedLang);
      }}
      options={languageOptions}
      $triggerBackgroundColor="#121315"
      $triggerFontSize="18px"
      $triggerTextColor="#FFFFFF"
      $contentBackgroundColor="#121315"
      $contentTextColor="#FFFFFF"
      $itemHoverBackgroundColor="#546ACB"
      $itemHoverTextColor="#FFFFFF"
      $triggerContent={
        <img src="/globe.svg" alt="Language Selector" width={24} height={24} />
      }
      width="auto"
    />
  );
};

// 임시 데이터
const navigationItems = [
  {
    title: '오늘',
    items: [
      { name: '전산개발 견적', status: '진행' as const },
      { name: 'IoT 앱 견적', status: '완료' as const },
      { name: '쇼핑 어플 견적 문의', status: '진행' as const },
    ],
  },
  {
    title: '일주일 전',
    items: [
      { name: '전산개발 견적', status: '완료' as const },
      { name: 'IoT 앱 견적', status: '완료' as const },
      { name: '쇼핑 어플 견적 문의', status: '완료' as const },
    ],
  },
  {
    title: '3월',
    items: [
      { name: '전산개발 견적', status: '완료' as const },
      { name: 'IoT 앱 견적', status: '완료' as const },
      { name: '쇼핑 어플 견적 문의', status: '완료' as const },
    ],
  },
];

export default function AiLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { lang } = useLang();

  useEffect(() => {
    // 페이지 초기 로딩 시뮬레이션
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    // 화면 크기 변경 감지
    const checkMobile = () => {
      const isMobileView = window.innerWidth <= 1200;
      setIsMobile(isMobileView);
      if (isMobileView) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // 초기 로드 시 체크
    checkMobile();

    // 리사이즈 이벤트 리스너 등록
    window.addEventListener('resize', checkMobile);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* 모바일용 전체 화면 헤더 */}
      {isMobile && (
        <FixedHeader>
          <LeftSection>
            <MenuButton onClick={toggleSidebar}>
              <Menu />
            </MenuButton>
            <EditButton onClick={() => (window.location.href = '/ai')}>
              <Edit />
            </EditButton>
          </LeftSection>
          <HeaderTitle>
            {isLoggedIn && user?.name ? (
              <>
                {user?.profileUrl ? (
                  <UserAvatar
                    src={user.profileUrl}
                    alt={user.name || '사용자'}
                  />
                ) : (
                  <Avatar />
                )}
                {lang === 'ko'
                  ? `${user.name}님의 견적서`
                  : `${user.name}'s Quote`}
              </>
            ) : lang === 'ko' ? (
              'AI 견적서'
            ) : (
              'AI Quote'
            )}
          </HeaderTitle>
          <RightSection>
            <HeaderLanguageSwitcher />
          </RightSection>
        </FixedHeader>
      )}

      <LayoutContainer $isMobile={isMobile}>
        {/* PageLoader */}
        <ClientOnlyPageLoader isOpen={isLoading} />

        {/* 사이드바 및 내비게이션 */}
        <AiNavigationBar
          navigationItems={navigationItems}
          isMobile={isMobile}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        {/* 메인 콘텐츠 */}
        <MainContent $isMobile={isMobile}>{children}</MainContent>
      </LayoutContainer>
    </>
  );
}

const FixedHeader = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: #121315;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 16px;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }
`;

const MenuButton = styled(ActionButton)`
  margin-right: 0px;
`;
const EditButton = styled(ActionButton)``;
const SearchButton = styled(ActionButton)``;

// 왼쪽 영역
const LeftSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
`;

// 오른쪽 영역
const RightSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
`;

const HeaderTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  ${AppTextStyles.title3}
  margin: 0;
  font-size: 18px;
  text-align: center;
  white-space: nowrap;
`;

const Avatar = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: white;
  margin-right: 10px;
`;

const UserAvatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
`;

const LayoutContainer = styled.div<{ $isMobile: boolean }>`
  display: flex;
  min-height: 100vh;
  padding-top: ${(props) => (props.$isMobile ? '60px' : '0')};
`;

const MainContent = styled.main<{ $isMobile: boolean }>`
  flex: 1;
  background-color: white;
  height: ${(props) => (props.$isMobile ? 'calc(100vh - 60px)' : '100vh')};
  overflow-y: auto;
`;
