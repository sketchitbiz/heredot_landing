"use client";

import styled, { css } from "styled-components";
import { AppColors } from "@/styles/colors";
import { AppTextStyles } from "@/styles/textStyles";

interface MessageProps {
  sender: "user" | "ai";
  text: string;
}

interface StyledComponentProps {
  $sender: "user" | "ai";
}

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
  white-space: pre-wrap;

  ${(props) =>
    props.$sender === "user"
      ? css`
          background-color: ${AppColors.primary};
          color: ${AppColors.onPrimary};
          border-bottom-right-radius: 0;
        `
      : css`
          background-color: ${AppColors.surface};
          color: ${AppColors.onSurface};
          border: 1px solid ${AppColors.border};
          border-bottom-left-radius: 0;
        `}
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
      <MessageBox $sender={sender}>{text}</MessageBox>
    </MessageWrapper>
  );
}
