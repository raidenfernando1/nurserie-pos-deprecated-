import { create } from "zustand";

type Popups =
  | "add-product-warehouse"
  | "move-product-warehouse"
  | "add-product"
  | "delete-product"
  | "edit-product"
  | null;

interface PopupStore {
  activePopup: Popups;
  data: Record<string, any> | null;

  // functions
  closePopup: () => void;
  togglePopup: (type: Popups) => void;
}

export const usePopupStore = create<PopupStore>((set, get) => ({
  activePopup: null,
  data: null,

  // functions
  closePopup: () => set({ activePopup: null }),
  togglePopup: (type) =>
    set({ activePopup: get().activePopup === type ? null : type }),
}));
