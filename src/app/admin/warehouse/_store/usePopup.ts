import { create } from "zustand";

type PopupType = "add" | "edit" | "move" | "add-warehouse" | null;

interface PopupStore {
  // States
  activePopup: PopupType;

  // Functions
  closePopup: () => void;
  openPopup: (type: PopupType) => void;
  togglePopup: (type: PopupType) => void;
}

export const usePopup = create<PopupStore>((set, get) => ({
  activePopup: null,

  openPopup: (type) => set({ activePopup: type }),

  closePopup: () => set({ activePopup: null }),

  togglePopup: (type) =>
    set({ activePopup: get().activePopup === type ? null : type }),
}));
