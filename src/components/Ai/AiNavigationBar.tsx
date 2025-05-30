'use client'; // 클라이언트 컴포넌트임을 명시

import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ProfileDataContainer } from '@/components/ProfileDataContainer';
import ButtonElement from '@/elements/ButtonElement';
import {
  Edit,
  ChevronRight,
  ChevronLeft,
  Logout,
  BrokenImageOutlined,
} from '@mui/icons-material';
import { AppColors } from '../../styles/colors';
import { AppTextStyles } from '@/styles/textStyles';
import useAuthStore from '@/store/authStore';
import { useLang } from '@/contexts/LangContext';
import { aiChatDictionary } from '@/lib/i18n/aiChat';
import { EstimateRequestModal } from './EstimateRequestModal';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation'; // useRouter 임포트
import useSendInquireMessage from '../../hooks/Inquire/useSendInquireMessage';

// AiLayout에서 전달받는 NavigationItemData 및 NavigationGroup 인터페이스 재사용
interface NavigationItemData {
  id: string; // 세션 uuid 또는 index
  name: string; // 세션 title
  status: '진행' | '완료' | '추가중';
  sessionIndex?: number; // 세션 index 추가
}

interface NavigationGroup {
  title: string;
  items: NavigationItemData[];
}

interface AiNavigationBarProps {
  navigationItems?: NavigationGroup[]; // AiLayout에서 가공된 데이터 받음
  isMobile?: boolean;
  isSidebarOpen?: boolean;
  toggleSidebar?: () => void;
  onAddNewEstimateRequest?: () => void; // 새 견적 요청 버튼 클릭 시 호출될 콜백
  onSessionClick?: (sessionIndex: number) => void; // 세션 아이템 클릭 시 호출될 콜백
}

const BlurredOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
`;

const LoginPromptText = styled.p`
  ${AppTextStyles.body1}
  font-size: 1.1rem;
  margin: 24px;
  line-height: 1.6;
  white-space: pre-line;
