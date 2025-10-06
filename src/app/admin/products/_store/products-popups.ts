import { create } from "zustand";

type PopupType = "add" | "delete" | null;

interface PopupStore {
  // State
  activePopup: PopupType;

  // Actions
  closePopup: () => void;
  togglePopup: (type: Exclude<PopupType, null>) => void;
}

const useProductsPopups = create<PopupStore>((set, get) => ({
  activePopup: null,

  closePopup: () => set({ activePopup: null }),

  togglePopup: (type) =>
    set({
      activePopup: get().activePopup === type ? null : type,
    }),
}));

export default useProductsPopups;
