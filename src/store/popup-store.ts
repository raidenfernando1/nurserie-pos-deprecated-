import { create } from "zustand";

type Popups =
  | "add-product-warehouse"
  | "move-product-warehouse"
  | "add-product"
  | "delete-product"
  | "edit-product"
  | "add-warehouse"
  | "create-customer"
  | null;

interface PopupStore {
  activePopup: Popups;
  data?: Record<string, any>;

  openPopup: (type: Popups, data?: Record<string, any>) => void;
  closePopup: () => void;
}

export const usePopupStore = create<PopupStore>((set) => ({
  activePopup: null,
  data: undefined,

  openPopup: (type, data) => set({ activePopup: type, data }),
  closePopup: () => set({ activePopup: null, data: undefined }),
}));
