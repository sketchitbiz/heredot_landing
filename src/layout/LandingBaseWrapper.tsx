// src/layout/LandingBaseWrapper.tsx

/**
 * LandingBaseWrapper는 랜딩형 UI 페이지에서 사용되는 공통 컨테이너입니다.
 * 최대 너비를 제한하면서, 지정된 최소 너비 이하에서는 가로 스크롤을 허용합니다.
 * 중앙 정렬, 배경 이미지, 반응형 대응을 포함합니다.
 *
 * LandingBaseWrapper is a shared container for landing-style pages.
 * It handles max-width alignment, horizontal scroll below min-width,
 * and includes responsive and centered layout.
 */

import { Breakpoints } from '@/constants/layoutConstants';
import styled from 'styled-components';

const LandingBaseWrapper = styled.div`
  width: 100vw;
  min-height: 100vh;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  overflow-x: auto;

  @media (min-width: ${Breakpoints.desktop}px) {
    width: ${Breakpoints.desktop}px;
    margin: 0 auto;
  }
`;

export default LandingBaseWrapper;
