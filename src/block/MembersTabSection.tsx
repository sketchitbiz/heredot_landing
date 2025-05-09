'use client';

import styled from 'styled-components';
import { useState } from 'react';
import { CustomNavigator } from '@/customComponents/CustomNavigator';
import { TabComponent } from '@/components/Landing/TabComponent';
import { MemberCard } from '@/components/Landing/MemberCard';
import { useLang } from '@/contexts/LangContext';
import { dictionary } from '@/lib/i18n/lang';
import { Breakpoints } from '@/constants/layoutConstants';
import { userStamp } from '@/lib/api/user/api';

interface MembersTabSectionProps {
  title: string;
  description: string;
  topLabel: string;
  centerLabel: string;
  bottomLabel: string;
  memberCards: {
    [id: string]: {
      name: string;
      messages: { [tabKey: string]: string | null };
    };
  };
  onTopArrowClick?: () => void;
  onBottomArrowClick?: () => void;
}

const Wrapper = styled.div`
  padding: 0 20px;     /* ✅ 좌우 여백 추가 */

    min-width: ${Breakpoints.desktop}px; /* 기본값: 데스크탑 너비 강제 유지 */

  @media (max-width: ${Breakpoints.mobile}px) {
    min-width: auto; /* 모바일 이하에서 min-width 제거 */
  }
`;
const GridContainerForTabs = styled.div`
  display: grid;
  row-gap: 50px; /* 기본값 (모바일) */
  column-gap: 24px;
  grid-template-columns: repeat(4, 1fr); /* 기본값: 데스크탑에서 4열 */
  margin-bottom: 100px;

  @media (max-width: ${Breakpoints.mobile}px) {
    margin-top: 16px;
    grid-template-columns: repeat(2, 1fr); /* 모바일: 2열 */
    row-gap: 50px; /* ✅ 데스크탑/태블릿에서 row-gap 조정 */
    margin-bottom: 0px;
    column-gap: 8px;
  }

`;


const memberTabKeys = ['chat', 'streaming', 'subscription', 'lunch'];

export const MembersTabSection: React.FC<MembersTabSectionProps> = ({
  title,
  description,
  topLabel,
  centerLabel,
  bottomLabel,
  memberCards,
  onTopArrowClick,
  onBottomArrowClick,
}) => {
  const { lang } = useLang();
  const t = dictionary[lang];

  const [currentTabKey, setCurrentTabKey] = useState(memberTabKeys[0]);

  const tabItems = memberTabKeys.map((key) => ({
    key,
    label:
      key === 'chat'
        ? t.memberTabs?.[0]
        : key === 'streaming'
        ? t.memberTabs?.[1]
        : key === 'subscription'
        ? t.memberTabs?.[2]
        : t.memberTabs?.[3],
  }));

  const handleTabChange = (key: string) => {
    setCurrentTabKey(key);
  
    // 버튼 스탬프 추가
    const label = tabItems.find((item) => item.key === key)?.label ?? key;
    void userStamp({
      uuid: localStorage.getItem('logId') ?? 'anonymous',
      category: '버튼',
      content: 'Members',
      memo: `탭: ${label}`,
    });
  };

  const baseCardData = [
    { id: '1', imageUrl: '/landing/members/1_liam.webp' },
    { id: '2', imageUrl: '/landing/members/2_martin.webp' },
    { id: '3', imageUrl: '/landing/members/3_martin.webp' },
    { id: '4', imageUrl: '/landing/members/4_k.webp' },
    { id: '5', imageUrl: '/landing/members/5_dony.webp' },
    { id: '6', imageUrl: '/landing/members/6_day.webp' },
    { id: '7', imageUrl: '/landing/members/7_sien.webp' },
    { id: '9', imageUrl: '/landing/members/jaxon.png' },
  ];

  return (
    <>
      <CustomNavigator
        topLabel={topLabel}
        centerLabel={centerLabel}
        bottomLabel={bottomLabel}
        title={title}
        description={description}
        onTopArrowClick={onTopArrowClick}
        onBottomArrowClick={onBottomArrowClick}
      />
      <Wrapper>
        <TabComponent
          tabs={tabItems}
          activeTabKey={currentTabKey}
          onTabChange={handleTabChange}
        >
          <GridContainerForTabs>
            {baseCardData.map((item) => (
              <MemberCard
                key={item.id}
                imageUrl={item.imageUrl}
                name={memberCards[item.id]?.name}
                messages={memberCards[item.id]?.messages}
                currentTab={currentTabKey}
              />
            ))}
          </GridContainerForTabs>
        </TabComponent>
      </Wrapper>
    </>
  );
};
