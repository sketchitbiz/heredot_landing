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
import { useRouter, useSearchParams } from 'next/navigation'; // useSearchParams 추가
import useChatSessionList, {
  ChatSession,
} from '@/hooks/chat/useChatSessionList';

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
  const searchParams = useSearchParams(); // searchParams 가져오기
  const sessionIdFromUrl = searchParams.get('sessionId'); // URL에서 sessionId 파라미터 읽기

  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const user = useAuthStore((state) => state.user);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const currentSessionIndex = useAuthStore(
    (state) => state.currentSessionIndex
  ); // currentSessionIndex 가져오기
  const setCurrentSessionIndex = useAuthStore(
    (state) => state.setCurrentSessionIndex
  );
  const resetCurrentSession = useAuthStore(
    (state) => state.resetCurrentSession
  ); // 🚨 resetCurrentSession 액션 가져오기

  const { lang } = useLang();
  const t = aiChatDictionary[lang];

  const {
    fetchChatSessions,
    sessions,
    isLoading: isSessionsLoading,
  } = useChatSessionList();

  // 세션 데이터를 가공하여 NavigationGroup 형태로 변환
  const transformSessionsToNavigationGroups = useCallback(
    (sessions: ChatSession[], currentLang: string): NavigationGroup[] => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const oneWeekAgo = new Date(today);
      oneWeekAgo.setDate(today.getDate() - 7);

      const todayItems: NavigationItemData[] = [];
      const lastWeekItems: NavigationItemData[] = [];

      sessions.forEach((session) => {
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

        // 🚨 서버에서 title이 null로 올 경우 클라이언트에서 기본값 부여
        const sessionTitle =
          session.title ||
          aiChatDictionary[currentLang]?.navigation?.newChatTitle ||
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
        aiChatDictionary[currentLang]?.navigation?.period?.today || '오늘';
      const lastWeekTitle =
        aiChatDictionary[currentLang]?.navigation?.period?.lastWeek ||
        '일주일 전';

      if (todayItems.length > 0) {
        groups.push({ title: todayTitle, items: todayItems });
      }
      if (lastWeekItems.length > 0) {
        groups.push({ title: lastWeekTitle, items: lastWeekItems });
      }

      // 🚨 로그인 상태이고, 현재 표시할 세션이 없을 경우 '새로운 채팅' 플레이스홀더 추가
      // (기존에는 authStore에서 createOrNavigateNewChatSession을 호출했으나, 이제는 ChatInput에서 첫 메시지 시 생성)
      if (isLoggedIn && sessions.length === 0) {
        groups.push({
          title: todayTitle,
          items: [
            {
              id: 'new-session-placeholder',
              name:
                aiChatDictionary[currentLang]?.navigation?.newChatTitle ||
                '새로운 채팅',
              status: '진행', // 새 채팅은 '진행' 상태로 표시
            },
          ],
        });
      }

      return groups;
    },
    [lang, isLoggedIn]
  );

  // 컴포넌트 마운트 시 초기 세션 목록 불러오기 및 리사이즈 이벤트 처리
  useEffect(() => {
    setIsLoading(true);

    const loadSessions = async () => {
      if (isLoggedIn) {
        await fetchChatSessions();
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
  }, [isLoggedIn, fetchChatSessions]);

  // `sessions` 또는 `lang`이 변경될 때마다 navigationItems 업데이트
  const [currentNavigationItems, setCurrentNavigationItems] = useState<
    NavigationGroup[]
  >([]);
  useEffect(() => {
    console.log(
      'AiLayout - useEffect (sessions/lang): sessions 상태:',
      sessions,
      'lang:',
      lang
    );
    if (sessions) {
      const transformed = transformSessionsToNavigationGroups(sessions, lang);
      console.log(
        'AiLayout - useEffect (sessions/lang): 변환된 navigationItems:',
        transformed
      );
      setCurrentNavigationItems(transformed);
    } else {
      // 세션이 아직 로딩되지 않았거나 없는 경우 (빈 배열인 경우 포함)
      const newChatTitle =
        aiChatDictionary[lang]?.navigation?.newChatTitle || '새로운 채팅';
      const todayTitle =
        aiChatDictionary[lang]?.navigation?.period?.today || '오늘';
      const defaultItems: NavigationGroup[] = isLoggedIn
        ? [
            {
              title: todayTitle,
              items: [
                {
                  id: 'new-session-placeholder',
                  name: newChatTitle,
                  status: '진행',
                },
              ],
            },
          ]
        : [];
      console.log(
        'AiLayout - useEffect (sessions/lang): 세션이 없어서 기본값 설정:',
        defaultItems
      );
      setCurrentNavigationItems(defaultItems);
    }
  }, [sessions, lang, transformSessionsToNavigationGroups, isLoggedIn]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  // 🚨 새 채팅 시작 버튼 클릭 핸들러 (authStore의 액션을 직접 사용하지 않음)
  const handleNewChatClick = useCallback(() => {
    router.push('/ai'); // 파라미터 없이 /ai 경로로 이동
    // 이 이동이 발생하면 useEffect의 URL 파라미터 감지 로직에 의해
    // currentSessionIndex가 null로 초기화될 것입니다.
    if (isMobile) toggleSidebar(); // 모바일에서 새 채팅 클릭 시 사이드바 닫기
  }, [router, isMobile, toggleSidebar]);

  // 전체 로딩 상태는 API 로딩 상태와 PageLoader 로딩 상태를 합쳐서 관리
  const overallLoading = isLoading || isSessionsLoading;

  return (
    <>
      {/* 모바일용 전체 화면 헤더 */}
      {isMobile && (
        <FixedHeader>
          <LeftSection>
            <MenuButton onClick={toggleSidebar}>
              <Menu />
            </MenuButton>
            <EditButton onClick={handleNewChatClick}>
              <Edit />
            </EditButton>
          </LeftSection>
          <HeaderTitle>
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
        <ClientOnlyPageLoader isOpen={overallLoading} />

        <AiNavigationBar
          navigationItems={currentNavigationItems}
          isMobile={isMobile}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          onAddNewEstimateRequest={handleNewChatClick} // 🚨 새 견적 요청 버튼 핸들러 전달
          onSessionClick={(sessionIndex) => {
            setCurrentSessionIndex(sessionIndex); // Zustand에 현재 세션 인덱스 저장
            router.push(`/ai?sessionId=${sessionIndex}`); // router.push 사용
            if (isMobile) toggleSidebar(); // 모바일에서 세션 클릭 시 사이드바 닫기
          }}
        />

        <MainContent $isMobile={isMobile}>{children}</MainContent>
      </LayoutContainer>
    </>
  );
}

// --- Styled Components (변동 없음) ---

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
