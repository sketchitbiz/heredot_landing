"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/contexts/LangContext";
import { termGetList } from "@/lib/api/user";

const Wrapper = styled.div`
  height: 100vh;
  background-color: #000;
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 2rem 1rem;
  box-sizing: border-box;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #fff;
`;

const TabsRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Tab = styled.a<{ $active?: boolean }>`
  font-size: 16px;
  font-weight: ${({ $active }) => ($active ? "bold" : "normal")};
  color: #fff;
  opacity: ${({ $active }) => ($active ? 1 : 0.5)};
  border-bottom: ${({ $active }) => ($active ? "2px solid #fff" : "none")};
  padding-bottom: 4px;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;

  /* 스크롤 숨기기 (크로스브라우징) */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
  &::-webkit-scrollbar {
    display: none; /* Chrome/Safari */
  }
`;

const ContentBox = styled.div`
  padding: 1rem;
  background: #111;
  border: 1px solid #444;
  border-radius: 8px;
  color: #fff;

  p, h1, h2, h3, ul, ol {
    margin-bottom: 1rem;
  }

  li {
    list-style: disc;
    margin-left: 1.5rem;
  }
`;

const StyledLink = styled(Link)<{ $active?: boolean }>`
  font-size: 16px;
  font-weight: ${({ $active }) => ($active ? "bold" : "normal")};
  color: #fff;
  opacity: ${({ $active }) => ($active ? 1 : 0.5)};
  border-bottom: ${({ $active }) => ($active ? "2px solid #fff" : "none")};
  padding-bottom: 4px;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    opacity: 1;
  }
`;


const tabIndexMap: Record<string, { index: number; koLabel: string; enLabel: string }> = {
  terms: { index: 1, koLabel: "이용약관", enLabel: "Terms of Use" },
  terms_en: { index: 2, koLabel: "이용약관(Eng)", enLabel: "Terms (Eng)" },
  privacy: { index: 3, koLabel: "개인정보 취급방침", enLabel: "Privacy Policy" },
  privacy_en: { index: 4, koLabel: "개인정보 취급방침(Eng)", enLabel: "Privacy Policy (Eng)" },
  company: { index: 5, koLabel: "사업자 정보", enLabel: "Company Info" },
  company_en: { index: 6, koLabel: "사업자 정보(Eng)", enLabel: "Company Info (Eng)" },
};

const getTabs = (lang: string) => {
  return Object.entries(tabIndexMap)
    .filter(([key]) => lang === "ko" ? !key.endsWith("_en") : key.endsWith("_en"))
    .map(([key, value]) => ({
      key,
      label: lang === "ko" ? value.koLabel : value.enLabel,
    }));
};

export default function TermsClient({ type }: { type: string }) {
  const { lang } = useLang(); // "ko" or "en"
  const pathname = usePathname();
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const meta = tabIndexMap[type];
    if (!meta) return;

    const fetchTerms = async () => {
      try {
        const res = await termGetList();
        const list = res?.[0]?.data || [];
        const matched = list.find((item: any) => Number(item.index) === meta.index);
        setContent(matched?.content || "<p>내용이 없습니다.</p>");
      } catch (err) {
        console.error("약관 로딩 실패:", err);
        setContent("<p>오류가 발생했습니다.</p>");
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
  }, [type]);

  const currentTab = tabIndexMap[type];
  const title = currentTab
    ? lang === "ko"
      ? currentTab.koLabel
      : currentTab.enLabel
    : "";

  return (
    <Wrapper>
      {/* <Title>{title}</Title> */}

      <TabsRow>
  {getTabs(lang).map((tab) => (
    <StyledLink
      href={`/terms/${tab.key}`}
      key={tab.key}
      $active={pathname.endsWith(`/${tab.key}`)}
    >
      {tab.label}
    </StyledLink>
  ))}
</TabsRow>


      <ContentContainer>
        {loading ? (
          <p>로딩 중...</p>
        ) : (
          <ContentBox dangerouslySetInnerHTML={{ __html: content ?? "" }} />
        )}
      </ContentContainer>
    </Wrapper>
  );
}
