import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AppState {
  selectedLanguageId: string | null;
  setSelectedLanguageId: (id: string | null) => void;
  hasHydrated: boolean;
  setHasHydrated: (val: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      selectedLanguageId: null,
      setSelectedLanguageId: (id) => set({ selectedLanguageId: id }),
      hasHydrated: false,
      setHasHydrated: (val) => set({ hasHydrated: val }),
    }),
    {
      name: "lingua-app-store",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