`;

const CenteredLoginButton = styled(ButtonElement)`
  background-color: ${AppColors.surface};
  color: ${AppColors.onSurface};
  padding: 12px 32px;
  font-size: 1.1rem;
  border-radius: 24px;
  font-weight: 600;

  &:hover:not(:disabled) {
    background-color: ${AppColors.primary};
    color: ${AppColors.onPrimary};
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: transparent;
  position: relative;
`;

const Sidebar = styled.div<{ $isOpen: boolean; $isMobile: boolean }>`
  width: ${(props) => (props.$isOpen ? '300px' : '0')};
  overflow: ${(props) => (props.$isOpen ? 'visible' : 'hidden')};
  background-color: #1a1b1e;
  color: white;
  display: flex;
  flex-direction: column;
  height: ${(props) => (props.$isMobile ? 'calc(100vh - 60px)' : '100vh')};
  position: relative;
  transition: width 0.3s ease;
  z-index: 100;

  @media (max-width: 770px) {
    position: fixed;
    top: 60px;
    left: 0;
    box-shadow: ${(props) =>
      props.$isOpen ? '0 0 15px rgba(0,0,0,0.2)' : 'none'};
  }
`;

const SidebarToggleButton = styled.button`
  position: absolute;
  right: -15px;
  top: 20px;
  width: 30px;
  height: 30px;
  background-color: #1a1b1e;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  z-index: 101;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ProfileSection = styled.div`
  padding: 40px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Avatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: white;
  margin-right: 0.75rem;
`;

const UserAvatar = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 0.75rem;
`;

const Username = styled.span`
  ${AppTextStyles.label1};
`;

const ProfileActions = styled.div`
  display: flex;

  // align-items: center;
  align-items: space-between;
  gap: 8px;
`;

const ProfileIconButton = styled(ButtonElement)`
  // width: 30px;
  height: 30px;
  // min-width: 30px;
  padding: 0;
  border-radius: 4px;
`;

const NavigationContent = styled.div`
  flex: 1;
  overflow-y: scroll;
  padding-top: 16px;
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #1a1b1e;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${AppColors.scroll};
    border-radius: 4px;
    border: 2px solid #1a1b1e;
  }

  scrollbar-width: thin;
  scrollbar-color: ${AppColors.scroll} #1a1b1e;
`;

const NavigationSection = styled.div`
  margin-bottom: 40px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 8px 4px;
  border-radius: 4px;

  padding: 16px 20px;
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

const SectionTitle = styled.h3`
  ${AppTextStyles.label3};
  color: ${AppColors.onBackground};
  margin: 0;
`;

const SectionContent = styled.div`
  ${AppTextStyles.label2};
  color: ${AppColors.onPrimaryGray};
  font-size: 14px;
  text-align: right;
  white-space: pre-line;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
  padding-left: 8px;
`;

const NavigationItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const ItemText = styled.span`
  ${AppTextStyles.body1};
  color: ${AppColors.onBackground};
  white-space: nowrap; // 텍스트가 한 줄로 표시되도록
  overflow: hidden; // 넘치는 부분 숨김
  text-overflow: ellipsis; // 넘치는 부분 ...으로 표시
  flex-grow: 1; // 텍스트가 공간을 최대한 차지하도록
  margin-right: 8px; // 버튼과의 간격
`;

const NavigationStatusButton = styled(ButtonElement)`
  background-color: ${AppColors.onBackgroundGray};
  color: ${AppColors.onPrimary};
  border-radius: 10px;
  font-size: 14px;
  font-weight: 400;
  display: flex;
  align-items: center;
  flex-shrink: 0; // 버튼이 줄어들지 않도록

  &:hover:not(:disabled) {
    background-color: ${AppColors.primary};
    color: ${AppColors.onPrimary};
  }
`;

const LogoutButtonContainer = styled.div`
  display: flex;
  padding: 16px;
  justify-content: end;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const AiNavigationBar = ({
  navigationItems, // AiLayout에서 가공된 세션 데이터를 받습니다.
  isMobile = false,
  isSidebarOpen = false,
  toggleSidebar = () => {},
  onAddNewEstimateRequest = () => {},
  onSessionClick = () => {},
}: AiNavigationBarProps) => {
  const router = useRouter(); // router 훅 사용
  const { lang } = useLang();
  const t = aiChatDictionary[lang] as any; // TODO: ChatDictionary 타입에 common, buttons.sending 등 추가 필요

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const openLoginModal = useAuthStore((state) => state.openLoginModal);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout); // logout 액션 가져오기
  const openEditProfileModal = useAuthStore(
    (state) => state.openEditProfileModal
  ); // 추가

  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  const [isEstimateModalOpen, setIsEstimateModalOpen] = useState(false);
  const [currentEstimateTitle, setCurrentEstimateTitle] = useState('');

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const swipeThreshold = 50;

  // 🚨 useSendInquireMessage 훅 사용
  const {
    sendInquireMessage,
    isLoading: isSendingInquire,
    error: inquireError,
  } = useSendInquireMessage();

  useEffect(() => {
    // 섹션 확장 상태 초기화: 로그인 상태에 따라 모든 섹션을 확장하거나 '오늘'만 확장
    const initialExpandedState: Record<string, boolean> = {};
    if (!isLoggedIn) {
      (navigationItems || []).forEach((group) => {
        initialExpandedState[group.title] = true;
      });
    } else {
      // 로그인 시 기본적으로 '오늘' 섹션만 열고 다른 섹션은 닫힌 상태로 시작
      (navigationItems || []).forEach((group) => {
        initialExpandedState[group.title] =
          group.title === (t.navigation?.period?.today || '오늘');
      });
    }
    setExpandedSections(initialExpandedState);
  }, [isLoggedIn, navigationItems, t.navigation?.period?.today]); // navigationItems가 변경될 때마다 재설정

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const handleOpenEstimateModal = (itemName: string) => {
    // 모달 타이틀을 현재 선택된 아이템의 이름으로 설정합니다.
    setCurrentEstimateTitle(itemName); // 🚨 item.name을 모달 타이틀로 사용
    setIsEstimateModalOpen(true);
  };

  // 🚨 견적 요청 API 호출 로직 추가
  const handleConfirmEstimate = async () => {
    const userName = user?.name || t.commonUser || '사용자';

    const payload = {
      name: userName,
      title: currentEstimateTitle,
    };

    const success = await sendInquireMessage(payload);

    if (success) {
      toast.info(
        t.common?.inquireSuccess || '문의 요청이 완료되었습니다.' // common이 optional이거나 없을 수 있음
      );
      setIsEstimateModalOpen(false);
    } else {
      toast.error(
        inquireError ||
          t.common?.inquireFail || // common이 optional이거나 없을 수 있음
          '문의 요청 중 오류가 발생했습니다.'
      );
    }
  };

  const handleCreateNewEstimateClick = () => {
    // AiLayout에서 props로 받은 콜백 함수 호출
    if (onAddNewEstimateRequest) {
      onAddNewEstimateRequest();
    }
  };

  const handleSessionItemClick = (sessionIndex: number) => {
    if (onSessionClick) {
      onSessionClick(sessionIndex);
    }
  };

  // ProfileInfo 클릭 시 EditProfileModal 열기
  const handleProfileInfoClick = () => {
    if (isLoggedIn) {
      openEditProfileModal();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile || !isSidebarOpen) return;
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile || !isSidebarOpen || touchStartX.current === null) return;
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (
      !isMobile ||
      !isSidebarOpen ||
      !touchStartX.current ||
      !touchEndX.current
    )
      return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > swipeThreshold) {
      if (toggleSidebar) {
        toggleSidebar();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const naviItems = [
    {
      title: "오늘",
      items: [
        {
          id: "item-1",
          name: "새로운 채팅",
          sessionIndex: 0,
        },
      ],
    },
  ];

  const renderSidebarContent = () => {
    return (
      <>
        <ProfileSection
          onClick={isLoggedIn ? handleProfileInfoClick : openLoginModal}
          style={{ cursor: 'pointer' }}
        >
          {isLoggedIn && user ? (
            <ProfileDataContainer
              message="success"
              successChild={
                <>
                  <ProfileInfo>
                    <Flex>
                      {user.profileUrl ? (
                        <UserAvatar
                          src={user.profileUrl}
                          alt={user.name || t.commonUser || '사용자'}
                        />
                      ) : (
                        <BrokenImageOutlined
                          sx={{
                            width: '2.5rem',
                            height: '2.5rem',
                            borderRadius: '50%',
                            color: AppColors.onSurfaceVariant,
                            marginRight: '0.75rem',
                          }}
                        />
                      )}
                      <Username>
                        {user.name
                          ? `${user.name}님`
                          : t.commonUser || '사용자'}
                      </Username>
                    </Flex>
                    <ProfileActions>
                      <ProfileIconButton
                        variant="text"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCreateNewEstimateClick();
                        }}
                        aria-label="New Estimate"
                      >
                        <Edit
                          sx={{
                            color: AppColors.iconPrimary,
                            fontSize: '1.5rem',
                          }}
                        />
                      </ProfileIconButton>
                      <ProfileIconButton
                        variant="text"
                        size="small"
                        onClick={(e) => e.stopPropagation()}
                        aria-label="Search Estimates"
                      >
                        <></>
                      </ProfileIconButton>
                    </ProfileActions>
                  </ProfileInfo>
                </>
              }
            />
          ) : (
            <ProfileInfo>
              <Flex>
                <Avatar />
                <Username>{t.commonUser || '사용자'}</Username>
              </Flex>
              <ProfileActions>
                <ProfileIconButton
                  variant="text"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    openLoginModal();
                  }}
                  aria-label="New Estimate"
                >
                  <Edit
                    sx={{ color: AppColors.iconPrimary, fontSize: '1.5rem' }}
                  />
                </ProfileIconButton>
                <ProfileIconButton
                  variant="text"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    openLoginModal();
                  }}
                  aria-label="Search Estimates"
                >
                  <></>
                </ProfileIconButton>
              </ProfileActions>
            </ProfileInfo>
          )}
        </ProfileSection>

        <NavigationContent>
          {/* API에서 받아온 navigationItems를 렌더링 */}
          {(navigationItems || naviItems).map((group) => (
            <NavigationSection key={group.title}>
              <SectionHeader onClick={() => toggleSection(group.title)}>
                <SectionTitle>{group.title}</SectionTitle>
                <SectionContent>
                  {t.navigation?.estimate || '여기닷에게'}
                </SectionContent>
              </SectionHeader>
              {true && (
                <ItemList>
                  {(group.items || []).map((item) => (
                    <NavigationItem
                      key={item.id}
                      onClick={() =>
                        item.sessionIndex !== undefined &&
                        handleSessionItemClick(item.sessionIndex)
                      }
                    >
                      <ItemText>{item.name}</ItemText>
                      <NavigationStatusButton
                        size="small"
                        isRounded
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEstimateModal(item.name);
                        }}
                        disabled={isSendingInquire}
                      >
                        {isSendingInquire
                          ? t.buttons?.sending || '전송중...' // buttons.sending이 optional이거나 없을 수 있음
                          : t.buttons?.estimate || '견적요청'}
                      </NavigationStatusButton>
                    </NavigationItem>
                  ))}
                </ItemList>
              )}
            </NavigationSection>
          ))}
        </NavigationContent>

        <LogoutButtonContainer>
          {isLoggedIn ? (
            <NavigationStatusButton
              size="small"
              isRounded
              onClick={() => logout(router)}
            >
              <Logout
                fontSize="small"
                style={{
                  marginRight: '8px',
                  verticalAlign: 'middle',
                  fontSize: '18px',
                }}
              />
              {t.buttons?.logout || '로그아웃'}
            </NavigationStatusButton>
          ) : null}
        </LogoutButtonContainer>

        {!isLoggedIn && (
          <BlurredOverlay>
            <LoginPromptText>
              {t.navigation?.login?.benefits ||
                '로그인하고 더 많은 기능을 사용해보세요.'}
            </LoginPromptText>
            <CenteredLoginButton onClick={openLoginModal} isRounded={false}>
              {t.buttons?.login || '로그인'}
            </CenteredLoginButton>
          </BlurredOverlay>
        )}
      </>
    );
  };

  return (
    <Container>
      <Sidebar
        $isOpen={isSidebarOpen}
        $isMobile={isMobile}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {isMobile && (
          <SidebarToggleButton
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
          </SidebarToggleButton>
        )}
        {/* 사이드바가 열려있을 때만 내용을 렌더링하여 불필요한 렌더링 방지 */}
        {isSidebarOpen && renderSidebarContent()}
      </Sidebar>
      <EstimateRequestModal
        $isOpen={isEstimateModalOpen}
        onClose={() => setIsEstimateModalOpen(false)}
        onConfirm={handleConfirmEstimate}
        title={currentEstimateTitle} // 모달에 제목 전달
      />
    </Container>
  );
};

export default AiNavigationBar;
