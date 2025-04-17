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

  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    background-color: ${AppColors.background};       /* 배경색 설정 | Set background color */
    color: ${AppColors.onBackground};                /* 텍스트 색상 설정 | Set default text color */
    font-family: 'Arial', sans-serif;                /* 기본 폰트 설정 | Set default font */
  }
`;

export default GlobalStyle;
