'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function TokenTestPage() {
  const [token, setToken] = useState('');
  const router = useRouter();

  const handleSetInvalidToken = () => {
    localStorage.setItem('admin_access_token', token || 'invalid_token_example');
    alert('토큰이 설정되었습니다: ' + token);
  };

  const goToCms = () => {
    router.push('/cms');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🔧 Admin Access Token 테스트 페이지</h2>
      <input
        type="text"
        placeholder="임의의 토큰 입력"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        style={{ width: '300px', marginRight: '1rem' }}
      />
      <button onClick={handleSetInvalidToken}>토큰 설정</button>

      <hr style={{ margin: '2rem 0' }} />

      <button onClick={goToCms}>/cms 페이지로 이동</button>
    </div>
  );
}
