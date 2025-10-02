"use client";

import React, { useEffect, useState, ReactNode } from "react";

interface LoadingBarProps {
  children: ReactNode;
  duration?: number;
}

export default function LoadingBar({
  children,
  duration = 1000,
}: LoadingBarProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  useEffect(() => {
    if (!loading) return;

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
  }, [loading]);

  if (loading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center gap-4">
        <svg
          viewBox="0 0 60 60"
          width="500"
          stroke="#6D7582"
          strokeLinejoin="round"
        >
          <g id="cube" fill="#fff" style={{ transformOrigin: "50% 50%" }}>
            <path id="base" />
            <path id="lid" />
          </g>
        </svg>
      </div>
    );
  }

  return <>{children}</>;
}
