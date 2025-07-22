"use client";

import {
  Files,
  Infinity,
  Info,
  LayoutDashboard,
  LogIn,
  LogOut,
  Mail,
  Settings,
  Shield,
  User,
  type LucideIcon,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import GoogleSignInButton from "~/_components/auth/GoogleSignInButton";
import { ThemeModeToggle } from "~/_components/theme";
import {
  Button,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "~/_components/ui";

interface NavbarLinks {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
}

const protectedLinks: NavbarLinks[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Your dashboard overview",
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
    description: "Manage your profile",
  },
];

const adminLinks: NavbarLinks[] = [
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
    description: "Application settings",
  },
];

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
  {
    title: "All Posts",
    href: "/posts",
    icon: Files,
    description: "Browse all posts",
  },
  {
    title: "Infinite Posts",
    href: "/infinite-posts",
    icon: Infinity,
    description: "Explore posts with infinite scroll",
  },
];

const Navbar = () => {
  const { data: session } = useSession();
  const isGoogleConfigured =
    process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED?.toLowerCase() === "true";

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
          <NavigationMenuItem>
            <NavigationMenuTrigger>Discover</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[200px] gap-4">
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
                  {session.user?.role === "ADMIN" &&
                    adminLinks.map((link) => (
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

          {/* Show sign-in and Google sign-in as separate menu items when not logged in */}
          {!session && (
            <>
              <NavigationMenuItem>
                <Link href="/login" className={navigationMenuTriggerStyle()}>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign in
                </Link>
              </NavigationMenuItem>
              {isGoogleConfigured && (
                <NavigationMenuItem>
                  <GoogleSignInButton isGoogleConfigured={true} />
                </NavigationMenuItem>
              )}
            </>
          )}

          {/* Sign out button for authenticated users */}
          {session && (
            <NavigationMenuItem>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="cursor-pointer"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </NavigationMenuItem>
          )}
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
