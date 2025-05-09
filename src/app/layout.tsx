import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GlobalWrapper } from "./global-wrapper";
import StyledComponentsRegistry from "@/lib/registry";
import "@/lib/firebase/firebase.config";

/**
 * RootLayout은 Next.js 애플리케이션의 루트 레이아웃을 정의합니다.
 * HTML 구조, 글로벌 폰트, 글로벌 컨텍스트 및 스타일 적용의 최상단 엔트리 포인트입니다.
 *
 * RootLayout defines the root layout of the Next.js application.
 * It includes the base HTML structure, global fonts, and wraps the app with global context and styles.
 */

// ✅ Google Fonts 설정 | Configure Google Fonts with CSS variables
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'HereDot',
  description: 'HereDot Landing Page',
  icons: {
    icon: '/favicon.ico',
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="여기닷 AI 견적 시스템" />
        <meta property="og:description" content="나의 아이디어 AI에게 다 물어봐!" />
        <meta property="og:image" content="/og.png" />
        <meta property="og:url" content="https://heredotcorp.com/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="여기닷 AI 견적 시스템" />
        <meta name="twitter:description" content="나의 아이디어 AI에게 다 물어봐!" />
        <meta name="twitter:image" content="/og.png" />
        <meta name="description" content="여기닷은 홈페이지 제작, 웹사이트 개발, 반응형 웹 구축, 모바일 앱과 AI 기반 웹·앱, 시스템 개발까지 아우르는 디지털 종합 에이전시입니다. 정부지원사업 대응 경험과 스타트업 맞춤형 개발, 드론·지도 기반 앱 개발 등 전문성과 확장성을 겸비하고 있습니다."></meta>
        
      </head>
      <body className="antialiased">
        {/* StyledComponentsRegistry로 GlobalWrapper와 children 감싸기 */}
        <StyledComponentsRegistry>
          <GlobalWrapper>{children}</GlobalWrapper>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}