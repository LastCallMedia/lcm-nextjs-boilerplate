import { Facebook, Github, Instagram, Youtube } from "lucide-react";
import { useIntl } from "react-intl";

export default function SimpleCentered() {
  const intl = useIntl();

  const navigation = {
    main: [
      {
        name: intl.formatMessage({ id: "footer.navigation.about" }),
        href: "#",
      },
      { name: intl.formatMessage({ id: "footer.navigation.blog" }), href: "#" },
      { name: intl.formatMessage({ id: "footer.navigation.jobs" }), href: "#" },
      {
        name: intl.formatMessage({ id: "footer.navigation.press" }),
        href: "#",
      },
      {
        name: intl.formatMessage({ id: "footer.navigation.accessibility" }),
        href: "#",
      },
      {
        name: intl.formatMessage({ id: "footer.navigation.partners" }),
        href: "#",
      },
    ],
    social: [
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
    ],
  };

  return (
    <footer className="text-muted-foreground bg-card w-full border-t py-4 text-center text-sm">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <nav
          aria-label="Footer"
          className="-mb-6 flex flex-wrap justify-center gap-x-12 gap-y-3 text-sm/6"
        >
          {navigation.main.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-600 hover:text-gray-900"
            >
              {item.name}
            </a>
          ))}
        </nav>
        <div className="mt-16 flex justify-center gap-x-10">
          {navigation.social.map((item) => (
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
        <p className="mt-10 text-center text-gray-600">
          &copy; {new Date().getFullYear()}{" "}
          {intl.formatMessage({ id: "footer.text" })}
        </p>
      </div>
    </footer>
  );
}
