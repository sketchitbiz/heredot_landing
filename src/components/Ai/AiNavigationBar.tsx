import { useState } from 'react';
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
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLang } from '@/contexts/LangContext';
import { aiChatDictionary } from '@/lib/i18n/aiChat';

interface NavigationItem {
  title: string;
  items: {
    name: string;
    status: '진행' | '완료';
  }[];
}

interface AiNavigationBarProps {
  navigationItems: NavigationItem[];
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

const LanguageSwitcherWrapper = styled.div`
  margin-right: 8px;
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
  font-size: 16px;
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
  isSidebarOpen = true,
  toggleSidebar = () => {},
}: AiNavigationBarProps) => {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >(
    navigationItems.reduce((acc, item) => ({ ...acc, [item.title]: true }), {})
  );

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const openLoginModal = useAuthStore((state) => state.openLoginModal);
  const user = useAuthStore((state) => state.user);

  const { lang } = useLang();
  const t = aiChatDictionary[lang];

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const renderSidebarContent = () => (
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
                        alt={user.name || '사용자'}
                      />
                    ) : (
                      <Avatar />
                    )}
                    <Username>
                      {user?.name ? `${user.name}님` : '사용자'}
                    </Username>
                  </Flex>
                  <ProfileActions>
                    <LanguageSwitcherWrapper>
                      <LanguageSwitcher />
                    </LanguageSwitcherWrapper>
                    <ProfileIconButton variant="text" size="small">
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
              <Avatar>{/* 기본 프로필 아이콘 */}</Avatar>
              <Username>{t.navigation.login.required}</Username>
            </Flex>
            <ProfileActions>
              <LanguageSwitcherWrapper>
                <LanguageSwitcher />
              </LanguageSwitcherWrapper>
              <ProfileIconButton variant="text" size="small">
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
        {navigationItems.map((period, index) => {
          let periodTitle = period.title;
          if (period.title === '오늘') {
            periodTitle = t.navigation.period.today;
          } else if (period.title === '일주일 전') {
            periodTitle = t.navigation.period.lastWeek;
          } else if (period.title === '3월') {
            periodTitle = t.navigation.period.month;
          }

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
                      <NavigationStatusButton size="small" isRounded>
                        {t.buttons.estimate}
                      </NavigationStatusButton>
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
          <NavigationStatusButton size="small" isRounded>
            <Logout fontSize="small" style={{ marginRight: '4px' }} />
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

  return (
    <Container>
      <Sidebar $isOpen={isSidebarOpen} $isMobile={isMobile}>
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
