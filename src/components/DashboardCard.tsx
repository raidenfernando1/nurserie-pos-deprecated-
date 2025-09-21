import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function DashboardCard({
  title,
  path,
}: {
  title: string;
  path: string;
}) {
  return (
    <Button variant="outline" className="w-full h-[300px] rounded-2xl" asChild>
      <Link href={path}>
        <p className="text-3xl">{title}</p>
      </Link>
    </Button>
  );
}
