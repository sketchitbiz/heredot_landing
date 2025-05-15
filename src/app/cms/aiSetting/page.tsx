"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AiSettingRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/cms/aiSetting/companyInfo");
  }, [router]);

  return null; // 로딩 메시지나 스피너를 추가할 수도 있음
}
