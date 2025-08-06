import { Facebook, Github, Instagram, Youtube } from "lucide-react";
import { useIntl } from "react-intl";
import Link from "next/link";

export default function SimpleWithSocialLinks() {
  const intl = useIntl();

  const socialNavigation = [
    {
      name: intl.formatMessage({ id: "footer.social.facebook" }),
      href: "#",
      icon: Facebook,
    },
    {
      name: intl.formatMessage({ id: "footer.social.instagram" }),
      href: "#",
      icon: Instagram,
    },
    {
      name: intl.formatMessage({ id: "footer.social.github" }),
      href: "#",
      icon: Github,
    },
    {
      name: intl.formatMessage({ id: "footer.social.youtube" }),
      href: "#",
      icon: Youtube,
    },
  ];

  const mainNavigation = [
    {
      name: "About",
      href: "/about",
    },
    {
      name: "Contact",
      href: "/contact",
    },
    // Add more main navigation items here as needed
  ];

  return (
    <footer className="text-muted-foreground bg-card w-full border-t py-2 text-center text-sm">
      <div className="mx-auto max-w-7xl px-6 py-4 md:flex md:items-center md:justify-between lg:px-8">
        {/* Main Navigation */}
        <div className="flex justify-center gap-x-6 md:order-1 md:justify-start">
          {mainNavigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-x-6 md:order-3">
          {socialNavigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="sr-only">{item.name}</span>
              <item.icon aria-hidden="true" className="size-6" />
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-muted-foreground mt-8 text-center md:order-2 md:mt-0">
          &copy; {new Date().getFullYear()}{" "}
          {intl.formatMessage({ id: "footer.text" })}
        </p>
      </div>
    </footer>
  );
}
