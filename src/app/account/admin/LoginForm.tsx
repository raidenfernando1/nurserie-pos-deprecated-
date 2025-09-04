"use client";

import { authClient } from "@/lib/auth-client";
import useError from "@/store/useError";

export default function AdminLogin() {
  const { setError } = useError();

  const signIn = async () => {
    try {
      setError(false);
      const response = await authClient.signIn.social({ provider: "google" });
      return response;
    } catch (error: any) {
      console.error("Sign-in error:", error);
      setError(true, error?.message || "Failed to sign in with Google.");
    }
  };

  return (
    <button
      className="text-lg font-bold cursor-pointer border-1 px-10 py-5"
      onClick={signIn}
    >
      Sign in with Google
    </button>
  );
}
