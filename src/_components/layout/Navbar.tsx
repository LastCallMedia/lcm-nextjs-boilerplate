import {
  Files,
  Info,
  Mail,
  Shield,
  User,
  Settings,
  LayoutDashboard,
  LogIn,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

import Image from "next/image";
import { ThemeModeToggle } from "~/_components/theme";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "~/_components/ui";
import { Button } from "~/_components/ui/button";
import { auth, signOut } from "~/server/auth";

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
  {
    title: "Posts",
    href: "/posts",
    icon: Files,
    description: "Browse all posts",
  },
];

const protectedLinks: NavbarLinks[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Your dashboard overview",
  },
  {
    title: "Create Post",
    href: "/posts/create",
    icon: Files,
    description: "Write a new post",
  },
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
            {session ? (
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <Button type="submit" variant="ghost" size="sm">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </Button>
              </form>
            ) : (
              <Link href="/login" className={navigationMenuTriggerStyle()}>
                <LogIn className="mr-2 h-4 w-4" />
                Sign in
              </Link>
            )}
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
