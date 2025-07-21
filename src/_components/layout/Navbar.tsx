"use client";

import React from "react";
import {
  Files,
  File,
  Infinity,
  LayoutDashboard,
  LogIn,
  LogOut,
  Settings,
  Shield,
  User,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { ThemeModeToggle } from "~/_components/theme";
import { LanguageSwitcher } from "~/_components/i18n";
import { FormattedMessage } from "react-intl";
import GoogleSignInButton from "../auth/GoogleSignInButton";
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
import { type Locale } from "~/i18n";

interface NavbarLinks {
  titleKey: string;
  href: string;
  icon: LucideIcon;
  description?: string;
}

const protectedLinks: NavbarLinks[] = [
  {
    titleKey: "navigation.home",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Your dashboard overview",
  },
  {
    titleKey: "navigation.profile",
    href: "/profile",
    icon: User,
    description: "Manage your profile",
  },
];

const adminLinks: NavbarLinks[] = [
  {
    titleKey: "navigation.settings",
    href: "/admin/settings",
    icon: Settings,
    description: "Application settings",
  },
];

const publicLinks: NavbarLinks[] = [
  {
    titleKey: "navigation.post",
    href: "/post",
    icon: File,
    description: "Create a post",
  },
  {
    titleKey: "navigation.allPosts",
    href: "/posts",
    icon: Files,
    description: "Browse all posts",
  },
  {
    titleKey: "navigation.infinitePosts",
    href: "/infinite-posts",
    icon: Infinity,
    description: "Explore posts with infinite scroll",
  },
];

interface NavbarProps {
  currentLocale: Locale;
}

const Navbar = ({ currentLocale }: NavbarProps) => {
  const { data: session } = useSession();
  const isGoogleConfigured =
    process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED?.toLowerCase() === "true";

  return (
    <NavigationMenu viewport={false} className="m-5 block max-w-full">
      <NavigationMenuList className="w-full justify-between">
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href={`/${currentLocale}`}>
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
            <NavigationMenuTrigger>
              <FormattedMessage id="navigation.menu" />
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[200px] gap-4">
                {publicLinks.map((link) => (
                  <NavItem
                    key={link.titleKey}
                    titleKey={link.titleKey}
                    href={`/${currentLocale}${link.href}`}
                    icon={link.icon}
                  >
                    {link.description}
                  </NavItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* Protected Links - Only show if authenticated */}
          {session && (
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <Shield className="mr-1 h-4 w-4" />
                <FormattedMessage id="navigation.account" />
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[280px] gap-3 p-4">
                  {protectedLinks.map((link) => (
                    <NavItem
                      key={link.titleKey}
                      titleKey={link.titleKey}
                      href={`/${currentLocale}${link.href}`}
                      icon={link.icon}
                    >
                      {link.description}
                    </NavItem>
                  ))}
                  {session.user?.role === "ADMIN" &&
                    adminLinks.map((link) => (
                      <NavItem
                        key={link.titleKey}
                        titleKey={link.titleKey}
                        href={`/${currentLocale}${link.href}`}
                        icon={link.icon}
                      >
                        {link.description}
                      </NavItem>
                    ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          )}
          {/* Show sign-in and Google sign-in as separate menu items when not logged in */}
          {!session && (
            <NavigationMenuItem>
              <Link
                href={`/${currentLocale}/login`}
                className={navigationMenuTriggerStyle()}
              >
                <LogIn className="mr-2 h-4 w-4" />
                <FormattedMessage id="navigation.signIn" />
              </Link>
            </NavigationMenuItem>
          )}
          {!session && isGoogleConfigured && (
            <NavigationMenuItem>
              <GoogleSignInButton isGoogleConfigured={true} />
            </NavigationMenuItem>
          )}
          {/* Sign out button for authenticated users */}
          {session && (
            <NavigationMenuItem>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="cursor-pointer"
                onClick={() => signOut({ callbackUrl: `/${currentLocale}` })}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <FormattedMessage id="navigation.signOut" />
              </Button>
            </NavigationMenuItem>
          )}
          <NavigationMenuItem>
            <LanguageSwitcher currentLocale={currentLocale} />
          </NavigationMenuItem>
          <NavigationMenuItem>
            <ThemeModeToggle />
          </NavigationMenuItem>
        </div>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

function NavItem({
  titleKey,
  href,
  icon: Icon,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & {
  titleKey: string;
  href: string;
  icon: LucideIcon;
}) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="flex gap-2 text-sm leading-none font-medium">
            <Icon />
            <FormattedMessage id={titleKey} />
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

export default Navbar;
