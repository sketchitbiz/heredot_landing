import { create } from "zustand";
import { FileUploadData } from "@/lib/firebase/firebase.functions"; // Assuming path is correct
import { Part } from "firebase/vertexai"; // Assuming path is correct

export interface ChatHistory {
  role: string;
  text: string;
  files?: FileUploadData[]; // Use FileUploadData here
  parts?: Array<string | Part>;
  hide?: boolean;
}

// Define the state structure, incorporating useState items
interface ChatState {
  history: ChatHistory[];
  loading: boolean; // For general/publish loading
  invoiceChunck: string;
  prompt: string;
  files: FileUploadData[];
  progress: number;
  analysisLoading: boolean;
  dragging: boolean;
  isInputBoxVisible: boolean;
  promptLoading: boolean; // Moved from useState
  // Multi-step selection state
  selectedPlatforms: {
    web: boolean;
    mobile: boolean;
    ios: boolean;
    android: boolean;
    windows: boolean;
  };
  selectedPages: number;
  selectedFeature: string;
  multiStepCompleted: {
    // Track completion instead of ref
    platform: boolean;
    page: boolean;
    feature: boolean;
  };
}

// Define the actions
interface ChatActions {
  addInvoiceChunk: (chunk: string) => void;
  resetInvoiceChunk: () => void;
  toggleAnalysisVisibility: (index: number) => void;
  setLoading: (isLoading: boolean) => void;
  setAnalysisLoading: (isLoading: boolean) => void;
  setPrompt: (prompt: string) => void;
  resetPrompt: () => void;
  addFile: (file: FileUploadData) => void;
  removeFile: (fileUri: string) => void;
  resetFiles: () => void;
  setProgress: (progress: number) => void;
  addHistoryItem: (item: ChatHistory) => void;
  addHistoryItems: (items: ChatHistory[]) => void;
  setDragging: (isDragging: boolean) => void;
  setInputBoxVisibility: (isVisible: boolean) => void;
  setPromptLoading: (isLoading: boolean) => void;
  togglePlatform: (platform: keyof ChatState["selectedPlatforms"]) => void;
  setSelectedPage: (pages: number) => void;
  setSelectedFeature: (feature: string) => void;
  completeMultiStep: (step: keyof ChatState["multiStepCompleted"]) => void;
  reset: () => void;
}

// Define the initial state
const initialState: ChatState = {
  history: [
    { role: "platform-selection", text: "" },
    { role: "model", text: "Please select the category you want to create. You can select multiple items" },
    { role: "model", text: "Hello! This is HereDot, a company specializing in IT prototype manufacturing." },
  ],
  loading: false,
  invoiceChunck: "",
  prompt: "",
  files: [],
  progress: 0,
  analysisLoading: false,
  dragging: false,
  isInputBoxVisible: false, // Start hidden
  promptLoading: false,
  selectedPlatforms: { web: false, mobile: false, ios: false, android: false, windows: false },
  selectedPages: 0,
  selectedFeature: "",
  multiStepCompleted: { platform: false, page: false, feature: false },
};

// Create the Zustand store
const useChatStore = create<ChatState & ChatActions>((set) => ({
  ...initialState,

  // Implement actions
  addInvoiceChunk: (chunk) => set((state) => ({ invoiceChunck: state.invoiceChunck + chunk })),
  resetInvoiceChunk: () => set({ invoiceChunck: "" }),
  toggleAnalysisVisibility: (index) =>
    set((state) => {
      const newHistory = [...state.history];
      if (newHistory[index]) {
        newHistory[index].hide = !newHistory[index].hide; // Toggle directly
      }
      return { history: newHistory };
    }),
  setLoading: (isLoading) => set({ loading: isLoading }),
  setAnalysisLoading: (isLoading) => set({ analysisLoading: isLoading }),
  setPrompt: (prompt) => set({ prompt }),
  resetPrompt: () => set({ prompt: "" }),
  addFile: (file) => set((state) => ({ files: [...state.files, file], progress: 0 })),
  removeFile: (fileUri) => set((state) => ({ files: state.files.filter((f) => f.fileUri !== fileUri) })),
  resetFiles: () => set({ files: [] }),
  setProgress: (progress) => set({ progress }),
  addHistoryItem: (item) => set((state) => ({ history: [item, ...state.history] })), // Add to the beginning
  addHistoryItems: (items) => set((state) => ({ history: [...items.reverse(), ...state.history] })), // Reverse then add to beginning
  setDragging: (isDragging) => set({ dragging: isDragging }),
  setInputBoxVisibility: (isVisible) => set({ isInputBoxVisible: isVisible }),
  setPromptLoading: (isLoading) => set({ promptLoading: isLoading }),
  togglePlatform: (platform) =>
    set((state) => ({
      selectedPlatforms: {
        ...state.selectedPlatforms,
        [platform]: !state.selectedPlatforms[platform],
      },
    })),
  setSelectedPage: (pages) => set({ selectedPages: pages }),
  setSelectedFeature: (feature) => set({ selectedFeature: feature }),
  completeMultiStep: (step) =>
    set((state) => ({
      multiStepCompleted: {
        ...state.multiStepCompleted,
        [step]: true,
      },
    })),
  reset: () => set(initialState),
}));

export default useChatStore;
