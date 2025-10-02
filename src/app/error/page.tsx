"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ErrorContent() {
  const searchParams = useSearchParams(); // ✅ now inside Suspense
  const msg = searchParams.get("msg");
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return <h1>Error: {msg ?? "Unknown error"}</h1>;
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
}
