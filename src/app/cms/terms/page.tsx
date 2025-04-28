"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Editor } from "@tiptap/react";
import styled from "styled-components";
import CommonButton from "@/components/CommonButton";
import { termGetList, TermGetListParams, termUpdate } from "@/lib/api/admin";
import { toast, ToastContainer } from 'react-toastify';
import { devLog } from "@/lib/utils/devLogger";

const CustomTiptapEditor = dynamic(() => import("@/components/Editor/CustomTiptapEditor"), {
  ssr: false,
});

const tabs = [
  { key: "terms", label: "이용약관", index: 1 },
  { key: "terms_en", label: "이용약관(Eng)", index: 2 },
  { key: "privacy", label: "개인정보 취급방침", index: 3 },
  { key: "privacy_en", label: "개인정보 취급방침(Eng)", index: 4 },
  { key: "company", label: "사업자 정보", index: 5 },
  { key: "company_en", label: "사업자 정보(Eng)", index: 6 },
];

type ContentMap = {
  [key: string]: {
    content: string;
    index: number;
    termsType: string;
  };
};

const TabRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const TabList = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #000;
  margin-bottom: 1.5rem;
`;

const TabButton = styled.button<{ $active?: boolean }>`
  background: none;
  border: none;
  font-size: 16px;
  padding: 4px 0;
  cursor: pointer;
  color: ${({ $active }) => ($active ? "#000" : "#999")};
  border-bottom: ${({ $active }) => ($active ? "2px solid #000" : "none")};
  font-weight: ${({ $active }) => ($active ? "bold" : "normal")};
  transition: color 0.2s;

  &:hover {
    color: #000;
  }
`;

export default function TermsPage() {
  const [activeTab, setActiveTab] = useState(tabs[0].key);
  const [editorInstance, setEditorInstance] = useState<Editor | null>(null);
  const [contents, setContents] = useState<ContentMap>({});

  useEffect(() => {
    const fetchTerms = async () => {
      const res = await termGetList();
      devLog("📱 [약관 목록] 응답", res);
  
      const rawList = res?.[0]?.["data"] == '' ? [] : res?.[0]?.["data"];
      devLog("📱 [약관 목록] 데이터", rawList);
  
      const map: ContentMap = {};
  
      tabs.forEach((tab) => {
        const matched = rawList?.find((item: any) => Number(item["index"]) === tab.index);
        map[tab.key] = {
          index: tab.index,
          termsType: "user",
          content: matched?.["content"] ?? "", // matched가 없으면 공란
        };
      });
  
      setContents(map);
    };
  
    fetchTerms();
  }, []);
  ;

  const handleTabChange = (key: string) => {
    if (editorInstance) {
      const currentHtml = editorInstance.getHTML();
      setContents((prev) => ({
        ...prev,
        [activeTab]: {
          ...prev[activeTab],
          content: currentHtml,
        },
      }));
    }

    setActiveTab(key);

    const next = contents[key];
    if (editorInstance && next?.content !== undefined) {
      editorInstance.commands.setContent(next.content);
    }
  };

  const handleEditorReady = (editor: Editor) => {
    setEditorInstance(editor);
    const initial = contents[activeTab]?.content || "<p></p>";
    editor.commands.setContent(initial);
  };

  const handleSave = async () => {
    if (!editorInstance) return;
  
    const html = editorInstance.getHTML();
    const current = contents[activeTab];
  
    if (!current?.index) {
      toast.error("저장할 약관 정보가 없습니다.");
      return;
    }
  
    const params: TermGetListParams = {
      index: current.index,
      termsType: current.termsType,
      content: html,
    };
  
    try {
      const response = await termUpdate(params);
      console.log("📦 저장 응답:", response);
  
      const result = response?.[0];
      if (result?.['message'] === "success") {
        toast.success("저장되었습니다.");
        setContents((prev) => ({
          ...prev,
          [activeTab]: {
            ...prev[activeTab],
            content: html,
          },
        }));
      } else {
        toast.error("저장에 실패했습니다.");
        console.warn("🚨 실패 응답 내용:", result);
      }
    } catch (error) {
      console.error("❌ 저장 오류:", error);
      toast.error("저장 중 오류가 발생했습니다.");
    }
  };
  
  
  

  return (
    
    <div style={{ minHeight: "100vh", padding: "2rem"}}>
        <ToastContainer position="top-center" autoClose={3000} />
      <Title>이용약관 편집</Title>

      <TabRow>
        <TabList>
          {tabs.map((tab) => (
            <TabButton
              key={tab.key}
              $active={activeTab === tab.key}
              onClick={() => handleTabChange(tab.key)}
            >
              {tab.label}
            </TabButton>
          ))}
        </TabList>

        <CommonButton
          text="저장"
          $iconPosition="left"
          width="80px"
          height="36px"
          fontSize="14px"
          borderRadius="8px"
          backgroundColor="#000"
          color="#fff"
          onClick={handleSave}
        />
      </TabRow>

      <div className="bg-[#f9f9f9] p-4 rounded border border-gray-300">
        <CustomTiptapEditor
          initialContent={contents[activeTab]?.content || "<p>로딩 중...</p>"}
          onEditorReady={handleEditorReady}
        />
      </div>
    </div>
  );
}
