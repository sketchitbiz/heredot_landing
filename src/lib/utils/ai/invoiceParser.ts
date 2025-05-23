// src/utils/ai/invoiceParser.ts (수정된 내용)
import { InvoiceDataType, InvoiceFeatureItem } from '@/components/Ai/AiChatMessage';
import { devLog } from '@/lib/utils/devLogger';

// Helper functions (extractNumber, calculateTotals) remain the same

interface ParsedInvoiceResult {
  parsedData: InvoiceDataType | null;
  naturalText: string;
  totalCalculations?: {
    currentTotal: number;
    currentTotalDuration: number;
    currentTotalPages: number;
  };
}

export const parseInvoiceData = (
  aiResponseText: string
): ParsedInvoiceResult => {
  let parsedInvoiceData: InvoiceDataType | null = null;
  let naturalLanguageText = aiResponseText; // 기본값은 전체 텍스트
  let totalCalculations:
    | {
        currentTotal: number;
        currentTotalDuration: number;
        currentTotalPages: number;
      }
    | undefined;

  // ⭐ 핵심: JSON 코드 블록을 추출하는 정규식을 사용합니다.
  const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
  const match = aiResponseText.match(jsonRegex);
  let jsonStringCandidate: string | null = null;

  if (match && match[1]) {
    // JSON 코드 블록이 발견되면 그 내용만 파싱 시도
    jsonStringCandidate = match[1];
    // JSON 코드 블록을 제외한 나머지 텍스트를 자연어 텍스트로 간주
    naturalLanguageText = aiResponseText.replace(jsonRegex, '').trim();
    devLog('[parseInvoiceData] JSON code block found. Attempting to parse it.');
  } else {
    // JSON 코드 블록이 없다면, 전체 텍스트가 유효한 JSON인지 시도 (이 경우는 AI 프롬프트가 잘 작동했을 때)
    // 하지만 "지금까지 논의된 내..." 에러를 보면 이 부분이 아닌 것으로 보임.
    // 그래도 혹시 모를 경우를 대비하여 전체 텍스트도 JSON으로 시도해볼 수는 있음.
    // 여기서는 AI가 JSON을 보내려 했지만 ```json 블록을 사용하지 않은 경우를 대비합니다.
    const trimmedResponse = aiResponseText.trim();
    if (trimmedResponse.startsWith('{') && trimmedResponse.endsWith('}')) {
      jsonStringCandidate = trimmedResponse;
      naturalLanguageText = ''; // 전체가 JSON이라면 자연어 텍스트는 없음
      devLog('[parseInvoiceData] No JSON code block, but response seems to be pure JSON. Attempting to parse entire response.');
    } else {
      devLog('[parseInvoiceData] No JSON data candidate found. Treating as pure natural text.');
      parsedInvoiceData = null; // JSON 후보가 없음
      naturalLanguageText = aiResponseText; // 전체를 자연어 텍스트로
      return { parsedData: null, naturalText: naturalLanguageText, totalCalculations: undefined };
    }
  }

  if (jsonStringCandidate) {
    try {
      const possibleJsonData = JSON.parse(jsonStringCandidate);
      // InvoiceDataType의 구조를 확인하고, 예상과 일치하면 파싱 성공으로 간주
      if (
        possibleJsonData &&
        typeof possibleJsonData === 'object' &&
        'invoiceId' in possibleJsonData && // 'invoiceId'가 직접 InvoiceDataType에 있는지는 확인 필요
        'invoiceGroup' in possibleJsonData
      ) {
        parsedInvoiceData = possibleJsonData as InvoiceDataType;
        devLog('파싱된 견적서 JSON 객체 (parseInvoiceData):', parsedInvoiceData);

        if (parsedInvoiceData && parsedInvoiceData.invoiceGroup) {
          const initialItems = parsedInvoiceData.invoiceGroup.flatMap((group) =>
            group.items.map((item) => ({ ...item, isDeleted: false }))
          );
          const { amount, duration, pages } = calculateTotals(initialItems);
          totalCalculations = {
            currentTotal: amount,
            currentTotalDuration: duration,
            currentTotalPages: pages,
          };
        }
      } else {
        devLog('JSON 파싱 성공했지만 InvoiceDataType 구조와 일치하지 않음. 일반 텍스트로 처리.');
        parsedInvoiceData = null;
        // naturalLanguageText는 이미 위에서 설정됨
      }
    } catch (parseError) {
      console.error(
        '❌ Error parsing AI response as JSON:',
        parseError
      );
      devLog('AI 응답에서 유효한 JSON을 찾지 못했습니다. 전체 응답을 자연어 텍스트로 처리합니다.');
      parsedInvoiceData = null;
      // naturalLanguageText는 이미 위에서 설정됨
    }
  }

  return {
    parsedData: parsedInvoiceData,
    naturalText: naturalLanguageText,
    totalCalculations,
  };
};