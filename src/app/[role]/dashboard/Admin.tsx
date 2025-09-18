import React from "react";
import DashboardCard from "@/components/DashboardCard";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/router";

const adminItems = [
  { name: "Warehouse", path: "/admin/warehouse" },
  { name: "Analytics", path: "/admin/analytics" },
  { name: "Staff", path: "/admin/staff" },
];

function Listener({ children }: { children: React.ReactNode }) {
  const checkSession = async () => {
    const session = await authClient.getSession();
    const email = session?.data?.user?.email;
    const userRole = session?.data?.user?.role;
    const router = await useRouter();

    if (!session || !email) {
      await authClient.signOut();
      router.push("/");
    }

    if (userRole !== "admin") {
      await authClient.signOut();
      router.push("/");
    }

    const response = await fetch("/api/admin/check", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!data.authorized) {
      await authClient.signOut();
      router.push("/");
    }
  };

  React.useEffect(() => {
    checkSession();
  }, []);

  return <>{children}</>;
}

export default function AdminView() {
  return (
    <Listener>
      <main className="grid grid-cols-3 gap-3">
        {adminItems.map((data, index) => (
          <DashboardCard key={index} title={data.name} path={data.path} />
        ))}
      </main>
    </Listener>
  );
}
