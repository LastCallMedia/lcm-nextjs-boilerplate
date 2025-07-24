"use client";

import { useState } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import {
  Menu as MenuIcon,
  X,
  Moon,
  Sun,
  LayoutDashboard,
  User,
  Settings,
  File,
  Files,
  Infinity,
  LogIn,
  LogOut,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FormattedMessage } from "react-intl";
import { LanguageSwitcher } from "~/_components/i18n";
import { type Locale } from "~/i18n";
import { type LucideIcon } from "lucide-react";

interface NavbarLinks {
  titleKey: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  current?: boolean;
}

const protectedLinks: NavbarLinks[] = [
  {
    titleKey: "dashboard.title",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Your dashboard overview",
    current: true,
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { data: session } = useSession();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <Disclosure
        as="nav"
        className="bg-white shadow-sm transition-colors duration-200 dark:bg-gray-900"
      >
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none focus:ring-inset dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-200">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <MenuIcon
                  aria-hidden="true"
                  className="block h-6 w-6 group-data-[open]:hidden"
                />
                <X
                  aria-hidden="true"
                  className="hidden h-6 w-6 group-data-[open]:block"
                />
              </DisclosureButton>
            </div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex shrink-0 items-center">
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
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {publicLinks.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.titleKey}
                      href={`/${currentLocale}${item.href}`}
                      className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors duration-200 ${
                        item.current
                          ? "border-indigo-500 text-gray-900 dark:text-white"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-200"
                      }`}
                    >
                      <IconComponent className="mr-2 h-4 w-4" />
                      <FormattedMessage id={item.titleKey} />
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center space-x-3 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {/* Language Switcher */}
              <LanguageSwitcher currentLocale={currentLocale} />

              {/* Dark Mode Toggle - Custom or use ThemeModeToggle */}
              <button
                type="button"
                onClick={toggleDarkMode}
                className="relative rounded-full bg-white p-1 text-gray-400 transition-colors duration-200 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none dark:bg-gray-800 dark:text-gray-300 dark:hover:text-gray-200 dark:focus:ring-offset-gray-800"
                aria-label={
                  isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Toggle dark mode</span>
                {isDarkMode ? (
                  <Sun aria-hidden="true" className="h-6 w-6" />
                ) : (
                  <Moon aria-hidden="true" className="h-6 w-6" />
                )}
              </button>

              {/* Authentication Section */}
              {!session && (
                <Link
                  href={`/${currentLocale}/login`}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 transition-colors duration-200 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  <FormattedMessage id="navigation.signIn" />
                </Link>
              )}

              {/* Profile dropdown for authenticated users */}
              {session && (
                <Menu as="div" className="relative">
                  <div>
                    <MenuButton className="relative flex rounded-full bg-white text-sm transition-colors duration-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none dark:bg-gray-800 dark:focus:ring-offset-gray-800">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <Image
                        alt="User avatar"
                        src="/avatar.avif"
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full"
                        priority
                      />
                    </MenuButton>
                  </div>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-200 data-[enter]:ease-out data-[leave]:duration-75 data-[leave]:ease-in dark:bg-gray-800 dark:ring-white/5"
                  >
                    {protectedLinks.map((link) => (
                      <MenuItem key={link.titleKey}>
                        <Link
                          href={`/${currentLocale}${link.href}`}
                          className="block px-4 py-2 text-sm text-gray-700 transition-colors duration-200 data-[focus]:bg-gray-100 data-[focus]:outline-none dark:text-gray-200 dark:data-[focus]:bg-gray-700"
                        >
                          <div className="flex items-center">
                            <link.icon className="mr-2 h-4 w-4" />
                            <FormattedMessage id={link.titleKey} />
                          </div>
                        </Link>
                      </MenuItem>
                    ))}

                    {session.user?.role === "ADMIN" &&
                      adminLinks.map((link) => (
                        <MenuItem key={link.titleKey}>
                          <Link
                            href={`/${currentLocale}${link.href}`}
                            className="block px-4 py-2 text-sm text-gray-700 transition-colors duration-200 data-[focus]:bg-gray-100 data-[focus]:outline-none dark:text-gray-200 dark:data-[focus]:bg-gray-700"
                          >
                            <div className="flex items-center">
                              <link.icon className="mr-2 h-4 w-4" />
                              <FormattedMessage id={link.titleKey} />
                            </div>
                          </Link>
                        </MenuItem>
                      ))}

                    <MenuItem>
                      <button
                        onClick={() =>
                          signOut({ callbackUrl: `/${currentLocale}` })
                        }
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 transition-colors duration-200 data-[focus]:bg-gray-100 data-[focus]:outline-none dark:text-gray-200 dark:data-[focus]:bg-gray-700"
                      >
                        <div className="flex items-center">
                          <LogOut className="mr-2 h-4 w-4" />
                          <FormattedMessage id="navigation.signOut" />
                        </div>
                      </button>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              )}
            </div>
          </div>
        </div>

        <DisclosurePanel className="border-t border-gray-200 bg-white transition-colors duration-200 sm:hidden dark:border-gray-700 dark:bg-gray-900">
          <div className="space-y-1 pt-2 pb-4">
            {/* Public Links */}
            {publicLinks.map((item) => {
              const IconComponent = item.icon;
              return (
                <DisclosureButton
                  key={item.titleKey}
                  as={Link}
                  href={`/${currentLocale}${item.href}`}
                  className="flex items-center border-l-4 border-transparent py-2 pr-4 pl-3 text-base font-medium text-gray-500 transition-colors duration-200 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                >
                  <IconComponent className="mr-3 h-5 w-5" />
                  <FormattedMessage id={item.titleKey} />
                </DisclosureButton>
              );
            })}

            {/* Authentication in mobile menu */}
            {!session && (
              <DisclosureButton
                as={Link}
                href={`/${currentLocale}/login`}
                className="flex items-center border-l-4 border-transparent py-2 pr-4 pl-3 text-base font-medium text-gray-500 transition-colors duration-200 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              >
                <LogIn className="mr-3 h-5 w-5" />
                <FormattedMessage id="navigation.signIn" />
              </DisclosureButton>
            )}

            {session && (
              <DisclosureButton
                as="button"
                onClick={() => signOut({ callbackUrl: `/${currentLocale}` })}
                className="flex w-full items-center border-l-4 border-transparent py-2 pr-4 pl-3 text-left text-base font-medium text-gray-500 transition-colors duration-200 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              >
                <LogOut className="mr-3 h-5 w-5" />
                <FormattedMessage id="navigation.signOut" />
              </DisclosureButton>
            )}
          </div>
        </DisclosurePanel>
      </Disclosure>
    </div>
  );
};

export default Navbar;
