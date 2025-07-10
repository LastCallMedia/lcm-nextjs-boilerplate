import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/_components/ui/card";
import { Badge } from "~/_components/ui/badge";

export const metadata: Metadata = {
  title: "Privacy Policy | LCM Next.js Boilerplate",
  description:
    "Privacy policy and data handling practices for the LCM Next.js Boilerplate.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Demo Notice
              <Badge variant="outline">Public</Badge>
            </CardTitle>
            <CardDescription>
              Important information about this demonstration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 rounded-lg border p-4">
              <p className="text-sm">
                <strong>This is a demonstration application.</strong> This
                privacy policy is provided as an example of what a real
                application might include. This is not a legally binding
                document and is for educational purposes only.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>1. Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <p>
              This demo application may collect the following types of
              information:
            </p>
            <ul>
              <li>
                <strong>Account Information:</strong> Email address, name, and
                profile picture (via OAuth providers)
              </li>
              <li>
                <strong>Usage Data:</strong> How you interact with the
                application
              </li>
              <li>
                <strong>Technical Data:</strong> Browser type, IP address, and
                device information
              </li>
              <li>
                <strong>Content:</strong> Posts and other content you create in
                the application
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <p>In this demonstration, your information is used to:</p>
            <ul>
              <li>Provide and maintain the demo functionality</li>
              <li>Authenticate your identity</li>
              <li>Display personalized content</li>
              <li>Improve the demo experience</li>
              <li>Demonstrate authentication and authorization features</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Information Sharing</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <p>
              We do not sell, trade, or otherwise transfer your information to
              third parties. This demo application may share information only in
              the following circumstances:
            </p>
            <ul>
              <li>With your consent</li>
              <li>For legal compliance</li>
              <li>To protect rights and safety</li>
              <li>With service providers necessary for demo functionality</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Data Storage and Security</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <p>Your data in this demo application:</p>
            <ul>
              <li>Is stored securely using industry-standard practices</li>
              <li>May be deleted at any time without notice</li>
              <li>Is not backed up or guaranteed to persist</li>
              <li>Uses encrypted connections (HTTPS)</li>
              <li>Follows OAuth 2.0 security standards</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Cookies and Tracking</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <p>This demo application uses:</p>
            <ul>
              <li>
                <strong>Essential Cookies:</strong> Required for authentication
                and basic functionality
              </li>
              <li>
                <strong>Session Cookies:</strong> To maintain your login state
              </li>
              <li>
                <strong>Local Storage:</strong> For user preferences and
                settings
              </li>
            </ul>
            <p>We do not use tracking cookies or analytics in this demo.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Your Rights</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <p>You have the right to:</p>
            <ul>
              <li>Access the personal information we have about you</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Withdraw consent at any time</li>
              <li>Export your data</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Third-Party Services</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <p>This demo application integrates with:</p>
            <ul>
              <li>
                <strong>Google OAuth:</strong> For authentication (subject to
                Google&apos;s privacy policy)
              </li>
              <li>
                <strong>Vercel:</strong> For hosting (subject to Vercel&apos;s
                privacy policy)
              </li>
              <li>
                <strong>PostgreSQL:</strong> For data storage
              </li>
            </ul>
            <p>
              These services have their own privacy policies which govern their
              use of your information.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Children&apos;s Privacy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <p>
              This demo application is not intended for children under 13. We do
              not knowingly collect personal information from children under 13.
              If you are a parent or guardian and believe your child has
              provided us with personal information, please contact us.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. Changes to This Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <p>
              We may update this privacy policy from time to time. We will
              notify you of any changes by posting the new privacy policy on
              this page and updating the &quot;Last updated&quot; date.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              If you have any questions about this Privacy Policy, please
              contact us through our contact page or email us at
              demo@lcm-nextjs-boilerplate.com
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
