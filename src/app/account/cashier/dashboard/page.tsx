import React from "react";
import useAdmin from "@/store/useAdmin";

export const navlist = [
  { name: "Sales", path: "#" },
  { name: "Reports", path: "#" },
];

export default function Navbar() {
  const { adminUsername } = useAdmin();

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b-2">
      <h1 className="font-bold text-lg">nurserie Dashboard</h1>

      <ul className="flex gap-10 list-none">
        {navlist.map(({ name, path }, index) => (
          <li key={index} className="px-4">
            <a href={path} className="hover:underline">
              {name}
            </a>
          </li>
        ))}
      </ul>

      <div className="flex gap-6">
        <a href="#">Welcome, {adminUsername}</a>
        <a href="#" className="text-red-500 font-semibold">
          Logout
        </a>
      </div>
    </nav>
  );
}
