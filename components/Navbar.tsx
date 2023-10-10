"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";

import { ExtendedLeagueSchema } from "@/lib/types";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Just the homies",
    href: "/leagues/just-the-homies",
    description: "Sleeper league imported on x/xx/xxxx",
  },
  {
    title: "The big and the bad",
    href: "/leagues/the-big-and-the-bad",
    description: "Espn league imported on x/xx/xxxx",
  },
];

export default function Navbar() {
  const [leagues, setLeagues] = useState<ExtendedLeagueSchema[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/leagues", {
      method: "GET",
      cache: "no-store",
    })
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((data) => setLeagues(data.leagues));
  }, []);

  return (
    <NavigationMenu className="justify-between p-2 bg-slate-100 pl-6 pr-6">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Manage</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/leagues"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Leagues Home
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Manually create your own custom league, or import directly
                      from Sleeper or ESPN.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/leagues/create" title="Create">
                Manually create your league.
              </ListItem>
              <ListItem href="/leagues/import" title="Import Sleeper">
                Import from Sleeper.
              </ListItem>
              <ListItem href="/leagues/import" title="Import Espn">
                Import from Espn.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>My Leagues</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {leagues.slice(0, 9).map((league) => (
                <ListItem
                  key={league._id}
                  title={league.name}
                  href={`/leagueTeams/${league.name}`}
                >
                  {`${league.type} league ${
                    league.type === "Manual" ? "created" : "imported"
                  } on ${league.createdAt}`}
                </ListItem>
              ))}
              <ListItem key="more" title="More" href="/leagues">
                More leagues
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/about" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              About
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>

      <div>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Login
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Logout / Register
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </div>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
