import {
  File,
  Files,
  Info,
  Mail,
  Shield,
  User,
  Settings,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

import Image from "next/image";
import { ThemeModeToggle } from "~/_components/theme";
import { Button } from "~/_components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "~/_components/ui";
import { SignIn } from "~/_components/auth";
import { auth } from "~/server/auth";

interface NavbarLinks {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
}

const publicLinks: NavbarLinks[] = [
  {
    title: "About",
    href: "/about",
    icon: Info,
    description: "Learn about this boilerplate",
  },
  {
    title: "Contact",
    href: "/contact",
    icon: Mail,
    description: "Get in touch with us",
  },
];

const postLinks: NavbarLinks[] = [
  {
    title: "Create Post",
    href: "/post",
    icon: File,
    description: "Write a new post",
  },
  {
    title: "All Posts",
    href: "/posts",
    icon: Files,
    description: "Browse all posts",
  },
];

const protectedLinks: NavbarLinks[] = [
  {
    title: "Profile",
    href: "/profile",
    icon: User,
    description: "Manage your profile",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Application settings",
  },
];

const Navbar = async () => {
  const session = await auth();

  return (
    <NavigationMenu viewport={false} className="m-5 block max-w-full">
      <NavigationMenuList className="w-full justify-between">
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/">
              <Image
                src={"/lcm-logo-teal.svg"}
                width={40}
                height={40}
                alt="lcm logo"
                title="Home"
                aria-label="Home"
              />
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <div className="flex items-center gap-4">
          {/* Public Links */}
          <NavigationMenuItem>
            <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[280px] gap-3 p-4">
                {publicLinks.map((link) => (
                  <ListItem
                    key={link.title}
                    title={link.title}
                    href={link.href}
                    icon={link.icon}
                  >
                    {link.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* Posts Links */}
          <NavigationMenuItem>
            <NavigationMenuTrigger>Posts</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[280px] gap-3 p-4">
                {postLinks.map((link) => (
                  <ListItem
                    key={link.title}
                    title={link.title}
                    href={link.href}
                    icon={link.icon}
                  >
                    {link.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* Register Link - Only show if not authenticated */}
          {!session && (
            <NavigationMenuItem>
              <Button variant="outline">
                <Link href="/register" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Register
                </Link>
              </Button>
            </NavigationMenuItem>
          )}

          {/* Protected Links - Only show if authenticated */}
          {session && (
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <Shield className="mr-1 h-4 w-4" />
                Account
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[280px] gap-3 p-4">
                  {protectedLinks.map((link) => (
                    <ListItem
                      key={link.title}
                      title={link.title}
                      href={link.href}
                      icon={link.icon}
                    >
                      {link.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          )}

          <NavigationMenuItem>
            <SignIn />
          </NavigationMenuItem>
          <NavigationMenuItem>
            <ThemeModeToggle />
          </NavigationMenuItem>
        </div>
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
        <Link
          href={href}
          className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none"
        >
          <div className="flex items-center gap-2 text-sm leading-none font-medium">
            <Icon className="h-4 w-4" />
            {title}
          </div>
          {children && (
            <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
              {children}
            </p>
          )}
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

export default Navbar;
