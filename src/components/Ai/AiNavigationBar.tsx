import { useState } from "react";
import styled from "styled-components";
import { ProfileDataContainer } from "@/components/ProfileDataContainer";
import ButtonElement from "@/elements/ButtonElement";
import { Edit, Search } from "@mui/icons-material";
import { AppColors } from "../../styles/colors";
import { AppTextStyles } from "@/styles/textStyles";
import useAuthStore from "@/store/authStore";

interface NavigationItem {
  title: string;
  items: {
    name: string;
    status: "진행" | "완료";
  }[];
}

interface AiNavigationBarProps {
  navigationItems: NavigationItem[];
}

const BlurredOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
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
  margin-bottom: 24px;
  line-height: 1.6;
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

const AiNavigationBar = ({ navigationItems }: AiNavigationBarProps) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    navigationItems.reduce((acc, item) => ({ ...acc, [item.title]: true }), {})
  );

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const openLoginModal = useAuthStore((state) => state.openLoginModal);

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  if (!isLoggedIn) {
    return (
      <Container>
        <Sidebar>
          <BlurredOverlay>
            <LoginPromptText>
              로그인 시, <br />
              저장된 대화기록을 <br />
              불러올 수 있습니다.
            </LoginPromptText>
            <CenteredLoginButton onClick={openLoginModal} isRounded={false}>
              Login
            </CenteredLoginButton>
          </BlurredOverlay>
        </Sidebar>
      </Container>
    );
  }

  return (
    <Container>
      <Sidebar>
        {/* 프로필 섹션 */}
        <ProfileSection>
          <ProfileDataContainer
            message="success"
            successChild={
              <>
                <ProfileInfo>
                  <Flex>
                    <Avatar />
                    <Username>홍길동님</Username>
                  </Flex>
                  <ProfileActions>
                    <ProfileIconButton variant="text" size="small">
                      <Edit sx={{ color: AppColors.iconPrimary, fontSize: "1.5rem" }} />
                    </ProfileIconButton>
                    <ProfileIconButton variant="text" size="small">
                      <Search sx={{ color: AppColors.iconPrimary, fontSize: "1.5rem" }} />
                    </ProfileIconButton>
                  </ProfileActions>
                </ProfileInfo>
              </>
            }
          />
        </ProfileSection>

        {/* 네비게이션 아이템 섹션 */}
        <NavigationContent>
          {navigationItems.map((period, index) => (
            <NavigationSection key={index}>
              <SectionHeader onClick={() => toggleSection(period.title)}>
                <SectionTitle>{period.title}</SectionTitle>
                <SectionContent>
                  여기닷에게
                  {/* {expandedSections[period.title] ? <ExpandLess /> : <ExpandMore />} */}
                </SectionContent>
              </SectionHeader>

              {expandedSections[period.title] && (
                <ItemList>
                  {period.items.map((item, itemIndex) => (
                    <NavigationItem key={itemIndex}>
                      <ItemText>{item.name}</ItemText>
                      <NavigationStatusButton size="small" isRounded>
                        견적 요청
                      </NavigationStatusButton>
                    </NavigationItem>
                  ))}
                </ItemList>
              )}
            </NavigationSection>
          ))}
        </NavigationContent>

        {/* 로그아웃 버튼 */}
        <LogoutButtonContainer>
          <NavigationStatusButton size="small" isRounded>
            로그아웃
          </NavigationStatusButton>
        </LogoutButtonContainer>
      </Sidebar>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f8f9fa;
  position: relative;
`;

const Sidebar = styled.div`
  width: 300px;
  background-color: #1a1b1e;
  color: white;
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
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
  /* 스크롤바 스타일 */
  &::-webkit-scrollbar {
    width: 8px; /* 스크롤바 너비 */
  }

  &::-webkit-scrollbar-track {
    background: #1a1b1e; /* 스크롤바 트랙 배경색 (Sidebar 배경색과 동일하게) */
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${AppColors.scroll}; /* 스크롤바 색상 */
    border-radius: 4px;
    border: 2px solid #1a1b1e; /* 트랙 배경색과 동일한 테두리를 주어 약간의 여백 효과 */
  }

  /* Firefox 스크롤바 스타일 (선택 사항) */
  scrollbar-width: thin; /* "auto" 또는 "thin" */
  scrollbar-color: ${AppColors.scroll} #1a1b1e; /* thumb color track color */
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

export default AiNavigationBar;
