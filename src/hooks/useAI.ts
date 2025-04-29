import { SYSTEM_INSTRUCTION } from "@/config/ai/instruction"; // 경로 수정
import { collection, getDocs, getFirestore, query } from "firebase/firestore";
import {
  ChatSession, // 타입으로 사용
  GenerativeModel, // 타입으로 사용
  getGenerativeModel, // 함수 사용
  getVertexAI, // 함수 사용
} from "firebase/vertexai"; // 미리보기(-preview) 제거
import { useEffect, useRef } from "react";

// GenerativeModel, ChatSession 타입을 명시적으로 가져옵니다.
// 'firebase/vertexai-preview'에서 실제 타입을 가져와야 합니다.
// 임시로 any를 사용합니다.
type GenerativeModelType = any;
type ChatSessionType = any;

export default function useAI() {
  // 모델 이름을 상수로 정의 (필요시 환경 변수 등에서 관리)
  // const GEMINI_MODEL = "gemini-2.5-pro-preview-03-25";
  const GEMINI_MODEL = "gemini-2.5-flash-preview-04-17";
  // const GEMINI_MODEL = "gemini-2.0-flash";

  // useRef의 초기값 타입을 명시적으로 지정 (any 사용)
  const model = useRef<GenerativeModelType>(null as any);
  const chat = useRef<ChatSessionType>(null as any);
  const initialized = useRef(false);

  useEffect(() => {
    // 초기화 로직은 한 번만 실행
    if (!initialized.current) {
      const initializeAI = async () => {
        try {
          // Firestore에서 features 데이터 가져오기
          const q = query(collection(getFirestore(), "features"));
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
          const vertexAI = getVertexAI();

          // Generative 모델 초기화
          model.current = getGenerativeModel(vertexAI, {
            model: GEMINI_MODEL,
            systemInstruction: updatedSystemInstruction,
          });

          // 채팅 세션 시작
          chat.current = model.current.startChat();

          console.log(`AI Model (${GEMINI_MODEL}) and Chat initialized successfully.`);
          initialized.current = true; // 초기화 완료 플래그 설정
        } catch (error) {
          console.error("Error initializing AI:", error);
          // 오류 처리 로직 추가 가능
        }
      };

      initializeAI();
    }
  }, []); // 빈 의존성 배열로 마운트 시 한 번만 실행

  // 초기화된 model과 chat ref 반환
  return { model, chat, modelName: GEMINI_MODEL };
}
