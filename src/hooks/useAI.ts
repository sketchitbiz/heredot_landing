// import { SYSTEM_INSTRUCTION } from "@/config/ai/instruction"; // 경로 수정
// import { collection, getDocs, getFirestore, query } from "firebase/firestore"; // Firestore 관련 import 제거
import {
  ChatSession, // 타입 직접 사용
  GenerativeModel, // 타입 직접 사용
  getGenerativeModel, // 함수 사용
  getVertexAI, // 함수 사용
} from 'firebase/vertexai'; // 미리보기(-preview) 제거
import { useEffect, useRef, useState } from 'react'; // useState 추가
import apiClient from '@/lib/apiClient'; // apiClient import 추가
import useAuthStore from '@/store/authStore'; // authStore import 추가
import {devLog} from '@/lib/utils/devLogger';

// GenerativeModelType, ChatSessionType 제거

export default function useAI() {
  // 모델 이름을 상태로 관리하여 동적으로 변경 가능하도록 수정
  const [modelIdentifier, setModelIdentifier] = useState('gemini-2.0-flash'); // 기본 모델

  // useRef 타입 직접 지정, 초기값 null
  const model = useRef<GenerativeModel | null>(null);
  const chat = useRef<ChatSession | null>(null);
  const initialized = useRef(false);

  // 사용자 정보 가져오기
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    // 초기화 로직은 한 번만 실행 (또는 모델 식별자가 변경될 때)
    // initialized.current = false; // 모델 변경 시 재초기화를 위해 초기화 상태를 리셋할 수 있으나, 전체 로직 재실행은 비효율적일 수 있음
    // 여기서는 modelIdentifier 변경 시 전체 재초기화 로직을 따름

    const initializeAI = async () => {
      devLog(
        `[useAI] Starting AI initialization with model: ${modelIdentifier}...`
      );
      initialized.current = false; // 재초기화 시작 시 플래그 리셋
      try {
        const apiHost = process.env.NEXT_PUBLIC_API_HOST || '';
        if (!apiHost) {
          console.error(
            '[useAI] ERROR: NEXT_PUBLIC_API_HOST environment variable is not set.'
          );
          throw new Error('API host is not configured.');
        }
        devLog(`[useAI] API Host: ${apiHost}`);

        // 1. 지침(Instructions) 데이터 가져오기 (API 사용 - POST 요청)
        devLog(
          `[useAI] Fetching instructions from: /ai/instructions/get-list`
        );
        let instructionsResponse;
        try {
          instructionsResponse = await apiClient.post(
            '/ai/instructions/get-list',
            {}
          );
          devLog(
            '[useAI] Instructions API response received. Status:',
            instructionsResponse.status
          );
        } catch (fetchError) {
          console.error(
            `[useAI] Fetch error for instructions: ${
              fetchError instanceof Error
                ? fetchError.message
                : String(fetchError)
            }`,
            fetchError
          );
          throw new Error(
            `Network error fetching instructions: ${
              fetchError instanceof Error
                ? fetchError.message
                : String(fetchError)
            }`
          );
        }

        devLog('[useAI] Instructions API response is OK. Parsing JSON...');
        const instructionsResult = instructionsResponse.data;
        devLog(
          '[useAI] Successfully parsed instructions JSON:',
          JSON.stringify(instructionsResult, null, 2)
        );

        let allInstructionsContent = '';
        if (
          instructionsResult &&
          Array.isArray(instructionsResult) &&
          instructionsResult.length > 0 &&
          instructionsResult[0].data &&
          Array.isArray(instructionsResult[0].data)
        ) {
          instructionsResult[0].data.forEach((instr: { content?: string }) => {
            if (instr && typeof instr.content === 'string') {
              allInstructionsContent += instr.content + '\n\n';
            }
          });
        } else {
          console.error(
            '[useAI] Unexpected API response structure for instructions or no data found. Expected array with [0].data as array:',
            JSON.stringify(instructionsResult, null, 2)
          );
          throw new Error(
            'Could not extract instructions from API response or data is missing/not an array.'
          );
        }

        if (!allInstructionsContent.trim()) {
          console.error(
            '[useAI] No actual instruction content found after processing API response.'
          );
          throw new Error('No instruction content found');
        }
        devLog(
          '[useAI] Combined allInstructionsContent. Length:',
          allInstructionsContent.length
        );

        // 2. 기능(Features) 데이터 가져오기 (API 사용 - POST 요청)
        devLog(`[useAI] Fetching features from: /ai/features/get-list`);
        let featuresResponse;
        try {
          featuresResponse = await apiClient.post('/ai/features/get-list', {});
          devLog(
            '[useAI] Features API response received. Status:',
            featuresResponse.status
          );
        } catch (fetchError) {
          console.error(
            `[useAI] Fetch error for features: ${
              fetchError instanceof Error
                ? fetchError.message
                : String(fetchError)
            }`,
            fetchError
          );
          throw new Error(
            `Network error fetching features: ${
              fetchError instanceof Error
                ? fetchError.message
                : String(fetchError)
            }`
          );
        }

        devLog('[useAI] Features API response is OK. Parsing JSON...');
        const featuresResult = featuresResponse.data;
        devLog(
          '[useAI] Successfully parsed features JSON:',
          JSON.stringify(featuresResult, null, 2)
        );

        let featuresDataString = '';
        if (
          featuresResult &&
          Array.isArray(featuresResult) &&
          featuresResult.length > 0 &&
          featuresResult[0].data
        ) {
          featuresDataString = JSON.stringify(featuresResult[0].data, null, 2);
        } else {
          console.error(
            '[useAI] Unexpected API response structure for features or no data found. Expected array with [0].data:',
            JSON.stringify(featuresResult, null, 2)
          );
          throw new Error(
            'Could not extract features from API response or data is missing.'
          );
        }
        devLog(
          '[useAI] Combined featuresDataString. Length:',
          featuresDataString.length
        );

        const userPhoneCode = user?.countryCode;
        let mappedIsoCode = 'KR';
        let targetLanguage = 'ko';
        let targetCountryName = 'South Korea';

        const phoneToIsoMap: { [key: string]: string } = {
          '+82': 'KR',
          '+1': 'US',
          '+81': 'JP',
          '+61': 'AU',
          '+64': 'NZ',
        };

        const isoToLangMap: { [key: string]: string } = {
          KR: 'ko',
          US: 'en',
          JP: 'ja',
          AU: 'en',
          NZ: 'en',
        };

        const isoToCountryNameMap: { [key: string]: string } = {
          KR: 'South Korea',
          US: 'United States',
          JP: 'Japan',
          AU: 'Australia',
          NZ: 'New Zealand',
        };

        if (userPhoneCode && phoneToIsoMap[userPhoneCode]) {
          mappedIsoCode = phoneToIsoMap[userPhoneCode];
          if (isoToLangMap[mappedIsoCode]) {
            targetLanguage = isoToLangMap[mappedIsoCode];
          }
          if (isoToCountryNameMap[mappedIsoCode]) {
            targetCountryName = isoToCountryNameMap[mappedIsoCode];
          }
        } else if (userPhoneCode) {
          console.warn(
            `[useAI] Unmapped phone code ${userPhoneCode}, defaulting to US/en/United States.`
          );
        }

        devLog(
          `[useAI] User phone code: ${userPhoneCode}, Mapped ISO code: ${mappedIsoCode}, Target language: ${targetLanguage}, Target country: ${targetCountryName}`
        );

        // 다국어 및 통화 변환 관련 지침 수정
        //country_code: ${mappedIsoCode}
        //default_country: ${targetCountryName} // 동적으로 설정된 국가 이름 사용

        //country_code: +081
        //default_country: japan
        const localizationInstruction = `
<USER_COUNTRY_INFO>
country_code: ${mappedIsoCode}
default_country: ${targetCountryName}
default_currency: KR
default_language: ${targetLanguage}

AI 지침:
1. 사용자의 국가 코드(${mappedIsoCode}) 및 설정된 언어(${targetLanguage})에 따라 해당 언어로 응답하세요.
   - 'KR': 한국어
   - 'US', 'GB', 'CA', 'AU', 'NZ': 영어
   - 'JP': 일본어
   - 'CN', 'HK', 'TW': 중국어(간체 또는 번체)
   - 'DE', 'AT', 'CH': 독일어
   - 'FR', 'BE', 'CH': 프랑스어Unhandled Runtime Error


Error: valueCellStyle is not defined

src/components/Ai/AiChatMessage.tsx (1472:36) @ AiChatMessage


  1470 |                       <strong>{t.estimateInfo.vatIncluded}</strong>
  1471 |                     </td>
> 1472 |                     <td style={{...valueCellStyle, textAlign: 'right', fontWeight: 'bold'}}>
       |                                    ^
  1473 |                       <strong>
  1474 |                         {formatAmountWithCurrency(
  1475 |                           Math.round((calculatedTotalAmount || 0) * 1.1),
Call Stack
6

AiChatMessage
src/components/Ai/AiChatMessage.tsx (1472:36)
eval
src/app/ai/components/ChatContent.tsx (234:11)
Array.map
<anonymous> (0:0)
ChatContent
src/app/ai/components/ChatContent.tsx (233:19)
AiPageContent
src/app/ai/AiPageContent.tsx (1067:11)
AIPage
src/app/ai/page.tsx (9:7)
   - 'ES', 'MX', 'AR', 'CO': 스페인어
   - 'PT', 'BR': 포르투갈어
   - 'IT': 이탈리아어
   - 'NL', 'BE': 네덜란드어
   - 'RU': 러시아어
   - 'VN': 베트남어
   - 'TH': 태국어
   - 'ID': 인도네시아어
   - 기타 국가 코드: 영어를 기본 언어로 사용

2. 국가 코드에 따라 적절한 통화로 금액을 표시하고, 괄호 안에 원래 금액(KRW)도 함께 표시합니다:
   - 'KR': 원화(KRW) - 예: "₩3,000,000"
   - 'US', 'CA', 'AU', 'NZ': 달러(USD, CAD, AUD, NZD) - 예: "$2,500 (₩3,000,000)"
   - 'JP': 엔화(JPY) - 예: "¥30,000 (₩300,000)"
   - 'CN', 'HK', 'TW': 위안화/홍콩달러/대만달러 - 예: "¥500 (₩100,000)"
   - 'EU', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT': 유로(EUR) - 예: "€2,100 (₩3,000,000)"
   - 'GB': 파운드(GBP) - 예: "£1,800 (₩3,000,000)"
   - 기타 국가: 달러(USD)로 표시 - 예: "$2,500 (₩3,000,000)"

3. 문화적 맥락에 맞게 소통하세요:
   - 한국어: 존댓말을 사용하고, 한국의 문화적 맥락에 맞는 표현 사용
   - 일본어: 경어체를 사용하고, 일본의 비즈니스 예절에 맞는 표현 사용
   - 중국어: 중국의 비즈니스 관습에 맞는 표현과 예의 갖춘 표현 사용
   - 기타 언어: 각 문화권에 적절한 존칭과 비즈니스 예절 따르기

4. 사용자가 언어를 명시적으로 전환한 경우(예: 영어로 질문하면 영어로 응답), 사용자가 선택한 언어를 우선적으로 사용하세요.

5. 모든 응답에서 사용자 경험을 최우선으로 고려하고, 자연스러운 대화를 유지하세요.

통화 변환 기준 환율 (2023년 최신 기준):
- 1 USD = 1,415KRW
- 1 JPY = 9 KRW
- 1 CNY = 190 KRW
- 1 EUR = 1,450 KRW
- 1 GBP = 1,700 KRW
- 1 CAD = 1,000 KRW
- 1 AUD = 900 KRW
- 1 HKD = 170 KRW
- 1 TWD = 42 KRW
- 1 SGD = 1,000 KRW
- 1 THB = 38 KRW
- 1 VND = 0.055 KRW
- 1 IDR = 0.088 KRW

JSON 생성 시 주의사항:
1. invoiceGroup[].items[].amount 필드는 항상 원래 KRW 금액을 숫자로 유지합니다.
2. total.amount 필드는 항상 원래 KRW 금액의 합계를 숫자로 유지합니다.
3. 사용자에게 표시되는 텍스트(description, 안내 메시지)는 사용자의 언어로 번역합니다.
4. 견적서를 설명할 때는 환율을 적용한 금액과 원래 금액을 함께 표시합니다.
</USER_COUNTRY_INFO>
`;

        const updatedSystemInstruction = `${allInstructionsContent}<DATA>\n${featuresDataString}\n</DATA>\n\n${localizationInstruction}`;
        devLog(
          '[useAI] Initializing AI with combined System Instruction. Length:',
          updatedSystemInstruction.length
        );

        const vertexAI = getVertexAI();

        devLog(
          `[useAI] Initializing GenerativeModel with model: ${modelIdentifier}`
        );
        const generativeModelInstance = getGenerativeModel(vertexAI, {
          model: modelIdentifier, // 상태에서 현재 모델 식별자 사용
          systemInstruction: updatedSystemInstruction,
        });
        model.current = generativeModelInstance;
        devLog('[useAI] GenerativeModel initialized. Starting chat...');

        chat.current = generativeModelInstance.startChat();
        devLog('[useAI] Chat session started successfully.');

        devLog(
          `[useAI] AI Model (${modelIdentifier}) and Chat initialized successfully.`
        );
        initialized.current = true;
      } catch (error) {
        console.error(
          '[useAI] CRITICAL ERROR during AI initialization process:',
          error
        );
        initialized.current = false;
      }
    };

    devLog('[useAI] Starting AI initialization process...');
    initializeAI()
      .then(() => {
        devLog(
          '[useAI] AI initialization completed, initialized.current =',
          initialized.current
        );
      })
      .catch((e) => {
        console.error('[useAI] AI initialization FAILED with error:', e);
        initialized.current = false;
      });
  }, [user, modelIdentifier]); // modelIdentifier를 의존성 배열에 추가

  useEffect(() => {
    devLog('[useAI] Current initialization status:', initialized.current);
    return () => {
      devLog(
        '[useAI] Component using useAI is unmounting, initialized =',
        initialized.current
      );
    };
  }, []);

  // 외부에서 모델 식별자를 변경하는 함수
  const setCurrentModelIdentifier = (newModelIdentifier: string) => {
    if (modelIdentifier !== newModelIdentifier) {
      devLog(
        `[useAI] Changing model identifier to: ${newModelIdentifier}`
      );
      setModelIdentifier(newModelIdentifier);
      // initialized.current = false; // 모델 변경 시 재초기화 플래그 설정 (useEffect에서 이미 처리됨)
    }
  };

  return {
    model,
    chat,
    modelName: modelIdentifier, // 현재 모델 식별자 반환
    isInitialized: initialized,
    setCurrentModelIdentifier, // 모델 변경 함수 노출
  };
}
