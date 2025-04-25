"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import styled from "styled-components";
import { Edit, Search } from "@mui/icons-material";
import PageLoader from "@/components/PageLoader";
import DataContainer from "@/components/DataContainer";
import { PhotoDataContainer } from "@/components/PhotoDataContainer";
import { ProfileDataContainer } from "@/components/ProfileDataContainer";
import { TextField } from "@/components/TextField";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

interface ConversationDetails {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

// 임시 더미 데이터 - 견적서 기간별 목록
const DUMMY_CONVERSATIONS = [
  {
    id: "1",
    title: "오늘",
    items: ["전산개발 견적", "IoT 앱 견적", "쇼핑 어플 견적 문의"],
  },
  {
    id: "2",
    title: "일주일 전",
    items: ["전산개발 견적", "IoT 앱 견적", "쇼핑 어플 견적 문의"],
  },
  {
    id: "3",
    title: "3월",
    items: ["전산개발 견적", "IoT 앱 견적", "쇼핑 어플 견적 문의"],
  },
];

// 임시 대화 상세 데이터
const DUMMY_CONVERSATION: ConversationDetails = {
  id: "1",
  title: "전산개발 견적",
  createdAt: new Date(),
  messages: [
    {
      id: "1",
      role: "user",
      content: "전산개발 견적이 필요합니다.",
      createdAt: new Date(Date.now() - 3600000),
    },
    {
      id: "2",
      role: "assistant",
      content: "네, 전산개발 견적 작성을 도와드리겠습니다. 어떤 종류의 개발을 계획하고 계신가요?",
      createdAt: new Date(Date.now() - 3500000),
    },
    {
      id: "3",
      role: "user",
      content: "웹사이트 개발과 앱 개발을 같이 진행하려고 합니다.",
      createdAt: new Date(Date.now() - 3400000),
    },
    {
      id: "4",
      role: "assistant",
      content:
        "웹사이트와 앱 개발을 함께 진행하는 프로젝트군요. 견적을 구체화하기 위해 몇 가지 정보가 더 필요합니다. 원하시는 개발 기간과 주요 기능들을 알려주시겠어요?",
      createdAt: new Date(Date.now() - 3300000),
    },
  ],
};

export default function ConversationPage({ params }: { params: { conversationId: string } }) {
  const router = useRouter();
  const [conversation, setConversation] = useState<ConversationDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // 임시로 더미 데이터를 사용
    setTimeout(() => {
      setConversation(DUMMY_CONVERSATION);
      setIsLoading(false);
    }, 500);

    // conversationId를 사용하는 예시 (실제 구현시 활용)
    console.log("Loading conversation ID:", params.conversationId);
  }, [params.conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);

    // 임시로 메시지 추가
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: newMessage,
      createdAt: new Date(),
    };

    setConversation((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        messages: [...prev.messages, newUserMessage],
      };
    });

    setNewMessage("");

    // AI 응답 시뮬레이션
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "죄송합니다. 현재 데모 버전이라 실제 응답을 할 수 없습니다.",
        createdAt: new Date(),
      };

      setConversation((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [...prev.messages, aiMessage],
        };
      });

      setIsSending(false);
    }, 1000);
  };

  return (
    <>
      <Head>
        <title>{conversation?.title || "Loading..."} | Heredot</title>
        <meta name="description" content="AI 견적서 상세 내역" />
      </Head>

      <PageLoader isOpen={isLoading} />

      <DataContainer
        message={conversation ? "success" : "no data"}
        successChild={
          <Container>
            <Header>
              <UserProfile>
                <PhotoDataContainer
                  message="success"
                  successChild={
                    <AvatarWrapper>
                      <img src="/pretty.png" alt="사용자 프로필" className="h-full w-full object-cover" />
                    </AvatarWrapper>
                  }
                />
                <ProfileDataContainer
                  message="success"
                  successChild={
                    <ProfileInfo>
                      <Username>홍길동님</Username>
                      <div className="profile-buttons">
                        <IconButton>
                          <Edit />
                        </IconButton>
                        <IconButton>
                          <Search />
                        </IconButton>
                      </div>
                    </ProfileInfo>
                  }
                />
              </UserProfile>
              <LogoutButton>Logout</LogoutButton>
            </Header>

            <MainContent>
              <Sidebar>
                {DUMMY_CONVERSATIONS.map((period) => (
                  <div key={period.id}>
                    <SidebarTitle>{period.title}</SidebarTitle>
                    <ConversationList>
                      {period.items.map((item, idx) => (
                        <ConversationButton
                          key={idx}
                          isActive={idx === 0 && period.id === "1"}
                          onClick={() => router.push(`/ai/${period.id}`)}>
                          <span>{item}</span>
                          <Badge>견적 요청</Badge>
                        </ConversationButton>
                      ))}
                    </ConversationList>
                  </div>
                ))}
              </Sidebar>

              <ChatContainer>
                <MessagesContainer>
                  <MessageList>
                    {conversation?.messages.map((message) => (
                      <MessageWrapper key={message.id} isUser={message.role === "user"}>
                        <MessageAvatar isUser={message.role === "user"}>
                          {message.role === "user" && (
                            <PhotoDataContainer
                              message="success"
                              successChild={
                                <img
                                  src="/pretty.png"
                                  alt="사용자 프로필"
                                  className="h-8 w-8 object-cover rounded-full"
                                />
                              }
                            />
                          )}
                        </MessageAvatar>
                        <MessageBubble isUser={message.role === "user"}>
                          <p>{message.content}</p>
                          <MessageTime isUser={message.role === "user"}>
                            {new Date(message.createdAt).toLocaleTimeString()}
                          </MessageTime>
                        </MessageBubble>
                      </MessageWrapper>
                    ))}
                    <div ref={messagesEndRef} />
                  </MessageList>
                </MessagesContainer>

                <MessageInput onSubmit={handleSendMessage}>
                  <InputContainer>
                    <button type="button" className="text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                      </svg>
                    </button>
                    <TextField
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="메시지를 입력하세요..."
                      type="text"
                      radius="9999px"
                      height="2.5rem"
                      padding="0.5rem 1rem"
                    />
                    <SendButton type="submit" disabled={isSending} isSending={isSending}>
                      {isSending ? (
                        <svg
                          className="animate-spin h-6 w-6"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                      )}
                    </SendButton>
                  </InputContainer>
                </MessageInput>
              </ChatContainer>
            </MainContent>
          </Container>
        }
        noDataChild={
          <EmptyStateContainer>
            <EmptyStateText>존재하지 않는 대화입니다.</EmptyStateText>
          </EmptyStateContainer>
        }
      />
    </>
  );
}

