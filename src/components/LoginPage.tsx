"use client";

import React from "react";
import { Roles } from "@/types/user";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { X, Loader2Icon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface LoginFormProps {
  title?: string;
  subTitle?: string;
}

export default function LoginForm({ title, subTitle }: LoginFormProps) {
  const router = useRouter();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [loginError, setLoginError] = React.useState("");

  async function handleLogin(event?: React.FormEvent) {
    event?.preventDefault();
    setLoading(true);
    setLoginError("");

    try {
      const result = await authClient.signIn.email({
        email: `${username}@placeholder.com`,
        password,
      });

      if (result?.error) {
        setLoginError(result.error.message || "Invalid credentials.");
        return;
      }

      router.push("/cashier");
    } catch (err) {
      console.error(err);
      setLoginError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <a href="/" className="fixed top-5 left-5 p-3">
        <X width={28} height={28} strokeWidth={2} />
      </a>

      <main className="h-screen flex flex-col items-center justify-center gap-32">
        <div className="flex flex-col items-center justify-center gap-32">
          <div>
            <h1 className="text-7xl tracking-tight">{title}</h1>
            <h2 className="opacity-30 text-center">{subTitle}</h2>
          </div>

          <form
            className="flex flex-col items-center justify-center"
            onSubmit={handleLogin}
          >
            <div className="flex flex-col gap-4 justify-center">
              <Input
                className="p-3 text-xl border-2 rounded"
                placeholder="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                className="p-3 text-xl border-2 rounded"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                className="rounded cursor-pointer"
                type="submit"
                disabled={loading}
              >
                {loading ? <Loader2Icon className="animate-spin" /> : "Login"}
                {loading && "Please wait"}
              </Button>

              {loginError && (
                <p className="text-red-500 text-center mt-2">{loginError}</p>
              )}
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
