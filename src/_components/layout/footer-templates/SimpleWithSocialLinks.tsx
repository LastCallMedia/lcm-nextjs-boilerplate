import { Facebook, Github, Instagram, Youtube } from "lucide-react";
import { useIntl } from "react-intl";

export default function SimpleWithSocialLinks() {
  const intl = useIntl();

  const navigation = [
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

  return (
    <footer className="text-muted-foreground bg-card w-full border-t py-2 text-center text-sm">
      <div className="mx-auto max-w-7xl px-6 py-4 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center gap-x-6 md:order-2">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-600 hover:text-gray-800"
            >
              <span className="sr-only">{item.name}</span>
              <item.icon aria-hidden="true" className="size-6" />
            </a>
          ))}
        </div>
        <p className="mt-8 text-center text-gray-600 md:order-1 md:mt-0">
          &copy; {new Date().getFullYear()}{" "}
          {intl.formatMessage({ id: "footer.text" })}
        </p>
      </div>
    </footer>
  );
}
