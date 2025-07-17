import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/_components/ui/card";
import { Button } from "~/_components/ui/button";
import { Input } from "~/_components/ui/input";
import { Label } from "~/_components/ui/label";
import { Badge } from "~/_components/ui/badge";

export const metadata: Metadata = {
  title: "Contact | LCM Next.js Boilerplate",
  description: "Get in touch with us for questions, feedback, or support.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Let&apos;s build something amazing together.
        </h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
          Ready to explore, innovate, and scale with confidence? We&apos;ll
          guide you the entire way. Get in touch below.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Send a Message
                <Badge variant="outline">Public</Badge>
              </CardTitle>
              <CardDescription>
                Fill out the form below and we&apos;ll get back to you soon
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    placeholder="Your first name"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" placeholder="Your last name" disabled />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Business Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@company.com"
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization">Organization *</Label>
                <Input
                  id="organization"
                  placeholder="Your company or organization"
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hearAbout">How did you hear about us? *</Label>
                <Input
                  id="hearAbout"
                  placeholder="Search engine, referral, social media, etc."
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">
                  Tell us about your project or challenge *
                </Label>
                <textarea
                  id="message"
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[120px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="e.g., tech stack, timeline, goals, specific requirements..."
                  disabled
                />
              </div>

              <Button className="w-full" disabled>
                Send Message
              </Button>

              <div className="bg-muted/50 rounded-lg border p-3">
                <p className="text-muted-foreground text-sm">
                  <strong>Demo Note:</strong> This contact form is for
                  demonstration purposes only. In a real application, you would
                  implement form handling and email sending functionality.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Other ways to contact us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="mb-1 font-medium">Call:</h4>
                <p className="text-muted-foreground mb-2 text-sm">
                  +1 (555) 123-4567
                </p>
                <p className="text-muted-foreground text-xs">
                  We&apos;re ready to help you anytime within business hours.
                </p>
              </div>

              <div>
                <h4 className="mb-1 font-medium">Email:</h4>
                <p className="text-muted-foreground mb-2 text-sm">
                  hello@lcm-nextjs-boilerplate.com
                </p>
                <p className="text-muted-foreground text-xs">
                  We&apos;ll do our best to reply within one business day.
                </p>
              </div>

              <div>
                <h4 className="mb-1 font-medium">Support:</h4>
                <p className="text-muted-foreground mb-2 text-sm">
                  support@lcm-nextjs-boilerplate.com
                </p>
                <p className="text-muted-foreground text-xs">
                  For technical support and bug reports.
                </p>
              </div>

              <div>
                <h4 className="mb-1 font-medium">Partnerships:</h4>
                <p className="text-muted-foreground mb-2 text-sm">
                  partnerships@lcm-nextjs-boilerplate.com
                </p>
                <p className="text-muted-foreground text-xs">
                  Talk to our team about collaboration opportunities.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About Our Process</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                We build digital solutions that scale with certainty through
                empathy-driven design and agile development practices.
              </p>
              <div className="space-y-3">
                <div>
                  <h5 className="text-sm font-medium">Discovery & Planning</h5>
                  <p className="text-muted-foreground text-xs">
                    We start by understanding your goals and requirements.
                  </p>
                </div>
                <div>
                  <h5 className="text-sm font-medium">Design & Development</h5>
                  <p className="text-muted-foreground text-xs">
                    Iterative development with continuous feedback.
                  </p>
                </div>
                <div>
                  <h5 className="text-sm font-medium">Launch & Support</h5>
                  <p className="text-muted-foreground text-xs">
                    Ongoing support to ensure your success.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
