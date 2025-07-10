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
  title: "Terms of Service | LCM Next.js Boilerplate",
  description:
    "Terms of service and usage guidelines for the LCM Next.js Boilerplate.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
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
                <strong>This is a demonstration application.</strong> These
                terms of service are provided as an example of what a real
                application might include. This is not a legally binding
                document and is for educational purposes only.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>1. Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <p>
              By accessing and using this LCM Next.js Boilerplate demo
              application, you accept and agree to be bound by the terms and
              provision of this agreement.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Use License</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <p>
              Permission is granted to temporarily download one copy of this
              demo application for personal, non-commercial transitory viewing
              only. This is the grant of a license, not a transfer of title, and
              under this license you may not:
            </p>
            <ul>
              <li>modify or copy the materials</li>
              <li>
                use the materials for any commercial purpose or for any public
                display
              </li>
              <li>
                attempt to reverse engineer any software contained in the demo
              </li>
              <li>
                remove any copyright or other proprietary notations from the
                materials
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Demo Data and Privacy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <p>
              This demonstration application may collect basic user information
              for authentication purposes. Any data collected is:
            </p>
            <ul>
              <li>Used solely for demonstration purposes</li>
              <li>Not shared with third parties</li>
              <li>May be deleted at any time without notice</li>
              <li>Not backed up or guaranteed to persist</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Disclaimer</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <p>
              The materials in this demo application are provided on an &apos;as
              is&apos; basis. The LCM Next.js Boilerplate makes no warranties,
              expressed or implied, and hereby disclaims and negates all other
              warranties including without limitation, implied warranties or
              conditions of merchantability, fitness for a particular purpose,
              or non-infringement of intellectual property or other violation of
              rights.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Limitations</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <p>
              In no event shall the LCM Next.js Boilerplate or its suppliers be
              liable for any damages (including, without limitation, damages for
              loss of data or profit, or due to business interruption) arising
              out of the use or inability to use this demo application, even if
              the LCM Next.js Boilerplate or its authorized representative has
              been notified orally or in writing of the possibility of such
              damage.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Accuracy of Materials</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <p>
              The materials appearing in this demo application could include
              technical, typographical, or photographic errors. The LCM Next.js
              Boilerplate does not warrant that any of the materials in this
              demo application are accurate, complete, or current.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Modifications</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <p>
              The LCM Next.js Boilerplate may revise these terms of service for
              its demo application at any time without notice. By using this
              application, you are agreeing to be bound by the then current
              version of these terms of service.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Governing Law</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <p>
              These terms and conditions are governed by and construed in
              accordance with the laws and you irrevocably submit to the
              exclusive jurisdiction of the courts in that state or location.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              If you have any questions about these Terms of Service, please
              contact us through our contact page or email us at
              demo@lcm-nextjs-boilerplate.com
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
