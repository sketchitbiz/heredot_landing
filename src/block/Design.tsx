'use client';

import React from 'react';
import ResponsiveView from '@/layout/ResponsiveView';
import DesignWeb from './DesignWeb';
import DesignMobile from './DesignMobile';

interface DesignBlockProps {
  title: string;
  tabs: string[];
  tabNumbers: string[];
  slides: { title: string; image: string }[];
  downloadText: string;
}

const DesignBlock: React.FC<DesignBlockProps> = (props) => {
  return (
    <ResponsiveView
      mobileView={<DesignMobile {...props} />}
      desktopView={<DesignWeb {...props} />}
    />
  );
};

export default DesignBlock;