// src/store/aiFlowStore.ts
import { create } from 'zustand';

// AiChatMessage.tsx 또는 별도의 타입 파일에서 공유되어야 하는 타입입니다.
// 여기서는 설명을 위해 임시로 여기에 정의합니다.
// 실제 프로젝트에서는 중앙화된 타입 정의 파일을 사용하는 것이 좋습니다.
export interface InvoiceDataType {
  invoiceId: string;
  invoiceTitle: string;
  invoiceDate: string;
  customerName: string;
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  invoiceGroup: Array<{
    groupName: string;
    items: Array<{
      id: string; // 각 아이템의 고유 ID
      feature: string;
      description: string;
      amount: number | string; // 금액이 숫자 또는 '별도 문의'일 수 있음
      duration?: string; // 기간 (예: '2주')
      pages?: string; // 페이지 수 (예: '10p')
      quantity?: number; // 수량
      unit?: string; // 단위 (예: '개', '건')
    }>;
  }>;
  summaryTotalAmount: string;
  summaryTotalDuration: string;
  summaryTotalPages: string;
  summaryRemarks?: string;
  termsAndConditions?: string[];
  signatureImageUrl?: string;
  signatureText?: string;
}

// InvoiceDetails는 AiPageContent.tsx에서 사용되던 로컬 상태를 기반으로 합니다.
// useAiFlowStore로 이동시키면서 인터페이스를 명확히 정의합니다.
export interface InvoiceDetails {
  parsedJson?: InvoiceDataType;
  items: Array<
    InvoiceDataType['invoiceGroup'][number]['items'][number] & {
      isDeleted: boolean;
    }
  >;
  currentTotal: number;
  currentTotalDuration: number;
  currentTotalPages: number;
}

interface AiFlowState {
  currentStep: number;
  isFreeFormMode: boolean;
  selections: Record<string, string[]>;
  invoiceDetails: InvoiceDetails | null; // ⭐ 추가: invoiceDetails 상태
  setCurrentStep: (step: number) => void;
  setIsFreeFormMode: (isFreeForm: boolean) => void;
  setSelections: (selections: Record<string, string[]>) => void;
  updateSelection: (stepId: string, selectedIds: string[]) => void;
  setInvoiceDetails: (details: InvoiceDetails | null) => void; // ⭐ 추가: setInvoiceDetails 액션
  resetFlow: () => void;
}

const useAiFlowStore = create<AiFlowState>((set, get) => ({
  currentStep: 0,
  isFreeFormMode: false,
  selections: {},
  invoiceDetails: null, // ⭐ 초기 상태 설정
  setCurrentStep: (step) => set({ currentStep: step }),
  setIsFreeFormMode: (isFreeForm) => set({ isFreeFormMode: isFreeForm }),
  setSelections: (selections) => set({ selections }),
  updateSelection: (stepId, selectedIds) => {
    set((state) => ({
      selections: {
        ...state.selections,
        [stepId]: selectedIds,
      },
    }));
  },
  setInvoiceDetails: (details) => set({ invoiceDetails: details }), // ⭐ 액션 구현
  resetFlow: () =>
    set({
      currentStep: 0,
      isFreeFormMode: false,
      selections: {},
      invoiceDetails: null, // ⭐ 리셋 시 invoiceDetails 초기화
    }),
}));

export default useAiFlowStore;