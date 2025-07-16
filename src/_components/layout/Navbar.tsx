"use client";

import { File, Files, type LucideIcon } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import Image from "next/image";
import { ThemeModeToggle } from "~/_components/theme";
import { LanguageSwitcher } from "~/_components/i18n";
import { SignIn } from "~/_components/auth";
import {
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
}

const navbarLinks: NavbarLinks[] = [
  { titleKey: "navigation.post", href: "/post", icon: File },
  { titleKey: "navigation.allPosts", href: "/posts", icon: Files },
];

interface NavbarProps {
  currentLocale: Locale;
}

const Navbar = ({ currentLocale }: NavbarProps) => {
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
                {navbarLinks?.map((link) => (
                  <NavItem
                    key={link.titleKey}
                    titleKey={link.titleKey}
                    href={`/${currentLocale}${link.href}`}
                    icon={link.icon}
                  />
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <LanguageSwitcher currentLocale={currentLocale} />
          </NavigationMenuItem>
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
