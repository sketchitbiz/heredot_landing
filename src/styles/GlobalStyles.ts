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
    font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    
    /* 모든 플랫폼에서 맥 스타일 폰트 렌더링 강제 적용 */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    font-feature-settings: 'kern' 1, 'liga' 1, 'calt' 1;
    font-kerning: normal;
    font-variant-ligatures: common-ligatures;
    font-variant-numeric: proportional-nums;
    
    /* 윈도우에서 맥과 동일한 폰트 메트릭 강제 적용 */
    font-synthesis: none;
    text-size-adjust: 100%;
    font-optical-sizing: auto;
    
    /* 윈도우 ClearType 비활성화하여 맥 스타일 렌더링 */
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;

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
  
  /* 모든 텍스트 요소에 맥 스타일 렌더링 일관성 적용 */
  *, *::before, *::after {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    font-feature-settings: 'kern' 1;
    
    /* 윈도우에서 텍스트 너비를 맥과 동일하게 맞추기 위한 설정 */
    letter-spacing: -0.005em;
    word-spacing: -0.01em;
    
    /* 윈도우에서 폰트 볼드 처리 일관성 */
    font-weight: inherit;
    font-synthesis: weight style;
  }
  
  /* 특별히 한글 폰트에 대한 윈도우 최적화 */
  [lang="ko"], [lang="ko-KR"], :lang(ko) {
    font-family: 'Noto Sans KR', 'Malgun Gothic', '맑은 고딕', sans-serif;
    font-feature-settings: 'kern' 1, 'liga' 0;
    letter-spacing: -0.01em;
    
    /* 한글 특화 윈도우 렌더링 설정 */
    word-break: keep-all;
    line-break: strict;
    hanging-punctuation: none;
  }
  
  /* 영문 폰트에 대한 윈도우 최적화 */
  [lang="en"], [lang="en-US"], :lang(en) {
    font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    letter-spacing: -0.005em;
    
    /* 영문 특화 설정 */
    word-break: normal;
    hyphens: auto;
  }
  
  /* 윈도우에서 ClearType 및 DirectWrite 렌더링 강제 설정 */
  @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
    * {
      -webkit-font-smoothing: antialiased;
      filter: contrast(1) brightness(1);
    }
  }
  
  /* 윈도우 Edge 브라우저 특화 설정 */
  @supports (-ms-ime-align: auto) {
    * {
      font-feature-settings: 'kern' 1, 'liga' 1, 'calt' 1, 'ss01' 1;
      text-rendering: geometricPrecision;
    }
  }
`;

export default GlobalStyle;
