"use client";

import React from "react";

import LoadingBar from "@/components/LoadingPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import { CalendarApp } from "@/components/CalendarApp";

export default function AdminView() {
  return (
    <ProtectedRoute intendedRole="admin">
      <LoadingBar duration={1000}>
        <main>
          <h1>Date Today</h1>
          <CalendarApp />
        </main>
      </LoadingBar>
    </ProtectedRoute>
  );
}
