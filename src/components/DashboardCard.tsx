import React from "react";

export default function DashboardCard({
  title,
  path,
}: {
  title: string;
  path: string;
}) {
  return <a href={path}>{title}</a>;
}
