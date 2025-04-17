'use client';

import { AdminAuthProvider, useAdminAuth } from '@/contexts/AdminAuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <ProtectedCmsLayout>{children}</ProtectedCmsLayout>
    </AdminAuthProvider>
  );
}

function ProtectedCmsLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, ready } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === '/cms';

  useEffect(() => {
    if (ready && !isLoggedIn && !isLoginPage) {
      router.replace('/cms'); // 로그인 페이지로 이동
    }
  }, [ready, isLoggedIn, isLoginPage]);

  if (!ready) return null; // hydration mismatch 방지
  if (!isLoggedIn && !isLoginPage) return null;

  return <>{children}</>;
}
