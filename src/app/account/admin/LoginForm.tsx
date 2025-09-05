"use client";

import useError from "@/store/useError";
import { useAdminAuth } from "@/lib/admin/login";
import React from "react";

export default function AdminLoginPage() {
  const [loginError, setLoginError] = React.useState<string | undefined>(
    "Sign in with Google"
  );

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const { addError } = useError();
  const { Login } = useAdminAuth();

  const signIn = async () => {
    setIsLoading(true);

    try {
      const response = await Login();

      if (!response) {
        setLoginError("Error loggin in");
        setIsLoading(false);
      }

      setLoginError("Success");
      setIsLoading(false);
    } catch (error: any) {
      console.error("Sign-in error:", error);
      addError("Failed to sign in with Google.");
    }
  };

  return (
    <button
      className="text-lg font-bold cursor-pointer border-2 rounded-2xl px-12 py-8"
      onClick={signIn}
    >
      {isLoading === true ? "loading" : loginError}
    </button>
  );
}
