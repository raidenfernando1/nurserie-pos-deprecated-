import Navbar from "@/components/Navbar";
import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardLayout({
  params,
  children,
}: {
  params: { role: string };
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <main className="flex flex-col">
        <Navbar />
        <section className="flex-1 p-4">{children}</section>
      </main>
    </ProtectedRoute>
  );
}
