"use client";

import styled from "styled-components";
import { PhotoDataContainer } from "@/components/PhotoDataContainer";
import { ProfileDataContainer } from "@/components/ProfileDataContainer";
import { Edit, Search } from "@mui/icons-material";
import { AppColors } from "@/styles/colors";
import { TestContext } from "node:test";
import { AppTextStyles } from "../../styles/textStyles";

// 선택 옵션 인터페이스
interface SelectOption {
  id: string;
  label: string;
}

// 시간 옵션
const TIME_OPTIONS: SelectOption[] = [
  { id: "pc", label: "PC" },
  { id: "mobile", label: "모바일" },
  { id: "AOS", label: "AOS" },
  { id: "IOS", label: "IOS" },
  { id: "Windows", label: "Windows" },
];

export default function AIPage() {
  return (
    <Container>
      {/* 메인 컨텐츠 */}
      <MainContent>
        {/* 기존 사이드바는 AiNavigationBar.tsx로 이동했으므로 여기서는 중앙 컨텐츠만 표시 */}
        <ChatContainer>
          <ChatContent>
            <CenterContent>
              <FlexContainer>
                <ProfileImage src="/pretty.png" alt="사용자 프로필" />
                <AIContent>
                  <Title>여기닷 AI</Title>
                  <Subtitle>안녕하세요, AI 견적서 ㅇㅇㅇ입니다. 제작을 원하시는 카테고리를 선택해주세요.</Subtitle>

                  <MainSectionTitle>중복 선택</MainSectionTitle>

                  <TimeOptions>
                    {TIME_OPTIONS.map((option) => (
                      <TimeOption key={option.id}>
                        <span className="mr-2">+</span>
                        {option.label}
                      </TimeOption>
                    ))}
                  </TimeOptions>

                  <ButtonGroup>
                    <Button variant="secondary">이전</Button>
                    <Button variant="primary">다음</Button>
                  </ButtonGroup>

                  <InfoList>
                    • AI 견적서는 90%의 정확도를 가지고 있습니다. <br /> 확정 견적 문의는 &apos;여기닷&apos;으로
                    견적요청 바랍니다.
                  </InfoList>
                </AIContent>
              </FlexContainer>
            </CenterContent>
          </ChatContent>

          {/* 메시지 입력창 */}
          <MessageInput>
            <InputContainer>
              <button className="text-gray-400">img</button>
              <Input type="text" placeholder="기초자료 조사는 입력이 불가합니다." disabled />
              <button className="text-gray-400"></button>
            </InputContainer>
          </MessageInput>
        </ChatContainer>
      </MainContent>
      <ProgressContainer>개별 대상 선택 </ProgressContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: black;
  color: white;
`;

const MainContent = styled.div`
  flex: 2;
  display: flex;
  height: 100vh;
  max-width: 1920px;
  margin: 0 auto;
`;

const ProgressContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;
const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const FlexContainer = styled.div`
  display: flex;
`;

const ChatContent = styled.div`
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CenterContent = styled.div`
  text-align: center;
  width: 100%;
  max-width: 42rem;
`;

const AIContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  text-align: left;
`;

const ProfileImage = styled.img`
  height: 4rem;
  width: 4rem;
  object-fit: cover;
  margin-right: 40px;
  margin-top: 20px;
`;

const Title = styled.p`
  margin-bottom: 0;
  padding-bottom: 0;
  ${AppTextStyles.title2}
  color: ${AppColors.onBackground};
`;

const Subtitle = styled.p`
  color: #9ca3af;
  margin-bottom: 2rem;
`;

const MainSectionTitle = styled.h3`
  font-size: 1.125rem;
  margin-bottom: 1rem;
`;

const InfoList = styled.div`
  color: ${AppColors.onBackground};
  font-size: 0.875rem;
  text-align: left;
  white-space: pre-wrap;
  width: 100%;
  border-top: 1px solid ${AppColors.border};
  padding-top: 1rem;
`;

const TimeOptions = styled.div`
  ${AppTextStyles.caption1}
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const TimeOption = styled.button`
  ${AppTextStyles.body2}
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: ${AppColors.backgroundDark};
  border: 1px solid ${AppColors.border};
  border-radius: 0.375rem;
  transition: background-color 0.2s;
  color: ${AppColors.iconDisabled};

  &:hover {
    background-color: #1f2937;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  width: 100%;
  justify-content: end;
  gap: 1rem;
  margin-bottom: 3rem;
`;

const Button = styled.button<{ variant?: "primary" | "secondary" }>`
  padding: 0.5rem 1.5rem;
  border-radius: 0.375rem;
  border: none;
  background-color: ${(props) => (props.variant === "primary" ? AppColors.primary : AppColors.disabled)};
  color: white;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => (props.variant === "primary" ? "#1d4ed8" : "#4b5563")};
  }
`;

const MessageInput = styled.div`
  padding: 1rem;
  border-top: 1px solid #1f2937;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #1f2937;
  border-radius: 9999px;
  padding: 0.75rem 1rem;
  max-width: 48rem;
  margin: 0 auto;
`;

const Input = styled.input`
  flex: 1;
  background-color: transparent;
  border: none;
  outline: none;
  color: #e5e7eb;

  &::placeholder {
    color: #9ca3af;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;
