// src/hooks/useAI.ts
import {
  ChatSession,
  GenerativeModel,
  getGenerativeModel,
  getVertexAI,
} from 'firebase/vertexai';
import { useEffect, useRef, useState } from 'react';
import apiClient from '@/lib/apiClient';
import useAuthStore from '@/store/authStore';
import { devLog } from '@/lib/utils/devLogger';
import { app } from '@/lib/firebase/firebase.config'; // 임포트 경로 확인

export default function useAI() {
  const [modelIdentifier, setModelIdentifier] = useState(
    'gemini-2.5-flash'
    // 'gemini-2.5-flash-lite-preview-06-17'
  );

  const NON_STREAMING_MODELS = ['gemini-2.5-flash-lite-preview-06-17'];
  const isStreamingSupported = !NON_STREAMING_MODELS.includes(modelIdentifier);

  //gemini-2.0-flash
  //gemini-2.5-flash-preview-05-20
  const model = useRef<GenerativeModel | null>(null);
  const chat = useRef<ChatSession | null>(null);
  const initialized = useRef(false);
  const user = useAuthStore((state) => state.user);
  const [currentThinkingBudget, setCurrentThinkingBudget] = useState<
    number | undefined
  >(0);

  const estimateTokenCostKRW = (
    inputTokens: number,
    outputTokens: number,
    modelName: string,
    exchangeRate = 1356 // 1 USD = 1356 KRW
  ): {
    input: { usd: number; krw: number };
    output: { usd: number; krw: number };
    total: { usd: number; krw: number };
  } => {
    let inputPricePerMillion = 0;
    let outputPricePerMillion = 0;
    const TOKEN_THRESHOLD = 200000; // 20만 토큰 기준

    switch (modelName) {
      case 'gemini-2.5-pro':
        // 입력: 20만 토큰 미만 $1.25, 초과 $2.50
        inputPricePerMillion = inputTokens < TOKEN_THRESHOLD ? 1.25 : 2.5;
        // 출력: 20만 토큰 미만 $10.00, 초과 $15.00
        outputPricePerMillion = outputTokens < TOKEN_THRESHOLD ? 10.0 : 15.0;
        break;
      case 'gemini-2.5-flash':
        // 입력: $0.30 (텍스트)
        inputPricePerMillion = 0.3;
        // 출력: $2.50
        outputPricePerMillion = 2.5;
        break;
      case 'gemini-2.5-flash-lite-preview-06-17':
        // 입력: $0.10
        inputPricePerMillion = 0.1;
        // 출력: $0.40
        outputPricePerMillion = 0.4;
        break;
      default:
        // 기본값으로 Flash 모델 가격 사용
        inputPricePerMillion = 0.3;
        outputPricePerMillion = 2.5;
        break;
    }

    // 토큰 수를 백만 단위로 변환하여 계산
    const inputUsd = (inputTokens / 1_000_000) * inputPricePerMillion;
    const outputUsd = (outputTokens / 1_000_000) * outputPricePerMillion;
    const totalUsd = inputUsd + outputUsd;

    return {
      input: {
        usd: inputUsd,
        krw: Math.round(inputUsd * exchangeRate),
      },
      output: {
        usd: outputUsd,
        krw: Math.round(outputUsd * exchangeRate),
      },
      total: {
        usd: totalUsd,
        krw: Math.round(totalUsd * exchangeRate),
      },
    };
  };

  useEffect(() => {
    const initializeAI = async () => {
      devLog(
        `[useAI] Starting AI initialization with model: ${modelIdentifier}...`
      );
      devLog('[useAI] Current user state for initialization:', user);
      initialized.current = false;
      try {
        if (!app) {
          console.error(
            '[useAI] ERROR: Firebase app instance is not initialized. Cannot initialize Vertex AI.'
          );
          throw new Error('Firebase app not available.');
        }

        const apiHost = process.env.NEXT_PUBLIC_API_HOST || '';
        if (!apiHost) {
          console.error(
            '[useAI] ERROR: NEXT_PUBLIC_API_HOST environment variable is not set.'
          );
          throw new Error('API host is not configured.');
        }
        devLog(`[useAI] API Host: ${apiHost}`);

        // --- 지침 및 가격 데이터 로딩 로직 시작 ---
        console.log(
          `[useAI] Fetching instructions from: /ai/instructions/get-list`
        );
        let instructionsResponse;
        try {
          instructionsResponse = await apiClient.post(
            '/ai/instructions/get-list',
            {}
          );
          console.log(
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

        devLog(`[useAI] Fetching unit prices from: /ai/unit-price/get-list`);
        let unitPriceResponse;
        try {
          unitPriceResponse = await apiClient.post(
            '/ai/unit-price/get-list',
            {}
          );
        } catch (fetchError) {
          console.error(
            `[useAI] Fetch error for unit prices: ${
              fetchError instanceof Error
                ? fetchError.message
                : String(fetchError)
            }`,
            fetchError
          );
          throw new Error(
            `Network error fetching unit prices: ${
              fetchError instanceof Error
                ? fetchError.message
                : String(fetchError)
            }`
          );
        }

        devLog('[useAI] Unit Price API response is OK. Parsing JSON...');
        const unitPriceResult = unitPriceResponse.data;
        let unitPriceDataString = '';
        if (
          unitPriceResult &&
          Array.isArray(unitPriceResult) &&
          unitPriceResult.length > 0 &&
          unitPriceResult[0] &&
          typeof unitPriceResult[0] === 'object' &&
          unitPriceResult[0].data &&
          Array.isArray(unitPriceResult[0].data)
        ) {
          unitPriceDataString = JSON.stringify(
            unitPriceResult[0].data,
            null,
            2
          );
        } else {
          console.error(
            '[useAI] Unexpected API response structure for unit prices. Expected response.data to be an array containing an object with a "data" array property.',
            JSON.stringify(unitPriceResult, null, 2)
          );
          throw new Error(
            'Could not extract unit prices from API response: structure mismatch or data missing.'
          );
        }
        devLog(
          '[useAI] Combined unitPriceDataString. Length:',
          unitPriceDataString.length
        );

        const userPhoneCode = user?.countryCode;
        devLog('[useAI] User phone code from user object:', userPhoneCode);
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
   - 'FR', 'BE', 'CH': 프랑스어
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

        devLog(
          '[useAI] Generated localizationInstruction:',
          localizationInstruction
        );

        const updatedSystemInstruction = `${allInstructionsContent}<DATA>
${unitPriceDataString}
</DATA>

${localizationInstruction}`;
        devLog(
          '[useAI] Final updatedSystemInstruction length:',
          updatedSystemInstruction.length
        );
        // devLog('[useAI] Final updatedSystemInstruction content:', updatedSystemInstruction); // 내용이 너무 길면 주석 처리

        devLog('[useAI] About to initialize VertexAI and GenerativeModel.');

        // Vertex AI 호출 시 location을 명시적으로 제거하고, Firebase 앱 인스턴스만 전달
        const vertexAI = getVertexAI(app); // location 옵션 제거

        devLog(
          `[useAI] Initializing GenerativeModel with model: ${modelIdentifier}`
        );

        const generationConfig: {
          thinkingConfig?: { thinking_budget: number };
        } = {};
        if (currentThinkingBudget !== undefined) {
          generationConfig.thinkingConfig = {
            thinking_budget: currentThinkingBudget,
          };
        }
        devLog(`[useAI] Applying thinkingBudget: ${currentThinkingBudget}`);

        const generativeModelInstance = getGenerativeModel(vertexAI, {
          model: modelIdentifier,
          systemInstruction: updatedSystemInstruction,
          generationConfig: generationConfig,
        });
        model.current = generativeModelInstance;
        devLog('[useAI] GenerativeModel initialized. Starting chat...');

        chat.current = generativeModelInstance.startChat();
        devLog('[useAI] Chat session started successfully.');

        devLog(
          `[useAI] AI Model (${modelIdentifier}) and Chat initialized successfully. ThinkingBudget: ${currentThinkingBudget}`
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

    devLog(
      '[useAI] Starting AI initialization process... Effect triggered by user or modelIdentifier change.'
    );
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
  }, [user, modelIdentifier]);

  useEffect(() => {
    devLog('[useAI] Current initialization status:', initialized.current);
    return () => {
      devLog(
        '[useAI] Component using useAI is unmounting, initialized =',
        initialized.current
      );
    };
  }, []);

  const sendMessageWithCostLogging = async (input: string) => {
    if (!chat.current) {
      console.warn('[useAI] Chat not initialized');
      return;
    }

    const result = await chat.current.sendMessage(input);

    if (result?.usageMetadata?.candidatesTokenCount) {
      const outputTokens = result.usageMetadata.candidatesTokenCount[0] || 0;
      const { usd, krw } = estimateTokenCostKRW(
        0,
        outputTokens,
        modelIdentifier
      );
      devLog(
        `[useAI] 출력 토큰 수: ${outputTokens} tokens → 예상 비용: $${usd.toFixed(
          4
        )} ≒ ₩${krw.toLocaleString()}`
      );
    }

    return result;
  };

  const setCurrentModelIdentifier = (newModelIdentifier: string) => {
    if (modelIdentifier !== newModelIdentifier) {
      devLog(`[useAI] Changing model identifier to: ${newModelIdentifier}`);
      setModelIdentifier(newModelIdentifier);
    }
  };

  return {
    model,
    chat,
    modelName: modelIdentifier,
    isInitialized: initialized,
    setCurrentModelIdentifier,
    sendMessageWithCostLogging,
    estimateTokenCostKRW,
    isStreamingSupported,
  };
}
