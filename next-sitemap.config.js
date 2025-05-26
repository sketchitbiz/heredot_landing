/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://heredotcorp.com', // 실제 서비스 도메인으로 변경해주세요.
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/cms/', '/ai/'],
      },
    ],
    // additionalSitemaps는 next-sitemap이 기본적으로 sitemap.xml을 생성하므로 중복될 수 있어 제거합니다.
    // 만약 별도의 sitemap.xml (예: 서버에서 동적으로 생성하는 경우)이 있다면 여기에 추가합니다.
  },
  exclude: [
    '/cms/*',
    '/ai/*',
    '/404',
    '/cms', // 혹시 /cms 자체 페이지가 있다면 그것도 제외
    '/ai', // 혹시 /ai 자체 페이지가 있다면 그것도 제외
    // '/server-sitemap.xml', // 서버에서 동적으로 생성하는 사이트맵이 있다면 추가
  ],
  // Next.js App Router를 사용하고 있다면, outDir 옵션은 기본적으로 public 폴더를 대상으로 하지 않을 수 있습니다.
  // 빌드 후 생성되는 sitemap.xml 파일의 위치를 확인하고, 필요하다면 public 폴더로 옮기는 스크립트를 package.json에 추가해야 할 수 있습니다.
  // 기본적으로 `next-sitemap`은 `out` 또는 `.next` 디렉토리에 생성 후 `public`으로 복사하려고 시도합니다.
};
