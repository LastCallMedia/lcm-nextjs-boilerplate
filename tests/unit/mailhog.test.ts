/** @jest-environment node */

import { decodeMailHogBody } from "../e2e/utils/mailhog";

describe("MailHog email decoding", () => {
  const magicLink =
    "http://localhost:3000/api/auth/callback/nodemailer?token=abc123&email=test%40example.com&callbackUrl=http%3A%2F%2Flocalhost%3A3000%2Fen%2Fdashboard";
  const html = `<a href="${magicLink}">Sign in</a><p>© 2026</p>`;

  it("preserves the full callback URL and UTF-8 text in quoted-printable HTML", () => {
    const body =
      '<a href=3D"http://localhost:3000/api/auth/callback/nodemai=\r\n' +
      "ler?token=3Dabc123&email=3Dtest%40example.com&callbackUrl=3Dhttp%3A%2F%2Flocal=\n" +
      'host%3A3000%2Fen%2Fdashboard">Sign in</a><p>=C2=A9 2026</p>';

    expect(decodeMailHogBody(body, "quoted-printable")).toBe(html);
  });

  it("decodes base64 HTML with wrapped lines", () => {
    const body = Buffer.from(html)
      .toString("base64")
      .replace(/.{76}/g, "$&\r\n");

    expect(decodeMailHogBody(body, "base64")).toBe(html);
  });

  it.each([undefined, "7bit", "8bit"])(
    "preserves unencoded HTML with transfer encoding %s",
    (encoding) => {
      expect(decodeMailHogBody(html, encoding)).toBe(html);
    },
  );

  it("accepts transfer encoding values with mixed case and whitespace", () => {
    expect(
      decodeMailHogBody(Buffer.from(html).toString("base64"), " BASE64 "),
    ).toBe(html);
  });
});
