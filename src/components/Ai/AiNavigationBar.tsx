import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ProfileDataContainer } from '@/components/ProfileDataContainer';
import ButtonElement from '@/elements/ButtonElement';
import {
  Edit,
  Search,
  ChevronRight,
  ChevronLeft,
  Logout,
} from '@mui/icons-material';
import { AppColors } from '../../styles/colors';
import { AppTextStyles } from '@/styles/textStyles';
import useAuthStore from '@/store/authStore';
import { useLang } from '@/contexts/LangContext';
import { aiChatDictionary } from '@/lib/i18n/aiChat';
import { ChatDictionary } from '@/app/ai/components/StepData';

interface NavigationItemData {
  name: string;
  status: string;
}

interface NavigationGroup {
  title: string;
  items: NavigationItemData[];
}

interface AiNavigationBarProps {
  navigationItems: NavigationGroup[];
  isMobile?: boolean;
  isSidebarOpen?: boolean;
  toggleSidebar?: () => void;
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
  align-items: center;
  gap: 8px;
`;

const ProfileIconButton = styled(ButtonElement)`
  width: 30px;
  height: 30px;
  min-width: 30px;
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
`;

const NavigationStatusButton = styled(ButtonElement)`
  background-color: ${AppColors.onBackgroundGray};
  color: ${AppColors.onPrimary};
  border-radius: 10px;
  font-size: 14px;
  font-weight: 400;
  display: flex;
  align-items: center;

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
  navigationItems,
  isMobile = false,
  isSidebarOpen = false,
  toggleSidebar = () => {},
}: AiNavigationBarProps) => {
  const { lang } = useLang();
  const t = aiChatDictionary[lang] as ChatDictionary;

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const openLoginModal = useAuthStore((state) => state.openLoginModal);
  const user = useAuthStore((state) => state.user);

  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const swipeThreshold = 50;

  useEffect(() => {
    if (!isLoggedIn) {
      const allSectionTitles = navigationItems.reduce((acc, item) => {
        acc[item.title] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setExpandedSections(allSectionTitles);
    } else {
      const todayTitle =
        navigationItems.find((item) => item.title === t.navigation.period.today)
          ?.title ||
        navigationItems[0]?.title ||
        '오늘';
      setExpandedSections({ [todayTitle]: true });
    }
  }, [isLoggedIn, navigationItems, t.navigation.period.today]);

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
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

  const renderSidebarContent = () => {
    return (
      <>
        <ProfileSection>
          {isLoggedIn ? (
            <ProfileDataContainer
              message="success"
              successChild={
                <>
                  <ProfileInfo>
                    <Flex>
                      {user?.profileUrl ? (
                        <UserAvatar
                          src={user.profileUrl}
                          alt={user.name || t.commonUser}
                        />
                      ) : (
                        <Avatar />
                      )}
                      <Username>
                        {user?.name ? `${user.name}님` : t.commonUser}
                      </Username>
                    </Flex>
                    <ProfileActions>
                      <ProfileIconButton
                        variant="text"
                        size="small"
                        onClick={() => (window.location.href = '/ai')}
                      >
                        <Edit
                          sx={{
                            color: AppColors.iconPrimary,
                            fontSize: '1.5rem',
                          }}
                        />
                      </ProfileIconButton>
                      <ProfileIconButton variant="text" size="small">
                        <Search
                          sx={{
                            color: AppColors.iconPrimary,
                            fontSize: '1.5rem',
                          }}
                        />
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
                <Username>{t.commonUser}</Username>
              </Flex>
              <ProfileActions>
                <ProfileIconButton
                  variant="text"
                  size="small"
                  onClick={() => (window.location.href = '/ai')}
                >
                  <Edit
                    sx={{ color: AppColors.iconPrimary, fontSize: '1.5rem' }}
                  />
                </ProfileIconButton>
                <ProfileIconButton variant="text" size="small">
                  <Search
                    sx={{ color: AppColors.iconPrimary, fontSize: '1.5rem' }}
                  />
                </ProfileIconButton>
              </ProfileActions>
            </ProfileInfo>
          )}
        </ProfileSection>

        <NavigationContent>
          {isLoggedIn
            ? (() => {
                const todayNavigationGroup = navigationItems.find(
                  (group) => group.title === t.navigation.period.today
                ) || { title: t.navigation.period.today, items: [] };
                const itemsToDisplay: NavigationItemData[] = [
                  {
                    name: t.navigation.customEstimateInProgress,
                    status: t.buttons.estimate,
                  },
                ];
                return (
                  <NavigationSection key={todayNavigationGroup.title}>
                    <SectionHeader
                      onClick={() => toggleSection(todayNavigationGroup.title)}
                    >
                      <SectionTitle>{todayNavigationGroup.title}</SectionTitle>
                      <SectionContent>{t.navigation.estimate}</SectionContent>
                    </SectionHeader>
                    {expandedSections[todayNavigationGroup.title] && (
                      <ItemList>
                        {itemsToDisplay.map((item, itemIndex) => (
                          <NavigationItem key={itemIndex}>
                            <ItemText>{item.name}</ItemText>
                            {item.status && (
                              <NavigationStatusButton size="small" isRounded>
                                {item.status}
                              </NavigationStatusButton>
                            )}
                          </NavigationItem>
                        ))}
                      </ItemList>
                    )}
                  </NavigationSection>
                );
              })()
            : navigationItems.map((period, index) => {
                let periodTitle = period.title;
                if (period.title === '오늘')
                  periodTitle = t.navigation.period.today;
                else if (period.title === '일주일 전')
                  periodTitle = t.navigation.period.lastWeek;
                else if (period.title === '3월')
                  periodTitle = t.navigation.period.month;

                return (
                  <NavigationSection key={index}>
                    <SectionHeader onClick={() => toggleSection(period.title)}>
                      <SectionTitle>{periodTitle}</SectionTitle>
                      <SectionContent>{t.navigation.estimate}</SectionContent>
                    </SectionHeader>
                    {expandedSections[period.title] && (
                      <ItemList>
                        {period.items.map((item, itemIndex) => (
                          <NavigationItem key={itemIndex}>
                            <ItemText>{item.name}</ItemText>
                            {item.status && (
                              <NavigationStatusButton size="small" isRounded>
                                {item.status}
                              </NavigationStatusButton>
                            )}
                          </NavigationItem>
                        ))}
                      </ItemList>
                    )}
                  </NavigationSection>
                );
              })}
        </NavigationContent>

        <LogoutButtonContainer>
          {isLoggedIn ? (
            <NavigationStatusButton
              size="small"
              isRounded
              onClick={() => useAuthStore.getState().logout()}
            >
              <Logout
                fontSize="small"
                style={{
                  marginRight: '8px',
                  verticalAlign: 'middle',
                  fontSize: '18px',
                }}
              />
              {t.buttons.logout}
            </NavigationStatusButton>
          ) : null}
        </LogoutButtonContainer>

        {!isLoggedIn && (
          <BlurredOverlay>
            <LoginPromptText>{t.navigation.login.benefits}</LoginPromptText>
            <CenteredLoginButton onClick={openLoginModal} isRounded={false}>
              {t.buttons.login}
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
          <SidebarToggleButton onClick={toggleSidebar}>
            {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
          </SidebarToggleButton>
        )}
        {isSidebarOpen && renderSidebarContent()}
      </Sidebar>
    </Container>
  );
};

export default AiNavigationBar;
