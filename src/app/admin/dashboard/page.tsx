"use client";
import React from "react";
import Link from "next/link";
import { Home, BarChart3, Package, Users, ArrowRight } from "lucide-react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ProtectedRoute from "@/components/protected-route";
import DashboardCard from "./dashboard-card";

export default function AdminView() {
  const quickActions = [
    {
      title: "Analytics",
      description: "Track performance metrics",
      icon: BarChart3,
      href: "/admin/analytics",
      color: "text-green-600",
    },
    {
      title: "Warehouses",
      description: "Manage inventory locations",
      icon: Package,
      href: "/admin/warehouse/total",
      color: "text-purple-600",
    },
    {
      title: "Staff",
      description: "Manage team members",
      icon: Users,
      href: "/admin/staff",
      color: "text-orange-600",
    },
  ];

  return (
    <ProtectedRoute intendedRole="admin">
      <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br p-8">
        <div className="max-w-6xl w-full space-y-8">
          <DashboardCard />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href}>
                <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
                  <CardHeader>
                    <div
                      className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4 ${action.color}`}
                    >
                      <action.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl">{action.title}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm font-medium text-blue-600">
                      Get started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
