"use client";
import { useAdminAuth } from "@/lib/admin/login";
import React from "react";
import { Roles } from "@/app/types/roles";
import { useCashierAuth } from "@/lib/cashier/login";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { X, Loader2Icon } from "lucide-react";
import Link from "next/link";

interface LoginFormProps {
  title?: string;
  subTitle?: string;
  role: Roles;
}

export default function LoginForm({ title, subTitle, role }: LoginFormProps) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [loginError, setLoginError] = React.useState("");
  const { Login } = useAdminAuth();
  const { Login: CashierLogin } = useCashierAuth();

  async function handleLogin(event?: React.FormEvent) {
    event?.preventDefault();
    setLoading(true);
    setLoginError("");
    try {
      if (role === "admin") {
        const response = await Login();
        console.log("Admin login response:", response);
      } else if (role === "cashier") {
        const response = await CashierLogin({ email: username, password });
        console.log("Cashier login response:", response);
      }
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
          {role === "admin" ? (
            <button
              className="text-lg font-bold cursor-pointer border-2 rounded-2xl px-12 py-8"
              onClick={() => handleLogin()}
              disabled={loading}
            >
              {loading ? "Loading..." : "Sign in as Admin"}
            </button>
          ) : (
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

                {loginError && <p className="text-red-500">{loginError}</p>}
              </div>
            </form>
          )}
        </div>
      </main>
    </>
  );
}
