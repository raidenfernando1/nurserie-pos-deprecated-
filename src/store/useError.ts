import { create } from "zustand";

interface ErrorTypes {
  healthDB: boolean | undefined;
  setHealthDB: (status: boolean) => void;
  error: {
    isError: boolean;
    errorMessage: string | null;
  };
  setError: (isError: boolean, errorMessage?: string) => void;
}

const useError = create<ErrorTypes>((set) => ({
  healthDB: undefined,
  setHealthDB: (status) => set({ healthDB: status }),
  error: {
    isError: false,
    errorMessage: null,
  },
  setError: (isError, errorMessage) =>
    set({
      error: {
        isError,
        errorMessage: errorMessage || null,
      },
    }),
}));

export default useError;
