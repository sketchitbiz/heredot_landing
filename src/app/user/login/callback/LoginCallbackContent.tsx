"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import { useSearchParams } from "next/navigation";
import axios from "axios";

// 기존 스타일 컴포넌트 정의 ... (Container, Message, DebugInfo, etc.)
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5;
  font-family: Arial, sans-serif;
  padding: 0 20px;
`;

const Message = styled.p`
  font-size: 16px;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

const DebugInfo = styled.div`
  margin-top: 20px;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
  width: 100%;
  max-width: 600px;
  font-size: 14px;
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-word;
  overflow-x: auto;
  color: #333;
`;

const DebugButton = styled.button`
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #546acb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #3f51b5;
  }
`;

const CopyButton = styled.button`
  margin-top: 10px;
  padding: 6px 12px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #388e3c;
  }
`;

const GoBackButton = styled.button`
  margin-top: 20px;
  padding: 12px 24px;
  background-color: #546acb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;

  &:hover {
    background-color: #3f51b5;
  }
`;

// 컴포넌트 이름 변경
export default function LoginCallbackContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [message, setMessage] = useState<string>("로그인 처리 중입니다. 잠시만 기다려주세요...");
  const [debugInfo, setDebugInfo] = useState<string>("");
  const [showDebug, setShowDebug] = useState<boolean>(false);

  // 쿠키에서 토큰 가져오는 함수
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return undefined;
  };

  // user/info API 호출 함수
  const callUserInfo = async (accessToken: string) => {
    try {
      setMessage("사용자 정보를 가져오는 중입니다...");
      console.log("user/info API 호출 시작");

      const response = await axios.post("https://heredotcorp.com/api/user/info", null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("user/info API 응답 받음:", response.status);

      if (response.status === 200 && response.data) {
        const userData = response.data[0]?.data?.[0];

        if (userData) {
          // 로컬 스토리지에 사용자 정보 저장
          localStorage.setItem("loginData", JSON.stringify(response.data));
          console.log("로컬 스토리지에 사용자 정보 저장 완료");

          setStatus("success");
          setMessage("로그인 성공! 리다이렉트 중...");

          // cellphone 유무에 따라 리다이렉션
          setTimeout(() => {
            if (!userData.cellphone) {
              console.log("전화번호 정보가 없어 추가 정보 모달 표시를 위해 /ai로 이동");
              window.location.href = "/ai";
            } else {
              console.log("전화번호 정보가 있어 바로 /ai로 이동");
              window.location.href = "/ai";
            }
          }, 1500);
        } else {
          throw new Error("유효하지 않은 사용자 데이터 형식");
        }
      } else {
        throw new Error("API 응답 오류: " + response.statusText);
      }
    } catch (error) {
      console.error("user/info API 호출 오류:", error);
      setStatus("error");
      setMessage("사용자 정보를 가져오는 중 오류가 발생했습니다.");
      setShowDebug(true);

      // 디버그 정보 설정
      setDebugInfo(`API 호출 오류:\n${error instanceof Error ? error.message : String(error)}`);
    }
  };

  useEffect(() => {
    console.log("로그인 콜백 페이지 초기화...");

    // 페이지가 로드될 때 실행
    try {
      // 1. URL 쿼리 파라미터에서 accessToken 가져오기
      const urlAccessToken = searchParams.get("accessToken");
      console.log("URL 파라미터에서 accessToken 추출 시도:", urlAccessToken ? "성공" : "실패", urlAccessToken);

      if (urlAccessToken) {
        // URL에 accessToken이 있으면 user/info API 호출
        callUserInfo(urlAccessToken);
        return; // API 호출 후 종료
      }

      // 2. 쿠키에서 accessToken 가져오기 (URL에 없을 경우 시도)
      const cookieAccessToken = getCookie("accessToken");
      console.log("쿠키에서 accessToken 추출 시도:", cookieAccessToken ? "성공" : "실패", cookieAccessToken);

      if (cookieAccessToken) {
        // 쿠키에 accessToken이 있으면 user/info API 호출
        callUserInfo(cookieAccessToken);
        return; // API 호출 후 종료
      }

      // 3. HTML 문서에서 JSON 데이터 찾는 기존 로직 (URL과 쿠키 모두 없을 경우)
      setMessage("토큰을 찾을 수 없어 페이지 내용을 분석합니다...");
      const jsonContent = document.body.textContent || document.body.innerText || "";
      console.log("페이지 내용 분석 시작. 길이:", jsonContent.length);
      console.log("페이지 내용 미리보기:", jsonContent.substring(0, 100));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let extractedData: any = null;
      let dataSource = "";

      try {
        // 첫 번째 방법: 전체 내용을 JSON으로 파싱 시도
        console.log("전체 콘텐츠 파싱 시도...");
        extractedData = JSON.parse(jsonContent.trim());
        dataSource = "전체 콘텐츠";
        console.log("전체 콘텐츠 파싱 성공");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e1) {
        console.log("전체 콘텐츠 파싱 실패, 대괄호 패턴 시도...");
        // 두 번째 방법: 대괄호로 시작하는 JSON 찾기 시도
        const jsonMatch = jsonContent.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (jsonMatch) {
          console.log("대괄호 패턴 찾음:", jsonMatch[0].substring(0, 100));
          try {
            extractedData = JSON.parse(jsonMatch[0]);
            dataSource = "대괄호 패턴 추출";
            console.log("대괄호 패턴 파싱 성공");
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (e2) {
            console.log("대괄호 패턴 파싱 실패");
          }
        } else {
          console.log("대괄호 패턴 못 찾음");
        }

        // 세 번째 방법: pre 태그에서 찾기
        if (!extractedData) {
          console.log("pre 태그 검색 시도...");
          const preTags = document.querySelectorAll("pre");
          console.log("pre 태그 수:", preTags.length);
          for (let i = 0; i < preTags.length; i++) {
            try {
              const preContent = preTags[i].textContent || "";
              console.log(`pre 태그 ${i + 1} 내용 미리보기:`, preContent.substring(0, 100));
              extractedData = JSON.parse(preContent.trim());
              dataSource = "pre 태그 추출";
              console.log(`pre 태그 ${i + 1} 파싱 성공`);
              break;
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (e3) {
              console.log(`pre 태그 ${i + 1} 파싱 실패`);
            }
          }
        }
      }

      // 디버깅 정보 설정
      const debugText =
        `페이지 URL: ${window.location.href}\n` +
        `문서 길이: ${jsonContent.length} 자\n` +
        `추출 방법: ${dataSource || "추출 실패"}\n\n` +
        `원본 콘텐츠 미리보기 (처음 500자):\n${jsonContent.substring(0, 500)}...\n\n` +
        `파싱된 데이터:\n${extractedData ? JSON.stringify(extractedData, null, 2) : "파싱 실패"}`;

      setDebugInfo(debugText);
      console.log("디버그 정보 설정 완료");

      if (extractedData) {
        console.log("데이터 추출 성공");

        // 로컬 스토리지에 데이터 저장
        try {
          localStorage.setItem("loginData", JSON.stringify(extractedData));
          console.log("로컬 스토리지에 데이터 저장 완료");

          // 사용자 데이터에서 cellphone 확인
          const userData = extractedData[0]?.data?.[0];
          if (userData) {
            setStatus("success");
            setMessage("로그인 성공! 리다이렉트 중...");

            // cellphone 유무에 따라 리다이렉션
            setTimeout(() => {
              if (!userData.cellphone) {
                // 전화번호가 없는 경우 추가 정보 입력 모달이 있는 /ai 페이지로 이동
                console.log("전화번호 정보가 없어 추가 정보 모달 표시를 위해 /ai로 이동");
                window.location.href = "/ai";
              } else {
                // 전화번호가 있는 경우 바로 /ai 페이지로 이동
                console.log("전화번호 정보가 있어 바로 /ai로 이동");
                window.location.href = "/ai";
              }
            }, 1500);
          } else {
            throw new Error("유효하지 않은 사용자 데이터 형식");
          }
        } catch (storageErr) {
          console.error("로컬 스토리지 저장 오류:", storageErr);
          setStatus("error");
          setMessage("로그인 데이터 저장 중 오류가 발생했습니다. 디버그 정보를 확인해주세요.");
          setShowDebug(true);
        }
      } else {
        console.log("데이터 추출 실패");
        setStatus("error");
        setMessage("오류: 유효한 JSON 데이터를 찾을 수 없습니다. 디버그 정보를 확인해주세요.");
        setShowDebug(true);
      }
    } catch (error) {
      console.error("전체 처리 오류:", error);
      setStatus("error");
      setMessage("처리 중 오류가 발생했습니다. 디버그 정보를 확인해주세요.");
      setShowDebug(true);
    }
  }, [searchParams]);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(debugInfo)
      .then(() => alert("디버그 정보가 클립보드에 복사되었습니다."))
      .catch((err) => alert("복사 실패: " + err));
  };

  // 데이터만 복사 (JSON 형식)
  const copyJsonData = () => {
    try {
      // JSON 데이터 부분만 추출 시도
      const jsonMatch = debugInfo.match(/파싱된 데이터:\n([\s\S]*)/);
      const jsonData = jsonMatch ? jsonMatch[1] : "";

      navigator.clipboard
        .writeText(jsonData)
        .then(() => alert("JSON 데이터가 클립보드에 복사되었습니다."))
        .catch((err) => alert("복사 실패: " + err));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      alert("JSON 데이터 추출 실패");
    }
  };

  const goBackToMainPage = () => {
    window.location.href = "/ai"; // AI 페이지로 돌아가기
  };

  return (
    <Container>
      <Message>{message}</Message>

      {status === "processing" && (
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
      )}

      {status === "error" && (
        <>
          {!showDebug && <DebugButton onClick={() => setShowDebug(true)}>디버그 정보 보기</DebugButton>}

          {showDebug && (
            <>
              <DebugInfo>{debugInfo}</DebugInfo>
              <div style={{ display: "flex", gap: "10px", marginTop: "10px", justifyContent: "center" }}>
                <CopyButton onClick={copyToClipboard}>디버그 정보 복사</CopyButton>
                <CopyButton onClick={copyJsonData} style={{ backgroundColor: "#FF9800" }}>
                  JSON만 복사
                </CopyButton>
              </div>
            </>
          )}

          <GoBackButton onClick={goBackToMainPage}>메인 페이지로 돌아가기</GoBackButton>
        </>
      )}

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
    </Container>
  );
}
