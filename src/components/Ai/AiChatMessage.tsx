"use client";

import styled, { css } from "styled-components";
import { AppColors } from "@/styles/colors";
import { AppTextStyles } from "@/styles/textStyles";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface MessageProps {
  sender: "user" | "ai";
  text: string;
}

interface StyledComponentProps {
  $sender: "user" | "ai";
}

const TableStyles = css`
  width: 100%;
  border: 1px solid ${AppColors.border};
  border-collapse: collapse;
  margin-top: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;

  th,
  td {
    border: 1px solid ${AppColors.border};
    padding: 5px;
    vertical-align: middle;
  }

  thead {
    background-color: ${AppColors.onSurfaceVariant};
    th {
      color: ${AppColors.onSurfaceVariant};
      font-weight: bold;
      text-align: left;
    }
  }

  tbody {
    tr {
      &:nth-child(even) {
        background-color: ${AppColors.onSurfaceVariant + "40"};
      }
      &:hover {
        background-color: ${AppColors.onSurfaceVariant + "80"};
      }
    }
    td {
      color: ${AppColors.onSurface};
    }

    tr:last-child {
      td {
        font-weight: bold;
      }
      td:first-child {
        text-align: right;
        padding-right: 1rem;
      }
      td:nth-last-child(3) {
        text-align: right;
        padding-right: 1rem;
      }
      td:nth-last-child(2),
      td:nth-last-child(1) {
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

    td button {
      background-color: ${AppColors.secondary};
      color: #ffffff;
      border: none;
      padding: 0.3rem 0.6rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.8rem;
      transition: background-color 0.2s;

      &:hover {
        background-color: ${AppColors.primary};
      }
    }
  }

  p {
    margin-bottom: 0.5rem;
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
  padding: 0.75rem 1rem;
  border-radius: 12px;
  ${AppTextStyles.body1}

  ${(props) =>
    props.$sender === "user"
      ? css`
          background-color: ${AppColors.primary};
          color: ${AppColors.onPrimary};
          border-bottom-right-radius: 0;
          white-space: pre-wrap;
        `
      : css`
          background-color: ${AppColors.surface};
          color: ${AppColors.onSurface};
          border: 1px solid ${AppColors.border};
          border-bottom-left-radius: 0;
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

export function AiChatMessage({ sender, text }: MessageProps) {
  return (
    <MessageWrapper $sender={sender}>
      {sender === "ai" && <ProfileImage src="/pretty.png" alt="AI 프로필" />}
      <MessageBox $sender={sender}>
        {sender === "ai" ? (
          <StyledMarkdownContainer>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
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
