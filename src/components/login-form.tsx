"use client";

import React from "react";
import { Roles } from "@/types/user";
import { Button } from "@/components/ui/button";
import { X, Loader2Icon, Link } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
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
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your Cashier Account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4"></div>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    className="p-3 text-xl border-2 rounded"
                    placeholder="Username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button
                  className="rounded cursor-pointer"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? <Loader2Icon className="animate-spin" /> : "Login"}
                  {loading && "Please wait"}
                </Button>
              </div>
              {loginError && (
                <p className="text-red-500 text-center mt-2">{loginError}</p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
