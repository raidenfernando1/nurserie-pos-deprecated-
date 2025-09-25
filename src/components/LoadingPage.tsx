"use client";

import React, { useEffect, useState, ReactNode } from "react";
import { Progress } from "@/components/ui/progress";

interface LoadingBarProps {
  children: ReactNode;
  duration?: number;
}

export default function LoadingBar({
  children,
  duration = 1000,
}: LoadingBarProps) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const intervalTime = 10; // ms per step
    const step = 100 / (duration / intervalTime);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(interval);
          setLoading(false);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [duration]);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4">
        <p className="text-xl">Loading...</p>
        <div className="w-1/3">
          <Progress value={progress} className="h-2" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
