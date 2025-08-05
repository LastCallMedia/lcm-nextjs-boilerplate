import { Building2, Mail, PhoneIcon } from "lucide-react";
import { Button } from "~/_components/ui/button";
import { Input } from "~/_components/ui/input";
import { Label } from "~/_components/ui/label";
import type { Metadata } from "next";
import { Textarea } from "~/_components";

export const metadata: Metadata = {
  title: "Contact | LCM Next.js Boilerplate",
  description: "Get in touch with us for questions, feedback, or support.",
};

export default function ContactPage() {
  return (
    <div className="bg-background relative isolate pb-10">
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
        <div className="relative px-6 pt-24 pb-20 sm:pt-32 lg:static lg:px-8 lg:py-48">
          <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
            <div className="bg-muted ring-border absolute inset-y-0 left-0 -z-10 w-full overflow-hidden ring-1 lg:w-1/2">
              <svg
                aria-hidden="true"
                className="stroke-border absolute inset-0 size-full mask-[radial-gradient(100%_100%_at_top_right,white,transparent)] dark:mask-[radial-gradient(100%_100%_at_top_right,black,transparent)]"
              >
                <defs>
                  <pattern
                    x="100%"
                    y={-1}
                    id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
                    width={200}
                    height={200}
                    patternUnits="userSpaceOnUse"
                  >
                    <path d="M130 200V.5M.5 .5H200" fill="none" />
                  </pattern>
                </defs>
                <rect
                  width="100%"
                  height="100%"
                  strokeWidth={0}
                  className="fill-background"
                />
                <svg x="100%" y={-1} className="fill-muted/50 overflow-visible">
                  <path d="M-470.5 0h201v201h-201Z" strokeWidth={0} />
                </svg>
                <rect
                  fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)"
                  width="100%"
                  height="100%"
                  strokeWidth={0}
                />
              </svg>
              <div
                aria-hidden="true"
                className="absolute top-[calc(100%-13rem)] -left-56 hidden transform-gpu blur-3xl lg:top-[calc(50%-7rem)] lg:left-[max(-14rem,calc(100%-59rem))]"
              >
                <div
                  style={{
                    clipPath:
                      "polygon(74.1% 56.1%, 100% 38.6%, 97.5% 73.3%, 85.5% 100%, 80.7% 98.2%, 72.5% 67.7%, 60.2% 37.8%, 52.4% 32.2%, 47.5% 41.9%, 45.2% 65.8%, 27.5% 23.5%, 0.1% 35.4%, 17.9% 0.1%, 27.6% 23.5%, 76.1% 2.6%, 74.1% 56.1%)",
                  }}
                  className="from-primary/20 to-accent/20 aspect-1155/678 w-288.75 bg-gradient-to-br opacity-60"
                />
              </div>
            </div>
            <h2 className="text-foreground text-4xl font-semibold tracking-tight text-pretty sm:text-5xl">
              Let&apos;s build something amazing together.
            </h2>
            <p className="text-muted-foreground mt-6 text-lg/8">
              Ready to explore, innovate, and scale with confidence? We&apos;ll
              guide you the entire way. Get in touch below.
            </p>
            <dl className="text-muted-foreground mt-10 space-y-4 text-base/7">
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">Address</span>
                  <Building2
                    aria-hidden="true"
                    className="text-muted-foreground/60 h-7 w-6"
                  />
                </dt>
                <dd>
                  545 Mavis Island
                  <br />
                  Chicago, IL 99191
                </dd>
              </div>
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">Telephone</span>
                  <PhoneIcon
                    aria-hidden="true"
                    className="text-muted-foreground/60 h-7 w-6"
                  />
                </dt>
                <dd>
                  <a
                    href="tel:+1 (555) 234-5678"
                    className="hover:text-foreground transition-colors"
                  >
                    +1 (555) 123-4567
                  </a>
                </dd>
              </div>
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">Email</span>
                  <Mail
                    aria-hidden="true"
                    className="text-muted-foreground/60 h-7 w-6"
                  />
                </dt>
                <dd>
                  <a
                    href="mailto:hello@example.com"
                    className="hover:text-foreground transition-colors"
                  >
                    hello@lcm-nextjs-boilerplate.com
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <form
          action="#"
          method="POST"
          className="px-6 pt-20 pb-24 sm:pb-32 lg:px-8 lg:py-48"
        >
          <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <div className="mt-2.5">
                  <Input id="firstName" placeholder="Your first name" />
                </div>
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <div className="mt-2.5">
                  <Input id="lastName" placeholder="Your last name" />
                </div>
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="email">Email *</Label>
                <div className="mt-2.5">
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@company.com"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="phone-number">Phone Number *</Label>
                <div className="mt-2.5">
                  <Input
                    id="phone-number"
                    type="tel"
                    placeholder="(123) 456-7890"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="message">Message *</Label>
                <div className="mt-2.5">
                  <Textarea id="message" placeholder="Your message..." />
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <Button>Send Message</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
