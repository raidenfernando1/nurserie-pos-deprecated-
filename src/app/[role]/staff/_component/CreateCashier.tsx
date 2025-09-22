"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const CreateCashier = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    console.log(">>> Submitting cashier creation:", {
      username,
      password: "****",
    });

    try {
      const response = await fetch("/api/admin/cashier", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      console.log(">>> Raw response:", response);

      let data: any = null;
      try {
        data = await response.json();
      } catch (jsonErr) {
        console.error(">>> Failed to parse JSON response:", jsonErr);
      }

      console.log(">>> Parsed response JSON:", data);

      if (!response.ok) {
        throw new Error(data?.message || "Unknown error from server");
      }

      setSuccess(true);
      setUsername("");
      setPassword("");
    } catch (err: any) {
      console.error(">>> Error in handleSubmit:", err);
      setError(err.message || "Failed to create cashier");
    } finally {
      setLoading(false);
      console.log(">>> Finished cashier creation attempt");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button variant="outline" type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Cashier"}
      </Button>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && (
        <p className="text-green-500 text-sm">Cashier created successfully!</p>
      )}
    </form>
  );
};

export default CreateCashier;
