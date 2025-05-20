/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://heredotcorp.com', // 실제 서비스 도메인으로 변경해주세요.
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: '/cms/' },
      { userAgent: '*', disallow: '/ai/' },
    ],
    additionalSitemaps: [
      'https://heredotcorp.com/sitemap.xml', // sitemap.xml의 전체 주소
    ],
  },
  exclude: [
    '/cms',
    '/ai',
    '/404',
    // '/server-sitemap.xml', // 서버에서 동적으로 생성하는 사이트맵이 있다면 추가
  ],
  // Next.js App Router를 사용하고 있다면, outDir 옵션은 기본적으로 public 폴더를 대상으로 하지 않을 수 있습니다.
  // 빌드 후 생성되는 sitemap.xml 파일의 위치를 확인하고, 필요하다면 public 폴더로 옮기는 스크립트를 package.json에 추가해야 할 수 있습니다.
  // 기본적으로 `next-sitemap`은 `out` 또는 `.next` 디렉토리에 생성 후 `public`으로 복사하려고 시도합니다.
};
