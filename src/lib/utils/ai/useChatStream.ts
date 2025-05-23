// src/hooks/useChatStream.ts
import { useState, useRef, useCallback } from 'react';
import { StreamGenerateContentResponse } from 'firebase/vertexai'; // 또는 @google/generative-ai
import { Message, InvoiceDataType } from '@/components/Ai/AiChatMessage';
import { devLog } from '@/lib/utils/devLogger';
import { parseInvoiceData } from '@/lib/utils/ai/invoiceParser'; // 견적서 파서 임포트
import { calculateTotals } from '@/app/ai/components/InvoiceDetails'; // calculateTotals 임포트

interface StreamHandlerResult {
  accumulatedText: string;
  finalParsedInvoiceData: InvoiceDataType | null;
  finalNaturalText: string;
}

interface StreamHandlerOptions {
  aiMessageId: number;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  chatEndRef: React.RefObject<HTMLDivElement>;
  setInvoiceDetails: (data: any) => void; // AiPageContent에서 전달받을 함수
  // 🚨 추가: setMessages가 'isInvoiceParsed' 상태를 참조하여 견적서 파싱 후 텍스트만 업데이트하도록 할 수 있음
  // AiChatMessage.tsx의 `invoiceData` prop과 `text` prop을 활용하는 방식이 중요
}

export const useChatStream = () => {
  const processStream = useCallback(
    async (
      streamResult: StreamGenerateContentResponse,
      options: StreamHandlerOptions
    ): Promise<StreamHandlerResult> => {
      const { aiMessageId, setMessages, chatEndRef, setInvoiceDetails } =
        options;

      let accumulatedText = '';
      let currentParsedInvoiceData: InvoiceDataType | null = null;
      let currentNaturalText = '';
      let isInvoiceParsed = false; // JSON이 한 번 성공적으로 파싱되었는지 추적

      devLog('[useChatStream] Stream loop entered.');
      for await (const item of streamResult.stream) {
        const chunkText = item.candidates?.[0]?.content?.parts?.[0]?.text;

        if (chunkText) {
          accumulatedText += chunkText;

          // JSON이 아직 파싱되지 않았다면, 매 청크마다 파싱 시도
          if (!isInvoiceParsed) {
            // parseInvoiceData는 accumulatedText 전체를 넘겨주어 JSON을 찾도록 함
            const { parsedData, naturalText, totalCalculations } =
              parseInvoiceData(accumulatedText);

            if (parsedData) {
              // JSON이 성공적으로 파싱됨!
              currentParsedInvoiceData = parsedData;
              currentNaturalText = naturalText; // JSON 부분을 제거한 텍스트
              isInvoiceParsed = true; // 더 이상 JSON 파싱 시도 안 함

              // UI의 invoiceDetails 상태 즉시 업데이트
              // AiPageContent에서 이 상태를 구독하고 AiChatMessage에 props로 전달해야 함
              setInvoiceDetails({
                parsedJson: parsedData,
                items: parsedData.invoiceGroup.flatMap((g) =>
                  g.items.map((item) => ({ ...item, isDeleted: false }))
                ),
                ...totalCalculations, // calculateTotals에서 반환된 값 포함
              });
              devLog('[useChatStream] Initial invoice data displayed early!');

            } else {
              // 아직 JSON이 완성되지 않았거나 없음, naturalText는 현재 accumulatedText
              // 이 단계에서는 JSON 부분도 함께 포함된 텍스트를 보여줌
              currentNaturalText = accumulatedText;
            }
          } else {
            // JSON이 이미 파싱되었다면, naturalText는 계속 업데이트 (나머지 텍스트)
            // 이때는 이미 파싱된 JSON 부분을 제외하고 텍스트를 업데이트해야 함
            // 중요한 것은 parseInvoiceData 내부에서 JSON 부분을 제거한 naturalText를 반환해야 함
            // isInvoiceParsed = true 이므로, 이미 마지막으로 성공적으로 파싱된 naturalText를 사용
            // 또는 accumulatedText에서 JSON 부분을 다시 제거하여 업데이트
            // (parseInvoiceData가 텍스트 제거 기능도 포함하고 있으므로, 한번 더 호출하는게 안전할 수 있음)
            const { naturalText: updatedNaturalText } = parseInvoiceData(accumulatedText);
            currentNaturalText = updatedNaturalText;
          }

          // UI에 메시지 업데이트: 파싱된 invoiceData가 있다면 함께 전달
          // AiChatMessage 컴포넌트는 text와 invoiceData 둘 다 받을 수 있도록 설계되어야 함
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === aiMessageId
                ? {
                    ...msg,
                    text: currentNaturalText, // JSON 부분이 제거된 텍스트 (또는 파싱 전 전체 텍스트)
                    invoiceData: currentParsedInvoiceData ?? undefined, // 파싱된 데이터가 있으면 전달
                  }
                : msg
            )
          );
          chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
      }
      devLog('[useChatStream] Stream loop exited.');

      // 스트림이 완전히 종료된 후 최종 상태 반환
      return {
        accumulatedText,
        finalParsedInvoiceData: currentParsedInvoiceData,
        finalNaturalText: currentNaturalText,
      };
    },
    [] // 의존성 없음 (useCallback)
  );

  return { processStream };
};