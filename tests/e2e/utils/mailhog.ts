/** Decode the SMTP transfer encoding preserved in MailHog's API response. */
export function decodeMailHogBody(
  body: string,
  transferEncoding?: string,
): string {
  switch (transferEncoding?.trim().toLowerCase()) {
    case "base64":
      return Buffer.from(body, "base64").toString("utf8");
    case "quoted-printable": {
      const bytes = body
        .replace(/=\r?\n/g, "")
        .replace(/=([\da-f]{2})/gi, (_, hex: string) =>
          String.fromCharCode(parseInt(hex, 16)),
        );
      return Buffer.from(bytes, "latin1").toString("utf8");
    }
    default:
      return body;
  }
}
