"use client";
import { useAdminAuth } from "@/lib/admin/login";
import React from "react";
import { Roles } from "@/app/types/roles";
import { useCashierAuth } from "@/lib/cashier/login";

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
    <main className="flex flex-col items-center justify-center h-full gap-32">
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
              <input
                className="p-3 text-xl border-2 rounded"
                placeholder="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                className="p-3 text-xl border-2 rounded"
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className="p-2 border-2 bg-green-400 text-black border-green-600 cursor-pointer duration-200 hover:opacity-80"
                type="submit"
                disabled={loading}
              >
                {loading ? "Loading..." : "Submit"}
              </button>

              {loginError && <p className="text-red-500">{loginError}</p>}
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
