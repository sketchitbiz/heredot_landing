// import { SYSTEM_INSTRUCTION } from "@/config/ai/instruction"; // 경로 수정
// import { collection, getDocs, getFirestore, query } from "firebase/firestore"; // Firestore 관련 import 제거
import {
  ChatSession, // 타입 직접 사용
  GenerativeModel, // 타입 직접 사용
  getGenerativeModel, // 함수 사용
  getVertexAI, // 함수 사용
} from "firebase/vertexai"; // 미리보기(-preview) 제거
import { useEffect, useRef } from "react";

// GenerativeModelType, ChatSessionType 제거

export default function useAI() {
  // 모델 이름을 상수로 정의 (필요시 환경 변수 등에서 관리)
  // const GEMINI_MODEL = "gemini-2.5-pro-preview-03-25";
  const GEMINI_MODEL = "gemini-2.5-flash-preview-04-17";
  // const GEMINI_MODEL = "gemini-2.0-flash";

  // useRef 타입 직접 지정, 초기값 null
  const model = useRef<GenerativeModel | null>(null);
  const chat = useRef<ChatSession | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    // 초기화 로직은 한 번만 실행
    if (!initialized.current) {
      const initializeAI = async () => {
        try {
          const apiHost = process.env.NEXT_PUBLIC_API_HOST || ""; // 환경 변수 또는 기본값 사용

          // 1. 지침(Instructions) 데이터 가져오기 (API 사용 - POST 요청)
          const instructionsResponse = await fetch(`${apiHost}/ai/instructions/get-list`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            // body: JSON.stringify({}), // 필요시 요청 본문 추가
          });
          if (!instructionsResponse.ok) {
            throw new Error(
              `Failed to fetch instructions: ${instructionsResponse.statusText} (URL: ${instructionsResponse.url})`
            );
          }
          const instructionsResult = await instructionsResponse.json();

          // 모든 instruction의 content를 합치기
          let allInstructionsContent = "";
          if (instructionsResult && instructionsResult[0]?.data) {
            instructionsResult[0].data.forEach((instr: any) => {
              if (instr.content) {
                allInstructionsContent += instr.content + "\n\n"; // 각 지침 사이에 줄바꿈 추가
              }
            });
          } else {
            console.error(
              "Unexpected API response structure for instructions:",
              JSON.stringify(instructionsResult, null, 2)
            );
            throw new Error("Could not extract instructions from API response");
          }

          if (!allInstructionsContent) {
            throw new Error("No instruction content found in API response");
          }

          // 2. 기능(Features) 데이터 가져오기 (API 사용 - POST 요청)
          const featuresResponse = await fetch(`${apiHost}/ai/features/get-list`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            // body: JSON.stringify({}), // 필요시 요청 본문 추가
          });
          if (!featuresResponse.ok) {
            throw new Error(`Failed to fetch features: ${featuresResponse.statusText} (URL: ${featuresResponse.url})`);
          }
          const featuresResult = await featuresResponse.json();

          // 기능 데이터 추출 및 문자열 변환
          let featuresDataString = "";
          if (featuresResult && featuresResult[0]?.data) {
            // API 응답이 배열의 첫 요소에 data 필드를 포함한다고 가정
            featuresDataString = JSON.stringify(featuresResult[0].data, null, 2);
          } else {
            console.error("Unexpected API response structure for features:", JSON.stringify(featuresResult, null, 2));
            throw new Error("Could not extract features from API response");
          }

          // --- Firestore 로직 제거 ---
          // const q = query(collection(getFirestore(), "features"));
          // const querySnapshot = await getDocs(q);
          // let featuresData = "";
          // querySnapshot.forEach((doc) => {
          //   featuresData += JSON.stringify(doc.data()) + "\n";
          // });

          // 시스템 명령어 업데이트 (API 지침 + API 데이터)
          const updatedSystemInstruction = `${allInstructionsContent}<DATA>
${featuresDataString}</DATA>`;
          console.log("Initializing AI with combined System Instruction from APIs...");

          // Vertex AI 인스턴스 가져오기
          const vertexAI = getVertexAI();

          // Generative 모델 초기화
          const generativeModelInstance = getGenerativeModel(vertexAI, {
            model: GEMINI_MODEL,
            systemInstruction: updatedSystemInstruction, // API 지침과 API 데이터를 결합하여 사용
          });
          model.current = generativeModelInstance; // 타입 일치

          // 채팅 세션 시작
          chat.current = generativeModelInstance.startChat(); // 타입 일치

          console.log(`AI Model (${GEMINI_MODEL}) and Chat initialized successfully.`);
          initialized.current = true; // 초기화 완료 플래그 설정
        } catch (error) {
          console.error("Error initializing AI:", error);
          // 오류 발생 시 model.current와 chat.current는 null로 남음
        }
      };

      initializeAI();
    }
  }, []); // 빈 의존성 배열로 마운트 시 한 번만 실행

  // 초기화된 model과 chat ref 반환
  return { model, chat, modelName: GEMINI_MODEL };
}
