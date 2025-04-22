import { css } from "styled-components";
import { AppColors } from "./colors";

/**
 * 사용자 정의 스크롤바 스타일 Mixin
 * @param trackBackgroundColor - 스크롤바 트랙의 배경색 (컨테이너 배경색과 일치시키는 것이 좋음)
 */
export const customScrollbar = (trackBackgroundColor: string = AppColors.background) => css`
  overflow-y: scroll; /* 항상 스크롤바를 표시하여 공간 확보 */

  /* Webkit 계열 브라우저 (Chrome, Safari, new Edge) */
  &::-webkit-scrollbar {
    width: 8px; /* 스크롤바 너비 */
  }

  &::-webkit-scrollbar-track {
    background: ${trackBackgroundColor};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${AppColors.scroll}; /* 스크롤바 막대 색상 */
    border-radius: 4px;
    /* 트랙 색상과 동일한 테두리를 주어 입체감 표현 */
    border: 2px solid ${trackBackgroundColor};
  }

  /* Firefox */
  scrollbar-width: thin; /* 스크롤바 너비 ('auto' 또는 'thin') */
  scrollbar-color: ${AppColors.scroll} ${trackBackgroundColor}; /* thumb 색상, track 색상 */
`;

/*
// 사용 예시:
import styled from 'styled-components';
import { customScrollbar } from '@/styles/commonStyles';
import { AppColors } from '@/styles/colors';

const ScrollableContainer = styled.div`
  height: 300px; // 높이 지정 필수
  background-color: ${AppColors.background}; // 예시 배경색
  ${customScrollbar(AppColors.background)} // Mixin 적용
`;
*/
