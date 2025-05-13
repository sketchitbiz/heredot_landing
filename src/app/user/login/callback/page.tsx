"use client";

import React, { Suspense } from "react";
import LoginCallbackContent from "./LoginCallbackContent";

// Loading 컴포넌트 (Suspense fallback용)
function Loading() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
        fontFamily: "Arial, sans-serif",
      }}>
      <p style={{ fontSize: "16px", color: "#333", marginBottom: "20px" }}>로그인 정보를 처리 중입니다...</p>
      <div
        style={{
          width: "50px",
          height: "50px",
          border: "5px solid #f3f3f3",
          borderTop: "5px solid #546ACB",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <style jsx global>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
        }
      `}</style>
    </div>
  );
}

export default function LoginCallbackPage() {
  return (
    <Suspense fallback={<Loading />}>
      <LoginCallbackContent />
    </Suspense>
  );
}

export const dynamic = "force-dynamic"; // 항상 동적으로 렌더링
