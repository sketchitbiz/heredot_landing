// components/CustomPopupText.tsx
'use client';

import React, { useEffect, useState } from 'react';

interface CustomPopupTextProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const CustomPopupText: React.FC<CustomPopupTextProps> = ({ children, style }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth <= 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <p
      style={{
        fontSize: 16,
        fontWeight: 400,
        color: '#454545',
        margin: 0,
        marginBottom: 0,
        lineHeight: '20px',
        whiteSpace: isMobile ? 'normal' : 'pre-line',
        ...style,
      }}
    >
      {children}
    </p>
  );
};
