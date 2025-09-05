import { create } from "zustand";

interface ErrorItem {
  id: string;
  message: string;
}

interface ErrorTypes {
  healthDB: boolean | undefined;
  setHealthDB: (status: boolean) => void;
  errors: ErrorItem[];
  addError: (message: string) => void;
  removeError: (id: string) => void;
  clearErrors: () => void;
}

const useError = create<ErrorTypes>((set) => ({
  healthDB: undefined,
  setHealthDB: (status) => set({ healthDB: status }),
  errors: [],
  addError: (message) =>
    set((state) => ({
      errors: [...state.errors, { id: crypto.randomUUID(), message }],
    })),
  removeError: (id) =>
    set((state) => ({
      errors: state.errors.filter((err) => err.id !== id),
    })),

  clearErrors: () => set({ errors: [] }),
}));

export default useError;
