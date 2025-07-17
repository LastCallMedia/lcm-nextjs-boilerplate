import { Files, ShieldIcon, Info, Mail, type LucideIcon } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import Image from "next/image";
import { auth } from "~/server/auth";
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
import { SignIn } from "~/_components/auth";

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

const privateLinks: NavbarLinks[] = [
  { title: "All Posts", href: "/posts", icon: Files },
];

const adminLink: NavbarLinks = {
  title: "Admin",
  href: "/admin",
  icon: ShieldIcon,
};

const Navbar = async () => {
  const session = await auth();
  const showPrivate = !!session?.user;
  const isAdmin = session?.user?.role === "ADMIN";

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
          {showPrivate && (
            <NavigationMenuItem>
              <NavigationMenuTrigger>Dashboard</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-4">
                  {privateLinks.map((link) => (
                    <ListItem
                      key={link.title}
                      title={link.title}
                      href={link.href}
                      icon={link.icon}
                    >
                      {link.description}
                    </ListItem>
                  ))}
                  {isAdmin && (
                    <ListItem
                      key={adminLink.title}
                      title={adminLink.title}
                      href={adminLink.href}
                      icon={adminLink.icon}
                    >
                      {adminLink.description}
                    </ListItem>
                  )}
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
