import { SYSTEM_INSTRUCTION } from "@/config/ai/instruction"; // 경로 수정
import { collection, getDocs, getFirestore, query } from "firebase/firestore";
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
          // Firestore에서 features 데이터 가져오기
          const q = query(collection(getFirestore(), "features")); // <- 여기서 Firebase 앱 초기화 필요
          const querySnapshot = await getDocs(q);

          let featuresData = "";
          querySnapshot.forEach((doc) => {
            // 데이터를 문자열로 조합 (필요에 따라 형식 변경)
            featuresData += JSON.stringify(doc.data()) + "\n";
          });

          // 시스템 명령어 업데이트
          const updatedSystemInstruction = `${SYSTEM_INSTRUCTION}\n<DATA>\n${featuresData}</DATA>`;
          console.log("Initializing AI with System Instruction:", updatedSystemInstruction);

          // Vertex AI 인스턴스 가져오기 (Firebase 앱 초기화 선행 필요)
          const vertexAI = getVertexAI(); // <- 여기서 Firebase 앱 초기화 필요

          // Generative 모델 초기화
          const generativeModelInstance = getGenerativeModel(vertexAI, {
            model: GEMINI_MODEL,
            systemInstruction: updatedSystemInstruction,
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
