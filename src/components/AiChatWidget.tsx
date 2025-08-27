'use client';

import React, { useEffect } from 'react';
import { useAiChat } from '@/contexts/AiChatContext';
import Script from 'next/script';

const AiChatWidget = () => {
  const { isOpen } = useAiChat();

  useEffect(() => {
    // 위젯이 열릴 때 스크립트를 동적으로 로드
    if (isOpen) {
      const script = document.createElement('script');
      script.src = 'http://121.157.229.40:8535/widget.js';
      script.setAttribute('data-url', 'http://121.157.229.40:8535/');
      script.setAttribute('data-position', 'right');
      script.setAttribute('data-color', '#3391FF');
      script.setAttribute('data-size', '420x720');
      script.setAttribute('data-height-vh', '40');
      script.setAttribute('data-height-vh-expanded', '85');
      script.setAttribute('data-label', 'AI');
      script.setAttribute('data-open', '1');
      
      document.body.appendChild(script);

      return () => {
        // 컴포넌트가 언마운트되거나 닫힐 때 스크립트 제거
        const existingScript = document.querySelector(`script[src="${script.src}"]`);
        if (existingScript) {
          document.body.removeChild(existingScript);
        }
      };
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return null; // 스크립트가 위젯을 렌더링하므로 null 반환
};

export default AiChatWidget;
