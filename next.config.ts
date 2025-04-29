import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  compiler: {
    styledComponents: true, // styled-components 사용 설정
  },
  eslint: {
    // 경고: 빌드 시 ESLint 오류를 무시합니다.
    // 모든 ESLint 관련 오류를 무시하며, 잠재적인 코드 품질 문제를 가릴 수 있습니다.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 경고: 빌드 시 TypeScript 오류를 무시합니다.
    // 타입 관련 오류를 무시하며, 런타임 오류로 이어질 수 있습니다.
    ignoreBuildErrors: true,
  },
  output: "standalone",
};

export default nextConfig;
