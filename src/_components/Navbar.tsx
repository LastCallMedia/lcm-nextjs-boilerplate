"use client";

import { File, Files, type LucideIcon } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import Image from "next/image";
import { ThemeModeToggle } from "./ThemeModeToggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";

interface NavbarLinks {
  title: string;
  href: string;
  icon: LucideIcon;
}

const NavbarLinks: NavbarLinks[] = [
  { title: "Post", href: "/post", icon: File },
  { title: "All Posts", href: "/posts", icon: Files },
];
const Navbar = () => {
  return (
    <NavigationMenu viewport={false} className="m-auto">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/">
              <Image
                src={"/lcm-logo-teal.png"}
                width={30}
                height={30}
                alt="lcm logo"
                title="Home"
                aria-label="Home"
              />
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-4">
              {NavbarLinks &&
                NavbarLinks.map((link) => (
                  <ListItem
                    key={link.title}
                    title={link.title}
                    href={link.href}
                    icon={link.icon}
                  />
                ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        {/* <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <SignIn />
          </NavigationMenuLink>
        </NavigationMenuItem> */}
        <NavigationMenuItem>
          <ThemeModeToggle />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

function ListItem({
  title,
  children,
  href,
  icon: Icon,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & {
  href: string;
  icon: LucideIcon;
}) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="flex gap-2 text-sm leading-none font-medium">
            <Icon />
            {title}
          </div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

export default Navbar;
