import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface MagicLinkEmailProps {
  url: string;
  host: string;
  appName?: string;
}

/**
 * Magic link email template for passwordless authentication
 */
export function MagicLinkEmail({
  url,
  host,
  appName = "LCM Boilerplate",
}: MagicLinkEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Sign in to {appName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>LAST CALL MEDIA</Text>
          </Section>

          <Heading style={h1}>Sign in to {appName}</Heading>

          <Text style={text}>
            Click the button below to securely sign in to your {appName}{" "}
            account. This magic link will take you directly to your dashboard.
          </Text>

          <Section style={buttonContainer}>
            <a href={url} style={button}>
              Sign in to {appName}
            </a>
          </Section>

          <Text style={text}>
            This link will expire in <strong>24 hours</strong> and can only be
            used once for security purposes.
          </Text>

          <Text style={text}>
            If you didn&apos;t request this sign-in link, you can safely ignore
            this email. Your account remains secure.
          </Text>

          <Text style={smallText}>
            <strong>Having trouble with the button?</strong>
            <br />
            You can also{" "}
            <a
              href={url}
              style={{ color: "#10b981", textDecoration: "underline" }}
            >
              click here to sign in
            </a>{" "}
            or copy this link to your browser:
            <br />
            <span
              style={{
                fontSize: "12px",
                color: "#9ca3af",
                wordBreak: "break-all",
                fontFamily: "monospace",
                backgroundColor: "#f3f4f6",
                padding: "4px 8px",
                borderRadius: "4px",
                display: "inline-block",
                marginTop: "8px",
              }}
            >
              {url}
            </span>
          </Text>

          <Text style={footer}>
            This email was sent from {host}
            <br />© {new Date().getFullYear()} Last Call Media. All rights
            reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles - Updated to match Last Call Media brand
const main = {
  backgroundColor: "#f8fafc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  padding: "40px 0",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "48px 40px",
  marginBottom: "64px",
  maxWidth: "600px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
};

const header = {
  textAlign: "center" as const,
  marginBottom: "32px",
  paddingBottom: "24px",
  borderBottom: "2px solid #10b981",
};

const logo = {
  color: "#10b981",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0",
  letterSpacing: "-0.025em",
};

const h1 = {
  color: "#1f2937",
  fontSize: "28px",
  fontWeight: "600",
  margin: "32px 0 24px 0",
  padding: "0",
  textAlign: "center" as const,
  lineHeight: "1.25",
};

const text = {
  color: "#4b5563",
  fontSize: "16px",
  lineHeight: "1.6",
  textAlign: "left" as const,
  margin: "16px 0",
};

const smallText = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "1.5",
  textAlign: "left" as const,
  margin: "24px 0 16px 0",
  padding: "16px",
  backgroundColor: "#f9fafb",
  borderRadius: "6px",
  border: "1px solid #e5e7eb",
};

const footer = {
  color: "#9ca3af",
  fontSize: "12px",
  lineHeight: "1.4",
  textAlign: "center" as const,
  marginTop: "40px",
  paddingTop: "24px",
  borderTop: "1px solid #e5e7eb",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#10b981",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "16px 32px",
  boxShadow: "0 4px 6px -1px rgba(16, 185, 129, 0.3)",
  transition: "all 0.2s ease",
};
