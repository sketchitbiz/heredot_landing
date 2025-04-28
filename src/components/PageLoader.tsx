/**
 * PageLoader.tsx
 *
 * 페이지 전체를 덮는 로딩 컴포넌트로, 비동기 처리 중 사용자 입력(버튼 클릭, 입력 등)을 차단합니다.
 * 포털(Portal)을 이용해 DOM의 최상단(body)에 렌더링되며, 기본 스피너 또는 커스텀 UI를 지원합니다.
 * 기본적으로 Api 호출 시 open, close를 통해 로딩 상태를 관리합니다.
 *
 * PageLoader is a full-screen loading component designed to block all user interaction
 * (e.g., button clicks, typing) during asynchronous operations such as API calls.
 * It renders into the document body using a React Portal, and supports both default and custom UIs.
 * By default, it manages the loading state through open and close methods.
 */

"use client";

import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { AppColors } from "@/styles/colors";
import { AppTextStyles } from "@/styles/textStyles";
import styled, { keyframes } from "styled-components";

interface PageLoaderProps {
  isOpen: boolean; // 로더 표시 여부 | Whether to show the loader
  customUI?: React.ReactNode; // 커스텀 로딩 UI (기본 스피너 대체 가능) | Optional custom UI (replaces default spinner)
}

// --- DefaultLoader 스타일 정의 ---
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const DefaultLoaderWrapper = styled.div`
  text-align: center;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 4px solid ${AppColors.primary};
  border-top: 4px solid transparent;
  animation: ${spin} 1s linear infinite;
  margin: 0 auto 16px;
`;

const LoaderText = styled.p`
  ${AppTextStyles.body2}
  color: ${AppColors.onBackground};
`;

// 기본 스피너 UI (Styled Components 사용)
const DefaultLoader = () => (
  <DefaultLoaderWrapper>
    <Spinner />
    <LoaderText>잠시만 기다려 주세요... {/* Please wait... */}</LoaderText>
  </DefaultLoaderWrapper>
);

const PageLoader = ({ isOpen, customUI }: PageLoaderProps) => {
  // 로딩 상태일 때 스크롤 차단 | Prevent body scroll while loading
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = ""; // 컴포넌트 언마운트 시 초기화
    };
  }, [isOpen]);

  // isOpen이 false이면 null 반환 (항상 렌더링 시도 후 결정)
  if (!isOpen || typeof window === "undefined") return null;

  // ReactDOM.createPortal 사용 복구
  return ReactDOM.createPortal(
    <div
      suppressHydrationWarning
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "rgba(0,0,0,0.2)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "auto",
      }}>
      <div style={{ pointerEvents: "none" }}>{customUI || <DefaultLoader />}</div>
    </div>,
    document.body // Portal 대상 복구
  );
};

export default PageLoader;
