import nodemailer from "nodemailer";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env.js";

// Contact form input schema
const contactFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

/**
 * Check if Resend should be used or fall back to SMTP
 */
function shouldUseResend(): boolean {
  const hasResendApiKey = !!env.RESEND_API_KEY;
  const hasEmailFrom = !!env.EMAIL_FROM;
  const isLocalDevelopment =
    env.NODE_ENV === "development" && env.EMAIL_FROM?.includes(".local");

  return hasResendApiKey && hasEmailFrom && !isLocalDevelopment;
}

/**
 * Creates a nodemailer transporter for sending emails.
 * Configured to work with MailHog for development.
 */
const createEmailTransporter = () => {
  return nodemailer.createTransport({
    host: "localhost", // MailHog host
    port: 1025, // MailHog SMTP port
    secure: false, // No SSL for MailHog
    auth: undefined, // No authentication needed for MailHog
  });
};

/**
 * Email router for handling contact form submissions and email service status.
 *
 * This router manages email-related operations including:
 * - Sending contact form emails
 * - Email validation and processing
 * - Email service status checks
 */
export const emailRouter = createTRPCRouter({
  /**
   * Get email service status
   */
  getEmailServiceStatus: publicProcedure.query(() => {
    const useResend = shouldUseResend();
    const hasSmtpServer = !!env.EMAIL_SERVER;
    const isLocalDevelopment =
      env.NODE_ENV === "development" && env.EMAIL_FROM?.includes(".local");

    return {
      service: useResend ? "resend" : "smtp",
      configured: useResend ? !!env.RESEND_API_KEY : hasSmtpServer,
      isLocalDevelopment,
      features: {
        magicLinks: useResend || hasSmtpServer,
      },
      from: env.EMAIL_FROM ?? "Not configured",
      reason: useResend
        ? "Using Resend for production emails"
        : isLocalDevelopment
          ? "Using MailHog for local development"
          : "Email service not properly configured",
    };
  }),

  /**
   * Sends a contact form email.
   *
   * @param input - Contact form data including name, email, phone, and message
   * @returns Success confirmation with timestamp
   *
   * Example usage:
   *   const result = await api.email.sendContactForm.mutate({
   *     firstName: "John",
   *     lastName: "Doe",
   *     email: "john@example.com",
   *     phoneNumber: "(555) 123-4567",
   *     message: "Hello, I'd like to get in touch..."
   *   });
   */
  sendContactForm: publicProcedure
    .input(contactFormSchema)
    .mutation(async ({ input }) => {
      try {
        // Create email transporter
        const transporter = createEmailTransporter();

        // Email content for the business/admin
        const adminEmailHtml = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, system-ui, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden;">
            
            <!-- Header with Logo -->
            <div style="background: #f8fafc; padding: 24px; text-align: center; border-bottom: 1px solid #e5e7eb;">
              <div style="margin-bottom: 12px;">
                <span style="font-size: 24px; font-weight: 700; color: #4ecdc4;">LCM</span>
              </div>
              <h1 style="margin: 0; font-size: 20px; font-weight: 600; color: #2d2d2d;">New Contact Submission</h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 32px;">
              
              <!-- Contact Information -->
              <div style="margin-bottom: 24px;">
                <div style="display: flex; align-items: center; margin-bottom: 16px;">
                  <div style="width: 48px; height: 48px; background: #4ecdc4; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 16px;">
                    <span style="color: white; font-weight: 600; font-size: 18px;">${input.firstName.charAt(0)}${input.lastName.charAt(0)}</span>
                  </div>
                  <div>
                    <h2 style="margin: 0; font-size: 18px; font-weight: 600; color: #2d2d2d;">${input.firstName} ${input.lastName}</h2>
                  </div>
                </div>
                
                <div style="background: #f8fafc; border-radius: 8px; padding: 20px; border-left: 3px solid #4ecdc4;">
                  <div style="margin-bottom: 12px;">
                    <span style="font-size: 14px; font-weight: 500; color: #6b7280;">Email</span>
                    <p style="margin: 4px 0 0 0; color: #2d2d2d;"><a href="mailto:${input.email}" style="color: #20605c; text-decoration: none;">${input.email}</a></p>
                  </div>
                  <div>
                    <span style="font-size: 14px; font-weight: 500; color: #6b7280;">Phone</span>
                    <p style="margin: 4px 0 0 0; color: #2d2d2d;"><a href="tel:${input.phoneNumber}" style="color: #20605c; text-decoration: none;">${input.phoneNumber}</a></p>
                  </div>
                </div>
              </div>
              
              <!-- Message -->
              <div style="margin-bottom: 24px;">
                <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #2d2d2d;">Message</h3>
                <div style="background: #f8fafc; border-radius: 8px; padding: 20px; border: 1px solid #e5e7eb;">
                  <p style="margin: 0; color: #2d2d2d; line-height: 1.6; white-space: pre-wrap;">${input.message}</p>
                </div>
              </div>
              
            </div>
            
            <!-- Footer -->
            <div style="background: #f8fafc; padding: 16px 32px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                Received ${new Date().toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            
          </div>
        `;

        // Send email to admin/business
        await transporter.sendMail({
          from: '"Contact Form" <contact@localhost>',
          to: "admin@lcm-nextjs-boilerplate.com",
          subject: `Contact Form Submission: ${input.firstName} ${input.lastName} <${input.email}>`,
          html: adminEmailHtml,
          text: `
Name: ${input.firstName} ${input.lastName}
Email: ${input.email}
Phone: ${input.phoneNumber}

${input.message}

${new Date().toLocaleString()}
          `.trim(),
        });

        console.log(
          `Contact form email sent successfully for ${input.firstName} ${input.lastName}`,
        );

        return {
          success: true,
          message: "Contact form submitted successfully.",
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        console.error("Error sending contact form emails:", error);
        throw new Error("Failed to send contact form. Please try again later.");
      }
    }),
});
