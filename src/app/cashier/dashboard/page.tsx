"use client";
import React from "react";
import Link from "next/link";
import {
  Home,
  BarChart3,
  Package,
  Users,
  ArrowRight,
  FileText,
} from "lucide-react";
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
import DashboardCard from "@/components/dashboard-card";

export default function CashierView() {
  const quickActions = [
    {
      title: "Sales",
      description: "Track sales performance and metrics",
      icon: BarChart3,
      href: "/cashier/sales",
      color: "text-green-600",
    },
    {
      title: "Products",
      description: "Browse and manage product inventory",
      icon: Package,
      href: "/cashier/products",
      color: "text-purple-600",
    },
    {
      title: "Transactions",
      description: "View and process customer transactions",
      icon: Users,
      href: "/cashier/transactions",
      color: "text-orange-600",
    },
    {
      title: "Customers",
      description: "Manage customer information and history",
      icon: Users,
      href: "/cashier/customers",
      color: "text-blue-600",
    },
    {
      title: "Reports",
      description: "Generate and view sales reports",
      icon: FileText,
      href: "/cashier/reports",
      color: "text-indigo-600",
    },
  ];

  return (
    <ProtectedRoute intendedRole="cashier">
      <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-br p-8">
        <div className="max-w-6xl w-full space-y-8">
          <DashboardCard />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8 pb-8">
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
