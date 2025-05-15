import { create } from 'zustand';

interface AiFlowState {
  currentStep: number;
  isFreeFormMode: boolean;
  selections: Record<string, string[]>;
  setCurrentStep: (step: number) => void;
  setIsFreeFormMode: (isFreeForm: boolean) => void;
  setSelections: (selections: Record<string, string[]>) => void;
  updateSelection: (stepId: string, selectedIds: string[]) => void;
  resetFlow: () => void;
}

const useAiFlowStore = create<AiFlowState>((set, get) => ({
  currentStep: 0,
  isFreeFormMode: false,
  selections: {},
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
  resetFlow: () =>
    set({
      currentStep: 0,
      isFreeFormMode: false,
      selections: {},
    }),
}));

export default useAiFlowStore;
