'use client';

import styled from 'styled-components';
import AiNavigationBar from '@/components/Ai/AiNavigationBar';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Menu, Edit } from '@mui/icons-material';
import useAuthStore from '@/store/authStore';
import { AppTextStyles } from '@/styles/textStyles';
import React from 'react';
import { useLang } from '@/contexts/LangContext';
import DropdownInput from '@/components/DropdownInput';
import { userStamp } from '@/lib/api/user/api';
import { aiChatDictionary } from '@/lib/i18n/aiChat';

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

interface NavigationItemData {
  id?: string;
  name: string;
  status: '진행' | '완료' | '추가중';
}

interface NavigationGroup {
  title: string;
  items: NavigationItemData[];
}

// 초기 네비게이션 데이터 (한 번만 정의)
const initialNavigationItemsData: NavigationGroup[] = [
  {
    title: '오늘',
    items: [
      { name: '전산개발 견적', status: '진행' },
      { name: 'IoT 앱 견적', status: '완료' },
      { name: '쇼핑 어플 견적 문의', status: '진행' },
    ],
  },
  {
    title: '일주일 전',
    items: [
      { name: '전산개발 견적', status: '완료' },
      { name: 'IoT 앱 견적', status: '완료' },
      { name: '쇼핑 어플 견적 문의', status: '완료' },
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
  const t = aiChatDictionary[lang];
  const [currentNavigationItems, setCurrentNavigationItems] = useState<
    NavigationGroup[]
  >(initialNavigationItemsData);

  // --- Firebase Auth State Listener 시작 (global-wrapper.tsx로 이동) ---
  // useEffect(() => {
  //   console.log('[AiLayout] useEffect for onAuthStateChanged - mounting');
  //   const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
  //     console.log(
  //       '[AiLayout] onAuthStateChanged triggered. Firebase user:',
  //       firebaseUser
  //     );
  //     if (firebaseUser) {
  //       try {
  //         console.log(
  //           '[AiLayout] Firebase user found. Attempting to get ID token.'
  //         );
  //         const token = await firebaseUser.getIdToken();
  //         console.log(
  //           '[AiLayout] ID token obtained. Preparing UserData for login.'
  //         );
  //         const userDataForStore = {
  //           uuid: firebaseUser.uid,
  //           email: firebaseUser.email || '',
  //           accessToken: token,
  //           name: firebaseUser.displayName || '',
  //           countryCode: null,
  //           cellphone: firebaseUser.phoneNumber || null,
  //           providerId: firebaseUser.providerData[0]?.providerId || '',
  //           withdrawYn: 'N',
  //           createdTime: firebaseUser.metadata.creationTime
  //             ? new Date(firebaseUser.metadata.creationTime).toISOString()
  //             : new Date().toISOString(),
  //           updateTime: firebaseUser.metadata.lastSignInTime
  //             ? new Date(firebaseUser.metadata.lastSignInTime).toISOString()
  //             : null,
  //           lastLoginTime: firebaseUser.metadata.lastSignInTime
  //             ? new Date(firebaseUser.metadata.lastSignInTime).toISOString()
  //             : new Date().toISOString(),
  //           profileUrl: firebaseUser.photoURL || undefined,
  //         };
  //         console.log(
  //           '[AiLayout] Calling authStore.login with UserData:',
  //           userDataForStore
  //         );
  //         login(userDataForStore);
  //       } catch (error) {
  //         console.error(
  //           '[AiLayout] Error getting ID token or preparing UserData:',
  //           error
  //         );
  //         console.log('[AiLayout] Calling authStore.logout due to error.');
  //         logout();
  //       }
  //     } else {
  //       console.log(
  //         '[AiLayout] No Firebase user found (or user signed out).'
  //       );
  //       // logout();
  //     }
  //   });
  //
  //   return () => {
  //     console.log(
  //       '[AiLayout] useEffect for onAuthStateChanged - unmounting. Unsubscribing.'
  //     );
  //     unsubscribe();
  //   };
  // }, [login, logout]); // login, logout 의존성 제거
  // --- Firebase Auth State Listener 끝 ---

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

    // --- 네비게이션 아이템 업데이트 로직 시작 ---
    const quoteIdForProvisionalTitle = localStorage.getItem(
      'addProvisionalQuoteTitleFor'
    );
    const quoteIdForTitleUpdate = localStorage.getItem('updateQuoteTitleFor');
    const firstMessage = quoteIdForTitleUpdate
      ? localStorage.getItem(`firstUserMessageFor_${quoteIdForTitleUpdate}`)
      : null;

    setCurrentNavigationItems((prevItems) => {
      let newItems = [...prevItems]; // 상태 변경을 위해 새 배열로 시작
      let provisionalItemAddedOrFound = false;

      // 1. 제목 업데이트 먼저 시도 (첫 메시지가 있고, 해당 ID의 임시 항목이 존재하거나 새로 추가될 예정일 때)
      if (quoteIdForTitleUpdate && firstMessage) {
        const targetItemId = `quote_${quoteIdForTitleUpdate}`;
        let itemUpdated = false;
        newItems = newItems.map((group) => ({
          ...group,
          items: group.items.map((item) => {
            if (item.id === targetItemId) {
              itemUpdated = true;
              return { ...item, name: firstMessage, status: '진행' };
            }
            return item;
          }),
        }));

        // 만약 업데이트할 아이템을 못 찾았고, provisional 플래그가 같은 ID를 가리킨다면, 지금 바로 제목과 함께 추가
        if (
          !itemUpdated &&
          quoteIdForProvisionalTitle === quoteIdForTitleUpdate
        ) {
          const newNavItem: NavigationItemData = {
            id: targetItemId,
            name: firstMessage,
            status: '진행',
          };
          const todaySectionTitle = t.navigation?.period?.today || '오늘';
          const todaySectionIndex = newItems.findIndex(
            (group) => group.title === todaySectionTitle
          );

          const alreadyExists = newItems.some((g) =>
            g.items.some((i) => i.id === targetItemId)
          );
          if (!alreadyExists) {
            if (todaySectionIndex > -1) {
              newItems[todaySectionIndex] = {
                ...newItems[todaySectionIndex],
                items: [newNavItem, ...newItems[todaySectionIndex].items],
              };
            } else {
              newItems = [
                { title: todaySectionTitle, items: [newNavItem] },
                ...newItems,
              ];
            }
            provisionalItemAddedOrFound = true; // 제목과 함께 추가되었으므로, 별도의 "제작중" 항목 추가 불필요
          }
        }
        localStorage.removeItem(`firstUserMessageFor_${quoteIdForTitleUpdate}`);
        localStorage.removeItem('updateQuoteTitleFor');
        if (quoteIdForProvisionalTitle === quoteIdForTitleUpdate) {
          localStorage.removeItem('addProvisionalQuoteTitleFor');
        }
      }

      // 2. "맞춤 견적 제작중..." 항목 추가 (위에서 제목과 함께 바로 추가되지 않은 경우에만)
      if (quoteIdForProvisionalTitle && !provisionalItemAddedOrFound) {
        const targetItemId = `quote_${quoteIdForProvisionalTitle}`;
        const alreadyExists = newItems.some((g) =>
          g.items.some((i) => i.id === targetItemId)
        );

        if (!alreadyExists) {
          const newNavItemName =
            t.navigation?.customEstimateInProgress || '맞춤 견적 제작중...';
          const newNavItem: NavigationItemData = {
            id: targetItemId,
            name: newNavItemName,
            status: '진행',
          };
          const todaySectionTitle = t.navigation?.period?.today || '오늘';
          const todaySectionIndex = newItems.findIndex(
            (group) => group.title === todaySectionTitle
          );

          if (todaySectionIndex > -1) {
            newItems[todaySectionIndex] = {
              ...newItems[todaySectionIndex],
              items: [newNavItem, ...newItems[todaySectionIndex].items],
            };
          } else {
            newItems = [
              { title: todaySectionTitle, items: [newNavItem] },
              ...newItems,
            ];
          }
        }
        // updateQuoteTitleFor 플래그가 이 ID를 가리키고 있지 않다면, addProvisionalQuoteTitleFor를 제거
        // (위에서 이미 firstMessage와 함께 처리된 경우를 제외하기 위함)
        if (quoteIdForTitleUpdate !== quoteIdForProvisionalTitle) {
          localStorage.removeItem('addProvisionalQuoteTitleFor');
        }
      }
      return newItems;
    });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]); // lang이 바뀌면 t가 바뀌므로 의존성 추가

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleEditClick = () => {
    const newQuoteSessionId = Date.now().toString();
    // currentQuoteId는 현재 세션을 식별하는 용도로 계속 사용 가능 (AiPageContent에서 읽을 수 있도록)
    localStorage.setItem('currentQuoteId', newQuoteSessionId);
    // "맞춤 견적 제작중..." 상태를 표시하기 위한 플래그
    localStorage.setItem('addProvisionalQuoteTitleFor', newQuoteSessionId);
    // 아직 사용자 첫 메시지가 없으므로 updateQuoteTitleFor 관련 플래그는 여기서는 설정 안 함
    window.location.href = `/ai?sessionId=${newQuoteSessionId}`;
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
            <EditButton onClick={handleEditClick}>
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
          navigationItems={currentNavigationItems}
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
