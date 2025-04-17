// src/app/not-found.tsx
'use client';

/**
 * NotFound는 존재하지 않는 페이지(404) 요청 시 보여지는 커스텀 에러 페이지입니다.
 * Next.js App Router에서는 이 파일이 존재할 경우 자동으로 해당 경로에 대응합니다.
 *
 * NotFound is the custom 404 page shown when users access a non-existent route.
 * In Next.js App Router, this file is automatically used for handling unmatched routes.
 *
 * [디자인 수정 안내 / How to Modify the Design]
 * - 이 컴포넌트의 레이아웃, 텍스트, 색상, 버튼 등을 수정하여 프로젝트의 디자인 시스템에 맞게 커스터마이징 하세요.
 * - 예: 헤더 이미지 추가, 버튼 스타일 변경, 다크모드 대응 등
 */

import Link from 'next/link';

export default function NotFound() {
  return (
    <main
      style={{
        padding: '4rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#fafafa',
      }}
    >
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🚫 페이지를 찾을 수 없습니다</h1>
      <p style={{ fontSize: '16px', color: '#666' }}>
        요청하신 주소에 해당하는 페이지가 존재하지 않거나 삭제되었습니다.
      </p>

      <Link
        href="/"
        style={{
          marginTop: '2rem',
          padding: '12px 24px',
          backgroundColor: '#1976D2',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '6px',
          fontWeight: 'bold',
        }}
      >
        홈으로 돌아가기
      </Link>
    </main>
  );
}
