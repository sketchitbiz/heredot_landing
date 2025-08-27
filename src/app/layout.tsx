import { GlobalWrapper } from './global-wrapper';
import StyledComponentsRegistry from '@/lib/registry';
import FloatingButton from '@/components/FloatingButton';
import { AiChatProvider } from '@/contexts/AiChatContext';
import AiChatWidget from '@/components/AiChatWidget';
import Script from 'next/script'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* 기본 메타 태그 */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="여기닷은 홈페이지 제작, 웹사이트 개발, 반응형 웹 구축, 모바일 앱과 AI 기반 웹·앱, 시스템 개발까지 아우르는 디지털 종합 에이전시입니다. 정부지원사업 대응 경험과 스타트업 맞춤형 개발, 드론·지도 기반 앱 개발 등 전문성과 확장성을 겸비하고 있습니다."
        />

        {/* OG (Open Graph) 메타 태그 */}
        <meta property="og:title" content="여기닷 AI 견적 시스템" />
        <meta property="og:description" content="나의 아이디어 AI에게 다 물어봐!" />
        <meta property="og:image" content="/og.png" />
        <meta property="og:url" content="https://heredotcorp.com/" />
        <meta property="og:type" content="website" />

        {/* Twitter 메타 태그 */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="여기닷 AI 견적 시스템" />
        <meta name="twitter:description" content="나의 아이디어 AI에게 다 물어봐!" />
        <meta name="twitter:image" content="/og.png" />

        {/* 검색 엔진 인증 */}
        <meta name="google-site-verification" content="RJWue1FsTIqYFJZUgfjLKjaKDciAlkvTycTq-kUZz0U" />
        <meta name="naver-site-verification" content="ac09ecfb60cda154b6017c23d4c2aa45cf006275" />

        {/* 파비콘 */}
        <link rel="icon" href="/favicon.ico" />
        <title>HereDot</title>

        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-P5R0BM2W67"></script>

        <Script
          src="http://localhost:5173/widget.js"
          data-url="http://localhost:5173/"
          data-position="right"
          data-color="#3391FF"
          data-size="420x720"
          data-height-vh="40"
          data-height-vh-expanded="85"
          data-label="AI"
          data-open="0"
          strategy="afterInteractive"
        />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-P5R0BM2W67');
            `,
          }}
        />
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-KDZWXXZW');
            `,
          }}
        />
      </head>
      <body className="antialiased">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KDZWXXZW"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        <StyledComponentsRegistry>
            <GlobalWrapper>{children}</GlobalWrapper>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}