const Container = styled.div`
  min-height: 100vh;
  background-color: black;
  color: white;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #1f2937;
  max-width: 1920px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 0.75rem;
  }
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 640px) {
    .profile-buttons {
      display: none;
    }
  }
`;

const AvatarWrapper = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  overflow: hidden;
  background-color: #4b5563;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 0.75rem;
`;

const Username = styled.span`
  font-size: 1.125rem;
  font-weight: 500;

  @media (max-width: 640px) {
    font-size: 1rem;
  }
`;

const IconButton = styled.button`
  margin-left: 1rem;
  color: #9ca3af;
`;

const LogoutButton = styled.button`
  background-color: white;
  color: black;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e5e7eb;
  }

  @media (max-width: 640px) {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
  }
`;

const MainContent = styled.div`
  display: flex;
  height: calc(100vh - 72px);
  max-width: 1920px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.div`
  width: 16rem;
  border-right: 1px solid #1f2937;
  overflow-y: auto;

  @media (max-width: 1024px) {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #1f2937;
    max-height: 200px;
  }

  @media (max-width: 640px) {
    max-height: 150px;
  }
`;

const SidebarTitle = styled.h3`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #9ca3af;
`;

const ConversationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ConversationButton = styled.button<{ isActive?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  text-align: left;
  background-color: ${(props) => (props.isActive ? "#1e293b" : "transparent")};

  &:hover {
    background-color: #1f2937;
  }
`;

const Badge = styled.span`
  margin-left: 0.5rem;
  padding: 0.125rem 0.5rem;
  background-color: #374151;
  font-size: 0.75rem;
  border-radius: 0.25rem;
`;

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;

  @media (max-width: 640px) {
    padding: 1rem;
  }
`;

const MessageList = styled.div`
  max-width: 48rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const MessageWrapper = styled.div<{ isUser?: boolean }>`
  display: flex;
  justify-content: ${(props) => (props.isUser ? "flex-end" : "flex-start")};
  align-items: flex-start;
  gap: 0.5rem;
`;

const MessageAvatar = styled.div<{ isUser?: boolean }>`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: ${(props) => (props.isUser ? "#3b82f6" : "#4b5563")};
  display: flex;
  align-items: center;
  justify-content: center;
  order: ${(props) => (props.isUser ? 1 : 0)};
`;

const MessageBubble = styled.div<{ isUser?: boolean }>`
  max-width: 70%;
  padding: 1rem;
  border-radius: 0.75rem;
  background-color: ${(props) => (props.isUser ? "#3b82f6" : "#1f2937")};
  color: white;
`;

const MessageTime = styled.div<{ isUser?: boolean }>`
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: ${(props) => (props.isUser ? "#bfdbfe" : "#9ca3af")};
`;

const MessageInput = styled.form`
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

const SendButton = styled.button<{ isSending?: boolean }>`
  color: #9ca3af;
  opacity: ${(props) => (props.isSending ? 0.5 : 1)};
  transition: color 0.2s;

  &:not(:disabled):hover {
    color: #3b82f6;
  }
`;

const EmptyStateContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: black;
  color: white;
`;

const EmptyStateText = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
`;
