"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";

// Import sidebar configs
import { adminItems, cashierItems } from "@/components/app-sidebar";

// Build lookup table: path → name
const itemMap: Record<string, string> = [...adminItems, ...cashierItems].reduce(
  (acc, item) => {
    acc[item.path] = item.name;
    return acc;
  },
  {} as Record<string, string>
);

export function AppBreadcrumbs() {
  const pathname = usePathname();

  // Exact match only (e.g. /admin/dashboard)
  const label = itemMap[pathname];

  if (!label) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <span className="font-medium text-muted-foreground">{label}</span>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
