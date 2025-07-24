import { Facebook, Github, Instagram, Youtube } from "lucide-react";
import Image from "next/image";
import { useIntl } from "react-intl";

export default function FourColumnWithMission() {
  const intl = useIntl();

  const navigation = {
    solutions: [
      {
        name: intl.formatMessage({ id: "footer.solutions.marketing" }),
        href: "#",
      },
      {
        name: intl.formatMessage({ id: "footer.solutions.analytics" }),
        href: "#",
      },
      {
        name: intl.formatMessage({ id: "footer.solutions.automation" }),
        href: "#",
      },
      {
        name: intl.formatMessage({ id: "footer.solutions.commerce" }),
        href: "#",
      },
      {
        name: intl.formatMessage({ id: "footer.solutions.insights" }),
        href: "#",
      },
    ],
    support: [
      {
        name: intl.formatMessage({ id: "footer.support.submitTicket" }),
        href: "#",
      },
      {
        name: intl.formatMessage({ id: "footer.support.documentation" }),
        href: "#",
      },
      { name: intl.formatMessage({ id: "footer.support.guides" }), href: "#" },
    ],
    company: [
      {
        name: intl.formatMessage({ id: "footer.companyLinks.about" }),
        href: "#",
      },
      {
        name: intl.formatMessage({ id: "footer.companyLinks.blog" }),
        href: "#",
      },
      {
        name: intl.formatMessage({ id: "footer.companyLinks.jobs" }),
        href: "#",
      },
      {
        name: intl.formatMessage({ id: "footer.companyLinks.press" }),
        href: "#",
      },
    ],
    legal: [
      { name: intl.formatMessage({ id: "footer.legal.terms" }), href: "#" },
      { name: intl.formatMessage({ id: "footer.legal.privacy" }), href: "#" },
      { name: intl.formatMessage({ id: "footer.legal.license" }), href: "#" },
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
    <footer className="text-muted-foreground bg-card mt-8 w-full border-t py-2 text-center text-sm">
      <div className="mx-auto max-w-7xl px-6 pt-4 pb-4 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="flex flex-col items-center gap-6">
            <Image
              alt={intl.formatMessage({ id: "footer.companyInfo.name" })}
              src="/lcm-logo-teal.svg"
              width={36}
              height={36}
              className="h-9"
            />
            <p className="text-balance text-gray-600">
              {intl.formatMessage({ id: "footer.companyInfo.mission" })}
            </p>
            <div className="flex items-center gap-x-6">
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
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {intl.formatMessage({ id: "footer.sections.solutions" })}
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.solutions.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="font-semibold text-gray-900">
                  {intl.formatMessage({ id: "footer.sections.support" })}
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.support.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {intl.formatMessage({ id: "footer.sections.company" })}
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm/6 text-gray-600 hover:text-gray-900"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="font-semibold text-gray-900">
                  {intl.formatMessage({ id: "footer.sections.legal" })}
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-900/10 pt-8">
          <p className="text-gray-600">
            &copy; {new Date().getFullYear()}{" "}
            {intl.formatMessage({ id: "footer.text" })}
          </p>
        </div>
      </div>
    </footer>
  );
}
