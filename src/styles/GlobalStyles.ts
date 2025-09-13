// src/styles/GlobalStyle.ts

/**
 * GlobalStyle은 애플리케이션의 전역 CSS 스타일을 정의합니다.
 * 초기화 스타일과 기본 레이아웃 설정을 통해 모든 페이지에 일관된 스타일을 적용합니다.
 *
 * GlobalStyle defines global CSS styles for the application.
 * It sets up base layout and resets to ensure consistent styling across all pages.
 */

import { createGlobalStyle } from 'styled-components';
import { AppColors } from './colors';
const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }
  :root {
    color-scheme: light;
  }

  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    font-family: 'Noto Sans KR', sans-serif;

    background-color: ${AppColors.background};      
     /* background-color: #ffffff !important; */
    color: ${AppColors.onBackground};               
    color-scheme: only dark;                     
  /* 스크롤바가 생길 때 레이아웃이 좌우로 흔들리지 않도록 항상 공간을 확보 */
  overflow-y: scroll; /* 항상 스크롤바 공간 예약 (크롬/사파리에서도 미묘한 흔들림 방지) */
  scrollbar-gutter: stable; /* 지원 브라우저(Chromium/Firefox)에서 스크롤바 영역 고정 */
  overscroll-behavior: contain; /* iOS 등에서 바운스/새로고침 영향 최소화 */
  }

  /* ---------- Scrollbar (투명 트랙) ---------- */
  /* Firefox */
  html {
    scrollbar-width: thin; /* auto | thin | none */
    scrollbar-color: rgba(120,120,140,0.35) transparent; /* thumb, track */
  }

  /* WebKit (Chrome / Edge / Safari) */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  ::-webkit-scrollbar-track {
    background: transparent; /* 트랙 투명 */
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(120,120,140,0.35);
    border-radius: 20px;
    border: 2px solid transparent; /* 가장자리 여백으로 시각적 슬림 효과 */
    background-clip: padding-box;
    transition: background 0.2s ease; 
  }
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(120,120,140,0.55);
  }
  ::-webkit-scrollbar-corner { background: transparent; }
`;

export default GlobalStyle;
