import nodemailer from "nodemailer";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// Contact form input schema
const contactFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

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
 * Email router for handling contact form submissions.
 *
 * This router manages email-related operations including:
 * - Sending contact form emails
 * - Email validation and processing
 */
export const emailRouter = createTRPCRouter({
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
    .mutation(async ({ input, ctx }) => {
      try {
        // Create email transporter
        const transporter = createEmailTransporter();

        // Email content for the business/admin
        const adminEmailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
              New Contact Form Submission
            </h2>
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-top: 0;">Contact Information</h3>
              <p><strong>Name:</strong> ${input.firstName} ${input.lastName}</p>
              <p><strong>Email:</strong> <a href="mailto:${input.email}">${input.email}</a></p>
              <p><strong>Phone:</strong> <a href="tel:${input.phoneNumber}">${input.phoneNumber}</a></p>
            </div>
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-top: 0;">Message</h3>
              <p style="white-space: pre-wrap; line-height: 1.6;">${input.message}</p>
            </div>
            <div style="margin-top: 30px; padding: 15px; background-color: #eff6ff; border-left: 4px solid #3b82f6;">
              <p style="margin: 0; font-size: 14px; color: #6b7280;">
                <strong>Submitted:</strong> ${new Date().toLocaleString()}<br>
                <strong>User Agent:</strong> ${ctx.headers.get("user-agent") ?? "Unknown"}
              </p>
            </div>
          </div>
        `;

        // Send email to admin/business
        await transporter.sendMail({
          from: '"Contact Form" <noreply@lcm-nextjs-boilerplate.com>',
          to: "admin@lcm-nextjs-boilerplate.com", // Change this to your actual business email
          subject: `New Contact Form Submission from ${input.firstName} ${input.lastName}`,
          html: adminEmailHtml,
          text: `
New Contact Form Submission

Name: ${input.firstName} ${input.lastName}
Email: ${input.email}
Phone: ${input.phoneNumber}

Message:
${input.message}

Submitted: ${new Date().toLocaleString()}
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
