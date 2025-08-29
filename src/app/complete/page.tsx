'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/contexts/LangContext";
// import { dictionary } from "@/lib/i18n/lang";

const ContactCompletePage = () => {
  const router = useRouter();
  const { lang } = useLang();
  // const t = dictionary[lang].contactPopup;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 770);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div
      style={{
        backgroundColor: "#0A0A0C",
        color: "white",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h1
        style={{
          fontSize: isMobile ? "1.3rem" : "2rem",
          fontWeight: "bold",
          marginBottom: "1rem",
        }}
      >
           {lang === "ko"
          ? "견적을 문의해주셔서 감사드립니다"
          : "Thank you for your inquiry"}
      </h1>
      <h2
        style={{
          fontSize: isMobile ? "1rem" : "1.5rem",
          fontWeight: 500,
          marginBottom: "3rem",
        }}
      >
        {lang === "ko"
          ? "순차적으로 연락드리겠습니다"
          : "We will contact you in order"}
      </h2>
      <button
        onClick={handleGoHome}
        style={{
          backgroundColor: "white",
          color: "#F24E4E",
          fontWeight: 600,
          padding: isMobile ? "0.5rem 1.2rem" : "0.75rem 2rem",
          border: "none",
          borderRadius: "999px",
          fontSize: isMobile ? "0.9rem" : "1rem",
          cursor: "pointer",
        }}
      >
        {lang === "ko" ? "메인으로 돌아가기" : "Back to Home"}
      </button>
    </div>
  );
};

export default ContactCompletePage;