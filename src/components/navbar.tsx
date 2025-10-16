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
          <NavigationMenuTrigger>Brands</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-screen max-w-[85vw] sm:w-[400px] md:w-[500px] lg:w-[500px] sm:grid-cols-1 lg:grid-cols-[.75fr_1fr]">
              <ListItem
                href="https://nurserie.myshopify.com/collections"
                title="Mushie"
              >
                All products are designed in Houston and Sweden by a team of
                designers led by Mushie.
              </ListItem>
              <ListItem
                href="https://nurserie.myshopify.com/collections/frigg-facifiers"
                title="Frigg"
              >
                From baby care tips to sustainable parenting and product
                insights
              </ListItem>
              <ListItem
                href="https://nurserie.myshopify.com/collections/moonie"
                title="Moonie"
              >
                Moonie is a brand from Poland that creates humming toys with
                lamps.
              </ListItem>
              <ListItem
                href="https://nurserie.myshopify.com/collections/najell"
                title="Najell"
              >
                Innovative & Empowering Products from Sweden for Parents and
                Babies.
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
            className
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
