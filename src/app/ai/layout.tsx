'use client';

import styled from 'styled-components';
import AiNavigationBar from '@/components/Ai/AiNavigationBar';
import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Menu, Edit } from '@mui/icons-material';
import useAuthStore from '@/store/authStore';
import { AppTextStyles } from '@/styles/textStyles';
import React from 'react';
import { useLang } from '@/contexts/LangContext';
import DropdownInput from '@/components/DropdownInput';
import { userStamp } from '@/lib/api/user/api';
import { aiChatDictionary } from '@/lib/i18n/aiChat';
import { useRouter } from 'next/navigation';
import useChatSessionList, {
  ChatSession,
} from '@/hooks/chat/useChatSessionList';
import { EditProfileModal } from '@/app/ai/EditProfileModal';
import { AppColors } from '@/styles/colors';

// PageLoader를 클라이언트 사이드에서만 렌더링하도록 dynamic import
const ClientOnlyPageLoader = dynamic(() => import('@/components/PageLoader'), {
  ssr: false,
});

// layout.tsx에서 사용할 커스텀 LanguageSwitcher (변동 없음)
const HeaderLanguageSwitcher = () => {
  const { lang, setLang } = useLang();

  const languageOptions = [
    { label: '한국어', value: 'ko' },
    { label: 'English', value: 'en' },
  ];

  const logLanguageChange = (lang: 'ko' | 'en') => {
    userStamp({
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

interface NavigationItemData {
  id: string;
  name: string;
  status: '진행' | '완료' | '추가중';
  sessionIndex?: number;
}

interface NavigationGroup {
  title: string;
  items: NavigationItemData[];
}

export default function AiLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const user = useAuthStore((state) => state.user);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const setCurrentSessionIndex = useAuthStore(
    (state) => state.setCurrentSessionIndex
  );
  const openEditProfileModal = useAuthStore(
    (state) => state.openEditProfileModal
  );

  const { lang } = useLang();
  const t = aiChatDictionary[lang as 'ko' | 'en'];

  const {
    fetchChatSessions,
    sessions,
    isLoading: isSessionsLoading,
  } = useChatSessionList();

  const transformSessionsToNavigationGroups = useCallback(
    (currentSessions: ChatSession[]): NavigationGroup[] => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const oneWeekAgo = new Date(today);
      oneWeekAgo.setDate(today.getDate() - 7);

      const todayItems: NavigationItemData[] = [];
      const lastWeekItems: NavigationItemData[] = [];

      (currentSessions || []).forEach((session) => {
        const [datePart, timePart] = session.createdTime.split(' ');
        const [year, month, day] = datePart.split('-').map(Number);
        const [hours, minutes, seconds] = timePart.split(':').map(Number);
        const sessionDate = new Date(
          year,
          month - 1,
          day,
          hours,
          minutes,
          seconds
        );

        const sessionTitle =
          session.title ||
          aiChatDictionary[lang as 'ko' | 'en']?.navigation?.newChatTitle ||
          '새로운 채팅';
        const status: '진행' | '완료' | '추가중' = session.lastMessage
          ? '완료'
          : '진행';

        const navItem: NavigationItemData = {
          id: session.uuid || `session_${session.index}`,
          name: sessionTitle,
          status: status,
          sessionIndex: session.index,
        };

        if (sessionDate >= today) {
          todayItems.unshift(navItem);
        } else if (sessionDate >= oneWeekAgo) {
          lastWeekItems.unshift(navItem);
        }
      });

      const groups: NavigationGroup[] = [];
      const todayTitle =
        aiChatDictionary[lang as 'ko' | 'en']?.navigation?.period?.today ||
        '오늘';
      const lastWeekTitle =
        aiChatDictionary[lang as 'ko' | 'en']?.navigation?.period?.lastWeek ||
        '일주일 전';

      if (todayItems.length > 0) {
        groups.push({ title: todayTitle, items: todayItems });
      }
      // 변경, 수정, 주의 리스트 호출 시 이거 가능함
      // if (lastWeekItems.length > 0) {
      //   groups.push({ title: lastWeekTitle, items: lastWeekItems });
      // }

      if (isLoggedIn && (!currentSessions || currentSessions.length === 0)) {
        groups.push({
          title: todayTitle,
          items: [
            {
              id: 'new-session-placeholder',
              name:
                aiChatDictionary[lang as 'ko' | 'en']?.navigation
                  ?.newChatTitle || '새로운 채팅',
              status: '진행',
            },
          ],
        });
      }
      return groups;
    },
    [lang, isLoggedIn]
  );

  useEffect(() => {
    setIsLoading(true);
    const loadSessions = async () => {
      if (isLoggedIn && user?.uuid) {
        await fetchChatSessions({ offset: 0 });
      }
      setIsLoading(false);
    };

    loadSessions();

    const checkMobile = () => {
      const isMobileView = window.innerWidth <= 1200;
      setIsMobile(isMobileView);
      setIsSidebarOpen(!isMobileView);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [isLoggedIn, fetchChatSessions, user?.uuid]);

  const [currentNavigationItems, setCurrentNavigationItems] = useState<
    NavigationGroup[]
  >([]);
  useEffect(() => {
    const transformed = transformSessionsToNavigationGroups(sessions);
    setCurrentNavigationItems(transformed);
  }, [sessions, transformSessionsToNavigationGroups]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const handleNewChatClick = useCallback(() => {
    router.push('/ai');
    if (isMobile) toggleSidebar();
  }, [router, isMobile, toggleSidebar]);

  const overallLoading = isLoading || isSessionsLoading;

  return (
    <>
      {isMobile && (
        <FixedHeader>
          <LeftSection>
            <MenuButton onClick={toggleSidebar} aria-label="Toggle sidebar">
              <Menu />
            </MenuButton>
            <EditButton onClick={handleNewChatClick} aria-label="New chat">
              <Edit />
            </EditButton>
          </LeftSection>
          <HeaderTitle
            onClick={isLoggedIn ? openEditProfileModal : undefined}
            style={{ cursor: isLoggedIn ? 'pointer' : 'default' }}
          >
            {isLoggedIn && user?.name ? (
              <>
                <UserAvatar
                  src={user?.profileUrl || '/default-avatar.png'}
                  alt={user.name || '사용자'}
                />
                {lang === 'ko'
                  ? `${user.name}님의 견적서`
                  : `${user.name}'s Quote`}
              </>
            ) : (
              t.pageTitle
            )}
          </HeaderTitle>
          <RightSection>
            <HeaderLanguageSwitcher />
          </RightSection>
        </FixedHeader>
      )}

      <LayoutContainer $isMobile={isMobile}>
        <ClientOnlyPageLoader isOpen={overallLoading} />

        <AiNavigationBar
          navigationItems={currentNavigationItems}
          isMobile={isMobile}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          onAddNewEstimateRequest={handleNewChatClick}
          onSessionClick={(sessionIndex) => {
            setCurrentSessionIndex(sessionIndex);
            router.push(`/ai?sessionId=${sessionIndex}`);
            if (isMobile) toggleSidebar();
          }}
        />

        <MainContent $isMobile={isMobile}>{children}</MainContent>
      </LayoutContainer>
      <EditProfileModal />
    </>
  );
}

// --- Styled Components (거의 동일, HeaderTitle 내 Avatar 관련 스타일은 UserAvatar로 통합될 수 있음) ---

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

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
`;

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
  flex-grow: 1;
  min-width: 0;
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
  background-color: ${AppColors.background};
  height: ${(props) => (props.$isMobile ? 'calc(100vh - 60px)' : '100vh')};
  overflow-y: auto;
`;
