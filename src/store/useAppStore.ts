import { create } from "zustand";

interface AppState {
  selectedLanguageId: string | null;
  setSelectedLanguageId: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedLanguageId: "es", // Default to Spanish as seen in the mockup
  setSelectedLanguageId: (id) => set({ selectedLanguageId: id }),
}));
