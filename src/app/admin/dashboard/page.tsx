"use client";
import React from "react";
import Link from "next/link";
import { Home, BarChart3, Package, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ProtectedRoute from "@/components/protected-route";

export default function AdminView() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;

    const cube = document.getElementById("cube");
    const lid = document.getElementById("lid");
    const base = document.getElementById("base");

    if (!cube || !lid || !base) return;

    const lid_coordinates = [
      [
        [-3, 3, 3],
        [-3, -3, 3],
        [3, -3, 3],
        [3, 3, 3],
        [-3, 3, 3],
        [-3, 3, 1],
        [-3, -3, 1],
        [3, -3, 1],
        [3, -3, 3],
      ],
      [
        [3, 1, 3],
        [-3, 1, 3],
        [-3, 1, 1],
      ],
      [
        [3, -1, 3],
        [-3, -1, 3],
        [-3, -1, 1],
      ],
      [
        [-3, -3, 3],
        [-3, -3, 1],
      ],
      [
        [-1, -3, 1],
        [-1, -3, 3],
        [-1, 3, 3],
      ],
      [
        [1, -3, 1],
        [1, -3, 3],
        [1, 3, 3],
      ],
    ];

    const base_coordinates = [
      [
        [-3, 3, 1],
        [3, 3, 1],
        [3, -3, 1],
        [-3, -3, 1],
        [-3, 3, 1],
        [-3, 3, -3],
        [-3, -3, -3],
        [3, -3, -3],
        [3, -3, 1],
      ],
      [
        [1, -3, -3],
        [1, -3, 1],
        [1, 1, 1],
        [-3, 1, 1],
        [-3, 1, -3],
      ],
      [
        [-1, -3, -3],
        [-1, -3, 1],
        [-1, -1, 1],
        [-3, -1, 1],
        [-3, -1, -3],
      ],
      [
        [-3, -3, -3],
        [-3, -3, 1],
      ],
      [
        [-3, 3, -1],
        [-3, -3, -1],
        [3, -3, -1],
      ],
    ];

    const u = 4;
    let t = 0;

    function project(coordinatesGroup: number[][][], t: number) {
      return coordinatesGroup.map(function (coordinatesSubGroup) {
        return coordinatesSubGroup.map(function (coordinates) {
          const x = coordinates[0];
          const y = coordinates[1];
          const z = coordinates[2];
          return [
            (x * Math.cos(t) - y * Math.sin(t)) * u + 30,
            ((x * -Math.sin(t) - y * Math.cos(t) - z * Math.sqrt(2)) * u) /
              Math.sqrt(3) +
              30,
          ];
        });
      });
    }

    function toPath(coordinates: number[][][]) {
      return (
        "M" +
        JSON.stringify(coordinates)
          .replace(/]],\[\[/g, "M")
          .replace(/],\[/g, "L")
          .slice(3, -3)
      );
    }

    function easing(t: number) {
      return ((2 - Math.cos(Math.PI * t)) % 2) * (Math.PI / 4);
    }

    let animationId: number;

    function tick() {
      if (!cube || !lid) return;

      t = (t + 1 / 30) % 3;
      cube.style.transform = "rotate(" + Math.floor(t) * 120 + "deg)";
      lid.setAttribute("d", toPath(project(lid_coordinates, easing(t))));
      animationId = requestAnimationFrame(tick);
    }

    base.setAttribute("d", toPath(project(base_coordinates, Math.PI / 4)));
    tick();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [mounted]);

  const quickActions = [
    {
      title: "Dashboard",
      description: "View your business overview",
      icon: Home,
      href: "/admin/dashboard",
      color: "text-blue-600",
    },
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
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-6">
              <svg
                viewBox="0 0 60 60"
                width="160"
                stroke="#6D7582"
                strokeLinejoin="round"
                className="bg-white rounded-lg shadow-lg p-2"
              >
                <g id="cube" fill="#fff" style={{ transformOrigin: "50% 50%" }}>
                  <path id="base" />
                  <path id="lid" />
                </g>
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
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
