// useSession.ts
import { authClient } from "@/lib/auth-client";
import { useState, useEffect } from "react";

export function useSession() {
  const [loading, setLoading] = useState(true);
  const [userSession, setUserSession] = useState<any | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await authClient.getSession();
        setUserSession(session.data);
      } catch (error) {
        console.error("Failed to fetch session:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  return { loading, userSession };
}
