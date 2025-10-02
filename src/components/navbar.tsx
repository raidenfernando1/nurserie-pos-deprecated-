"use client";

import React from "react";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const developers: { name: string; href: string; description: string }[] = [
  {
    name: "Raiden Fernando",
    href: "#",
    description:
      "Team Leader / Full-Stack Developer / DevOps / Project Manager / Database Administrator",
  },
  {
    name: "Jovan Reyes",
    href: "#",
    description: "Frontend Developer / UI/UX Designer",
  },
  {
    name: "Jhun Mark Samarista",
    href: "#",
    description: "Database / Backend Developer / Rubiks Cube Master",
  },
  {
    name: "Mark Dave Alcantara",
    href: "#",
    description: "Documentation / QA Engineer / Rubiks Cube Ethusiast",
  },
];

export function Navbar() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Home</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-screen max-w-[85vw] sm:w-[400px] md:w-[500px] lg:w-[500px] sm:grid-cols-1 lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-1 lg:row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md hover:bg-muted/80 transition-colors"
                    href="/"
                  >
                    <div className="mb-2 mt-4 text-l font-medium">
                      Oracle Petroleum Corporation
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Be part of the No. 1 Toll Blender in the country. With
                      more than 35+ years of outstanding service. Excelling in
                      Petroleum and Industrial Chemical expertise.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="https://www.oraclepetroleum.net/" title="WEBSITE">
                Open our Official Website to know more about us.
              </ListItem>
              <ListItem href="https://platinum-oil.net/" title="PLATINUM">
                Modern industries thrive on innovative and cutting edge
                solutions that drive progress and efficiency.
              </ListItem>
              <ListItem href="https://comet-oil.net/" title="COMET">
                Comet Lubricants provides the most advanced technology in the
                industry.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Developers</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-screen max-w-[85vw] sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {developers.map((developer) => (
                <ListItem
                  key={developer.name}
                  title={developer.name}
                  href={developer.href}
                >
                  {developer.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/about">About</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/support">Support</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({
  title,
  children,
  href,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
