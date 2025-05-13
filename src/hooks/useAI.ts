// import { SYSTEM_INSTRUCTION } from "@/config/ai/instruction"; // 경로 수정
// import { collection, getDocs, getFirestore, query } from "firebase/firestore"; // Firestore 관련 import 제거
import {
  ChatSession, // 타입 직접 사용
  GenerativeModel, // 타입 직접 사용
  getGenerativeModel, // 함수 사용
  getVertexAI, // 함수 사용
} from "firebase/vertexai"; // 미리보기(-preview) 제거
import { useEffect, useRef } from "react";
import apiClient from "@/lib/apiClient"; // apiClient import 추가

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
        console.log("[useAI] Starting AI initialization...");
        try {
          const apiHost = process.env.NEXT_PUBLIC_API_HOST || "";
          if (!apiHost) {
            console.error("[useAI] ERROR: NEXT_PUBLIC_API_HOST environment variable is not set.");
            throw new Error("API host is not configured.");
          }
          console.log(`[useAI] API Host: ${apiHost}`);

          // 1. 지침(Instructions) 데이터 가져오기 (API 사용 - POST 요청)
          // const instructionsApiUrl = `${apiHost}/ai/instructions/get-list`; // apiClient 사용으로 변경
          console.log(`[useAI] Fetching instructions from: /ai/instructions/get-list`);
          let instructionsResponse;
          try {
            // instructionsResponse = await fetch(instructionsApiUrl, { // apiClient 사용으로 변경
            //   method: "POST",
            //   headers: {
            //     "Content-Type": "application/json",
            //   },
            //   body: JSON.stringify({}), // 빈 객체라도 body를 포함
            // });
            instructionsResponse = await apiClient.post("/ai/instructions/get-list", {}); // apiClient 사용
            console.log("[useAI] Instructions API response received. Status:", instructionsResponse.status);
          } catch (fetchError) {
            console.error(
              `[useAI] Fetch error for instructions: ${
                fetchError instanceof Error ? fetchError.message : String(fetchError)
              }`,
              fetchError
            );
            throw new Error(
              `Network error fetching instructions: ${
                fetchError instanceof Error ? fetchError.message : String(fetchError)
              }`
            );
          }

          console.log("[useAI] Instructions API response is OK. Parsing JSON...");
          const instructionsResult = instructionsResponse.data; // .json() 대신 .data 사용
          console.log("[useAI] Successfully parsed instructions JSON:", JSON.stringify(instructionsResult, null, 2));

          // 모든 instruction의 content를 합치기
          let allInstructionsContent = "";
          // API 응답 구조에 대한 더 강력한 확인 추가
          if (
            instructionsResult &&
            Array.isArray(instructionsResult) &&
            instructionsResult.length > 0 &&
            instructionsResult[0].data &&
            Array.isArray(instructionsResult[0].data)
          ) {
            instructionsResult[0].data.forEach((instr: { content?: string }) => {
              // 타입 수정
              if (instr && typeof instr.content === "string") {
                // instr 객체 및 content 타입 확인
                allInstructionsContent += instr.content + "\n\n";
              }
            });
          } else {
            console.error(
              "[useAI] Unexpected API response structure for instructions or no data found. Expected array with [0].data as array:",
              JSON.stringify(instructionsResult, null, 2)
            );
            throw new Error("Could not extract instructions from API response or data is missing/not an array.");
          }

          if (!allInstructionsContent.trim()) {
            console.error("[useAI] No actual instruction content found after processing API response.");
            throw new Error("No instruction content found");
          }
          console.log("[useAI] Combined allInstructionsContent. Length:", allInstructionsContent.length);

          // 2. 기능(Features) 데이터 가져오기 (API 사용 - POST 요청)
          // const featuresApiUrl = `${apiHost}/ai/features/get-list`; // apiClient 사용으로 변경
          console.log(`[useAI] Fetching features from: /ai/features/get-list`);
          let featuresResponse;
          try {
            // featuresResponse = await fetch(featuresApiUrl, { // apiClient 사용으로 변경
            //   method: "POST",
            //   headers: {
            //     "Content-Type": "application/json",
            //   },
            //   body: JSON.stringify({}), // 빈 객체라도 body를 포함
            // });
            featuresResponse = await apiClient.post("/ai/features/get-list", {}); // apiClient 사용
            console.log("[useAI] Features API response received. Status:", featuresResponse.status);
          } catch (fetchError) {
            console.error(
              `[useAI] Fetch error for features: ${
                fetchError instanceof Error ? fetchError.message : String(fetchError)
              }`,
              fetchError
            );
            throw new Error(
              `Network error fetching features: ${
                fetchError instanceof Error ? fetchError.message : String(fetchError)
              }`
            );
          }

          console.log("[useAI] Features API response is OK. Parsing JSON...");
          const featuresResult = featuresResponse.data; // .json() 대신 .data 사용
          console.log("[useAI] Successfully parsed features JSON:", JSON.stringify(featuresResult, null, 2));

          // 기능 데이터 추출 및 문자열 변환 (응답 구조에 대한 더 강력한 확인 추가)
          let featuresDataString = "";
          if (featuresResult && Array.isArray(featuresResult) && featuresResult.length > 0 && featuresResult[0].data) {
            // API 응답이 배열의 첫 요소에 data 필드를 포함한다고 가정
            featuresDataString = JSON.stringify(featuresResult[0].data, null, 2);
          } else {
            console.error(
              "[useAI] Unexpected API response structure for features or no data found. Expected array with [0].data:",
              JSON.stringify(featuresResult, null, 2)
            );
            throw new Error("Could not extract features from API response or data is missing.");
          }
          console.log("[useAI] Combined featuresDataString. Length:", featuresDataString.length);

          const updatedSystemInstruction = `${allInstructionsContent}<DATA>\n${featuresDataString}\n</DATA>`;
          console.log(
            "[useAI] Initializing AI with combined System Instruction. Length:",
            updatedSystemInstruction.length
          );
          // console.log("[useAI] First 500 chars of system instruction:", updatedSystemInstruction.substring(0, 500));

          // Vertex AI 인스턴스 가져오기
          const vertexAI = getVertexAI();

          // Generative 모델 초기화
          console.log(`[useAI] Initializing GenerativeModel with model: ${GEMINI_MODEL}`);
          const generativeModelInstance = getGenerativeModel(vertexAI, {
            model: GEMINI_MODEL,
            systemInstruction: updatedSystemInstruction,
          });
          model.current = generativeModelInstance;
          console.log("[useAI] GenerativeModel initialized. Starting chat...");

          // 채팅 세션 시작
          chat.current = generativeModelInstance.startChat();
          console.log("[useAI] Chat session started successfully.");

          console.log(`[useAI] AI Model (${GEMINI_MODEL}) and Chat initialized successfully.`);
          initialized.current = true; // 초기화 완료 플래그 설정
        } catch (error) {
          console.error("[useAI] CRITICAL ERROR during AI initialization process:", error);
          initialized.current = false; // 초기화 실패 명시적으로 표시
        }
      };

      // 비동기 초기화 함수 호출
      console.log("[useAI] Starting AI initialization process...");
      initializeAI()
        .then(() => {
          console.log("[useAI] AI initialization completed, initialized.current =", initialized.current);
        })
        .catch((e) => {
          console.error("[useAI] AI initialization FAILED with error:", e);
          initialized.current = false;
        });
    }
  }, []); // 빈 의존성 배열로 마운트 시 한 번만 실행

  // 초기화 상태를 콘솔에 기록하여 디버깅 (개발 중에만 필요하면 process.env.NODE_ENV === 'development' 조건 추가 가능)
  useEffect(() => {
    console.log("[useAI] Current initialization status:", initialized.current);
    return () => {
      console.log("[useAI] Component using useAI is unmounting, initialized =", initialized.current);
    };
  }, []);

  // 초기화된 model과 chat ref 반환
  // isInitialized 상태도 반환하여 AiPageContent에서 AI 준비 상태를 명확히 알 수 있도록 함
  return { model, chat, modelName: GEMINI_MODEL, isInitialized: initialized };
  // initialized는 ref이므로 .current로 접근해야 하지만, 훅 사용자 입장에서는
  // 초기화 완료 여부를 boolean으로 받는 것이 더 편할 수 있습니다.
  // 이 경우, 별도의 state를 만들어 initialized.current 변경 시 업데이트하거나,
  // 아니면 사용하는 컴포넌트에서 ref.current를 확인하도록 안내합니다.
  // 여기서는 일단 ref 자체를 반환합니다.
}
