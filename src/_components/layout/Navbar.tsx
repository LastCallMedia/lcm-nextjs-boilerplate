"use client";

import { Disclosure, DisclosureButton } from "@headlessui/react";
import {
  Contact,
  File,
  Files,
  Infinity,
  Info,
  LayoutDashboard,
  LogIn,
  LogOut,
  Settings,
  Shield,
  User,
  type LucideIcon,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FormattedMessage } from "react-intl";
import { GoogleSignInButton } from "~/_components/auth/google-sign-in-button";
import { LanguageSwitcher } from "~/_components/i18n";
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
import { type Locale } from "~/i18n";
import { t } from "~/i18n/messages";

interface NavbarLinks {
  titleKey: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  isProtected?: boolean; // Optional, true if the link requires authentication
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

const menuLinks: NavbarLinks[] = [
  {
    titleKey: "navigation.post",
    href: "/post",
    icon: File,
    description: "Create a post",
    isProtected: true,
  },
  {
    titleKey: "navigation.allPosts",
    href: "/posts",
    icon: Files,
    description: "Browse all posts",
    isProtected: true,
  },
  {
    titleKey: "navigation.infinitePosts",
    href: "/infinite-posts",
    icon: Infinity,
    description: "Explore posts with infinite scroll",
    isProtected: true,
  },
  {
    titleKey: "navigation.about",
    href: "/about",
    icon: Info,
    description: "Learn more about us",
  },
  {
    titleKey: "navigation.contact",
    href: "/contact",
    icon: Contact,
    description: "Get in touch with us",
  },
];

interface NavbarProps {
  currentLocale: Locale;
}

export function Navbar({ currentLocale }: NavbarProps) {
  const { data: session } = useSession();
  const isGoogleConfigured =
    process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED?.toLowerCase() === "true";

  return (
    <nav className="relative">
      {/* Desktop Navbar */}
      <div className="hidden sm:block">
        <NavigationMenu viewport={false} className="m-5 block max-w-full">
          <NavigationMenuList className="w-full justify-between">
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
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
                  <FormattedMessage id={t("navigation.menu")} />
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-4">
                    {menuLinks.map((link) => {
                      if (link.isProtected && !session) {
                        return null; // Skip protected links if not authenticated
                      }
                      return (
                        <NavItem
                          key={link.titleKey}
                          titleKey={link.titleKey}
                          href={`/${currentLocale}${link.href}`}
                          icon={link.icon}
                        >
                          {link.description}
                        </NavItem>
                      );
                    })}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Protected Links - Only show if authenticated */}
              {session && (
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <Shield className="mr-1 h-4 w-4" />
                    <FormattedMessage id={t("navigation.account")} />
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
                    <FormattedMessage id={t("navigation.signIn")} />
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
                    onClick={() =>
                      signOut({ callbackUrl: `/${currentLocale}` })
                    }
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <FormattedMessage id={t("navigation.signOut")} />
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
      </div>

      {/* Mobile Navbar */}
      <div className="sm:hidden">
        <Disclosure>
          {({ open, close }) => (
            <div className="relative flex h-16 items-center justify-between px-2">
              <div className="flex items-center">
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
              </div>
              <div className="flex items-center gap-2">
                <LanguageSwitcher currentLocale={currentLocale} />
                <div className="relative">
                  <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none focus:ring-inset dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white">
                    <span className="sr-only">Open main menu</span>
                    {/* Hamburger icon */}
                    <svg
                      className={`block h-6 w-6 ${open ? "hidden" : ""}`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                    {/* Close icon */}
                    <svg
                      className={`h-6 w-6 ${open ? "block" : "hidden"}`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </DisclosureButton>
                  {open && (
                    <div className="fixed top-16 right-0 left-0 z-50 w-full bg-[#0f172b] shadow-lg">
                      <div className="flex flex-col px-4 py-2">
                        {/* Public Links */}
                        {menuLinks.map((link) => {
                          if (link.isProtected && !session) {
                            return null; // Skip protected links if not authenticated
                          }
                          return (
                            <Link
                              key={link.titleKey}
                              href={`/${currentLocale}${link.href}`}
                              className="flex items-center gap-2 rounded-md py-3 text-base text-gray-700 hover:bg-gray-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                              onClick={() => close()}
                            >
                              <link.icon className="h-5 w-5" />
                              <FormattedMessage id={link.titleKey} />
                            </Link>
                          );
                        })}
                        {/* Protected Links */}
                        {session &&
                          protectedLinks.map((link) => (
                            <Link
                              key={link.titleKey}
                              href={`/${currentLocale}${link.href}`}
                              className="flex items-center gap-2 rounded-md py-3 text-base text-gray-700 hover:bg-gray-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                              onClick={() => close()}
                            >
                              <link.icon className="h-5 w-5" />
                              <FormattedMessage id={link.titleKey} />
                            </Link>
                          ))}
                        {/* Admin Links */}
                        {session?.user?.role === "ADMIN" &&
                          adminLinks.map((link) => (
                            <Link
                              key={link.titleKey}
                              href={`/${currentLocale}${link.href}`}
                              className="flex items-center gap-2 rounded-md py-3 text-base text-gray-700 hover:bg-gray-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                              onClick={() => close()}
                            >
                              <link.icon className="h-5 w-5" />
                              <FormattedMessage id={link.titleKey} />
                            </Link>
                          ))}
                        {/* Auth buttons */}
                        {!session && (
                          <Link
                            href={`/${currentLocale}/login`}
                            className="flex items-center gap-2 rounded-md py-3 text-base text-gray-700 hover:bg-gray-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                            onClick={() => close()}
                          >
                            <LogIn className="h-5 w-5" />
                            <FormattedMessage id={t("navigation.signIn")} />
                          </Link>
                        )}
                        {!session && isGoogleConfigured && (
                          <div className="py-3">
                            <GoogleSignInButton isGoogleConfigured={true} />
                          </div>
                        )}
                        {session && (
                          <button
                            type="button"
                            className="flex w-full items-center gap-2 rounded-md py-3 text-base text-gray-700 hover:bg-gray-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                            onClick={() =>
                              signOut({ callbackUrl: `/${currentLocale}` })
                            }
                          >
                            <LogOut className="h-5 w-5" />
                            <FormattedMessage id={t("navigation.signOut")} />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <ThemeModeToggle />
              </div>
            </div>
          )}
        </Disclosure>
      </div>
    </nav>
  );
}

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
