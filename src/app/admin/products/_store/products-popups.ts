import { create } from "zustand";
import { Product } from "@/types/product";

type PopupType = "add" | "delete" | "edit" | "add-warehouse" | null;

interface PopupStore {
  // State
  activePopup: PopupType;
  selectedProduct: Product | null;

  // Actions
  closePopup: () => void;
  togglePopup: (type: Exclude<PopupType, null>, product?: Product) => void;
}

const useWarehousePopups = create<PopupStore>((set, get) => ({
  activePopup: null,
  selectedProduct: null,

  closePopup: () => set({ activePopup: null }),

  togglePopup: (type, product) =>
    set({
      activePopup: get().activePopup === type ? null : type,
      selectedProduct: product || null,
    }),
}));

export default useWarehousePopups;
