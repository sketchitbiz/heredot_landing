'use client';

import React, { useEffect, useState } from 'react';
import CommonButton from '@/components/CommonButton';
import { AppColors } from '@/styles/colors';
import { Breakpoints } from '@/constants/layoutConstants';
import { userStamp } from '@/lib/api/user';
import { useLang } from '@/contexts/LangContext';
import { dictionary } from '@/lib/i18n/lang';

interface AdContentProps {
  buttonText: string;
}

export const AdContent: React.FC<AdContentProps> = ({ buttonText }) => {
  const [isMobile, setIsMobile] = useState(false);
  const { lang } = useLang();
  const t = dictionary[lang];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < Breakpoints.mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleClick = () => {
    userStamp({ category: '팝업', content: 'AI견적서', memo: 'AI견적서' });
    window.open('/ai', '_blank', 'noopener,noreferrer');
  };

  const line1Style: React.CSSProperties = {
    fontSize: isMobile ? '24px' : '32px',
    margin: '0 0 8px 0',
    fontWeight: 600,
  };

  const line2Style: React.CSSProperties = {
    fontSize: isMobile ? '16px' : '24px',
    margin: '0 0 8px 0',
    fontWeight: 400,


  };

  return (
    <div 
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        cursor: 'pointer',
        position: 'relative',
      }}
      onClick={handleClick}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: '960px',
          height: '100%',
        }}
      >
        {/* First: Text content */}
        <div
          className="first"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px 40px',
            textAlign: 'center',
          }}
        >
          <h2 style={line1Style}>{t.adModal.line1}</h2>
      <h2 style={line2Style}>
  {isMobile
    ? t.adModal.line2.split('\n').map((line, idx) => (
        <React.Fragment key={idx}>
          {line}
          {idx !== t.adModal.line2.split('\n').length - 1 && <br />}
        </React.Fragment>
      ))
    : t.adModal.line2.replace(/\n/g, ' ')}
</h2>

          <div style={{ marginTop: '20px' }}>
            <CommonButton
              text={buttonText}
              isSkeletonText={true}
              width={isMobile ? '240px' : '360px'}
              fontSize={isMobile ? '16px' : '30px'}
              backgroundColor={AppColors.surface}
              borderRadius="75px"
              height={isMobile ? '50px' : '70px'}
            />
          </div>
        </div>

        {/* Second: Image content */}
        
{!isMobile && (
  <div
    className="second"
    style={{
      flex: 1,
      backgroundImage: `url('/ad.avif')`,
      backgroundSize: 'contain',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      minHeight: '400px',
      borderBottomLeftRadius: '16px',
      borderBottomRightRadius: '16px',
    }}
  />
)}

      </div>
    </div>
  );
};
