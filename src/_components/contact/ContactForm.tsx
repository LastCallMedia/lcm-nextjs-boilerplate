"use client";

import { Button } from "~/_components/ui/button";
import { Input } from "~/_components/ui/input";
import { Label } from "~/_components/ui/label";
import { Textarea } from "~/_components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "~/trpc/react";
import { toast } from "sonner";

// Formats a phone number string with basic international support
function formatPhoneNumber(phoneNumberString: string) {
  const cleaned = ("" + phoneNumberString).replace(/\D/g, "");

  // US numbers
  const usRegex = /^(1|)?(\d{3})(\d{3})(\d{4})$/;
  const usMatch = usRegex.exec(cleaned);
  if (usMatch) {
    const intlCode = usMatch[1] ? "+1 " : "";
    return [intlCode, "(", usMatch[2], ") ", usMatch[3], "-", usMatch[4]].join(
      "",
    );
  }

  // International numbers (just add + if it looks like a country code)
  if (cleaned.length > 10) {
    return "+" + cleaned;
  }

  return phoneNumberString; // Return original if no match
}

const contactFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const sendEmailMutation = api.email.sendContactForm.useMutation({
    onSuccess: () => {
      toast.success("Thank you! Your message has been sent successfully.", {
        duration: Infinity, // Toast won't auto-dismiss
      });
      reset();
    },
    onError: (error) => {
      console.error("Error sending contact form:", error);
      toast.error("Sorry, there was an error sending your message.", {
        duration: Infinity,
      });
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    sendEmailMutation.mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="px-6 pt-20 pb-24 sm:pb-32 lg:px-8 lg:py-48"
    >
      <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <div className="mt-2.5">
              <Input
                id="firstName"
                {...register("firstName")}
                placeholder="John"
                aria-invalid={!!errors.firstName}
              />
              {errors.firstName && (
                <p className="text-destructive mt-1 text-sm">
                  {errors.firstName.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <div className="mt-2.5">
              <Input
                id="lastName"
                {...register("lastName")}
                placeholder="Doe"
                aria-invalid={!!errors.lastName}
              />
              {errors.lastName && (
                <p className="text-destructive mt-1 text-sm">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="email">Email *</Label>
            <div className="mt-2.5">
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="johndoe@email.com"
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-destructive mt-1 text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="phoneNumber">Phone Number *</Label>
            <div className="mt-2.5">
              <Input
                id="phoneNumber"
                type="tel"
                {...register("phoneNumber", {
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    const formatted = formatPhoneNumber(e.target.value);
                    if (formatted) {
                      e.target.value = formatted;
                    }
                  },
                })}
                placeholder="(123) 456-7890"
                aria-invalid={!!errors.phoneNumber}
              />
              {errors.phoneNumber && (
                <p className="text-destructive mt-1 text-sm">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="message">Message *</Label>
            <div className="mt-2.5">
              <Textarea
                id="message"
                {...register("message")}
                placeholder="Your message..."
                aria-invalid={!!errors.message}
              />
              {errors.message && (
                <p className="text-destructive mt-1 text-sm">
                  {errors.message.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting || sendEmailMutation.isPending}
          >
            {isSubmitting || sendEmailMutation.isPending
              ? "Sending..."
              : "Send Message"}
          </Button>
        </div>
      </div>
    </form>
  );
}
