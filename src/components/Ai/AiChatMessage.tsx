"use client";

import styled, { css } from "styled-components";
import { AppColors } from "@/styles/colors";
import { AppTextStyles } from "@/styles/textStyles";
import ReactMarkdown, { Options } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

// Message 인터페이스 export 추가
export interface Message {
  id: number;
  sender: "user" | "ai";
  text: string;
}

interface MessageProps extends Omit<Message, "id"> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onActionClick: (action: string, data?: Record<string, any>) => void;
}

interface StyledComponentProps {
  $sender: "user" | "ai";
}

const TableStyles = css`
  width: 100%;
  border: none;
  border-spacing: 0;
  margin-top: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  table-layout: fixed;
  word-wrap: break-word;

  th,
  td {
    border: none;
    padding: 5px 8px;
    vertical-align: middle;
    border: none;
  }

  tr:first-child th,
  tr:first-child td {
    border: none;
  }
  tr:last-child td {
    border: none;
  }
  th:first-child,
  td:first-child {
    border: none;
  }
  th:last-child,
  td:last-child {
    border: none;
  }

  thead {
    background-color: #1e1e2d;
    th {
      color: ${AppColors.onBackground};
      text-align: left;
      font-weight: 400;
      padding: 10px 8px;

      &:nth-child(1) {
        width: 18%;
      }
      &:nth-child(2) {
        width: 20%;
      }
      &:nth-child(3) {
        width: 32%;
      }
      &:nth-child(4) {
        width: 15%;
        min-width: 95px;
        text-align: center;
      }
      &:nth-child(5) {
        width: 20%;
      }
      &:nth-child(6) {
        width: 15%;
        text-align: center;
      }
    }
  }

  tbody {
    tr {
      background-color: #111119;
      &:nth-child(even) {
        background-color: #1e1e2d;
      }
    }
    td {
      color: ${AppColors.onBackground};
      &:nth-child(4) {
        text-align: right;
      }
    }

    tr:last-child {
      background-color: transparent;
      border-top: 1px solid ${AppColors.border};
      td {
        border-bottom: none;
      }
      td:first-child {
        font-weight: bold;
      }
      td:nth-child(4) {
        font-weight: bold;
        text-align: right;
        padding-right: 8px;
      }
    }

    td:last-child {
      text-align: center;
    }
  }
`;

const StyledMarkdownContainer = styled.div`
  table {
    ${TableStyles}
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid ${AppColors.border};
    font-weight: 300;

    td button {
      background-color: ${AppColors.onBackgroundGray};
      color: #ffffff;
      border: none;
      padding: 0.3rem 0.9rem;
      border-radius: 10px;
      cursor: pointer;
      font-size: 0.8rem;
      transition: background-color 0.2s;

      &:hover {
        background-color: ${AppColors.primary};
      }
    }
  }
  //에이닷 텍스트 크기
  p {
    margin-bottom: 0.5rem;
    font-weight: 300;
  }

  strong {
    font-weight: 400;
  }
`;

const MessageWrapper = styled.div<StyledComponentProps>`
  display: flex;
  width: 100%;
  margin-bottom: 1rem;

  justify-content: ${(props) => (props.$sender === "user" ? "flex-end" : "flex-start")};
`;

const MessageBox = styled.div<StyledComponentProps>`
  max-width: 75%;
  padding: 0.3rem 1rem;
  border-radius: 12px;
  ${AppTextStyles.body1}
  line-height: 1.7;
  letter-spacing: normal;

  ${(props) =>
    props.$sender === "user"
      ? css`
          background-color: ${AppColors.primary};
          color: ${AppColors.onPrimary};
          border-bottom-right-radius: 0;
          white-space: pre-wrap;
          padding: 0.75rem 1rem;
        `
      : css`
          background-color: ${AppColors.background};
          color: ${AppColors.onBackground};
        `};
`;

const ProfileImage = styled.img`
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 0.75rem;
  align-self: flex-start;
`;

const ProfileName = styled.p`
  font-size: 20px;
  color: ${AppColors.onBackground};
  font-weight: bold;
  margin: 0;
`;

// --- 새 버튼 스타일 컴포넌트 정의 ---
const StyledActionButton = styled.button`
  background-color: ${AppColors.onBackgroundGray};
  color: white;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  margin-left: 0.5rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${AppColors.primary};
  }
`;
// -------------------------------------

// button 렌더러 props 타입 정의 (unknown 사용)
type ButtonRendererProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  node?: unknown;
};

export function AiChatMessage({ sender, text, onActionClick }: MessageProps) {
  const isAiMessage = sender === "ai";

  const customComponents: Options["components"] = {
    button: ({ node, ...props }: ButtonRendererProps) => {
      let action: string | undefined;
      let featureId: string | undefined;
      let buttonText: string = "Button";

      // 타입 가드 및 속성 접근
      if (typeof node === "object" && node !== null) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        action = (node as any).properties?.["data-action"];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        featureId = (node as any).properties?.["data-feature-id"];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        buttonText = (node as any).children?.[0]?.value || "Button";
      }

      if (action) {
        // StyledActionButton 사용
        return (
          <StyledActionButton onClick={() => onActionClick(action, { featureId })} {...props}>
            {buttonText}
          </StyledActionButton>
        );
      }
      // 기본 버튼 (스타일 없는) 또는 StyledActionButton 중 선택
      // 여기서는 일관성을 위해 data-action 없는 버튼도 Styled 적용 (클릭 액션은 없음)
      return <StyledActionButton {...props}>{buttonText}</StyledActionButton>;
    },
  };

  return (
    <MessageWrapper $sender={sender}>
      {sender === "ai" && <ProfileImage src="/pretty.png" alt="AI 프로필" />}
      <MessageBox $sender={sender}>
        {isAiMessage ? (
          <StyledMarkdownContainer>
            <ProfileName>
              <strong>AIGO - 에이고</strong>
            </ProfileName>
            <ReactMarkdown components={customComponents} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {text}
            </ReactMarkdown>
          </StyledMarkdownContainer>
        ) : (
          text
        )}
      </MessageBox>
    </MessageWrapper>
  );
}
