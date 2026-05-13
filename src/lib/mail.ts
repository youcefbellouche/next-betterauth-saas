"use server";

import { Resend } from "resend";
import { WelcomeEmail } from "@/features/emails/templates/WelcomeEmail";
import { ResetPasswordEmail } from "@/features/emails/templates/ResetPasswordEmail";
import { VerificationEmail } from "@/features/emails/templates/VerificationEmail";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM_EMAIL = process.env.FROM_EMAIL || "SaaSStarter <onboarding@resend.dev>";
const APP_URL = process.env.BETTER_AUTH_URL || "http://localhost:3000";

/**
 * Send a Welcome email to a newly registered user.
 */
export async function sendWelcomeEmail({ to, name }: { to: string; name: string }) {
  if (!resend) {
    console.log("-----------------------------------------");
    console.log(`[MAIL] WELCOME EMAIL (DEVELOPMENT MODE)`);
    console.log(`To: ${to}`);
    console.log(`Name: ${name}`);
    console.log(`Login URL: ${APP_URL}/login`);
    console.log("-----------------------------------------");
    return { success: true, data: { id: "mock_id" } };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: "Welcome to SaaSStarter — Let's get started! 🚀",
      react: WelcomeEmail({ name, loginUrl: `${APP_URL}/login` }),
    });

    if (error) {
      console.error("[MAIL] Error sending welcome email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("[MAIL] Exception sending welcome email:", error);
    return { success: false, error };
  }
}

/**
 * Send a Password Reset email.
 */
export async function sendPasswordResetEmail({ 
  to, 
  url,
  user 
}: { 
  to: string; 
  url: string;
  user: { name: string } 
}) {
  if (!resend) {
    console.log("-----------------------------------------");
    console.log(`[MAIL] PASSWORD RESET (DEVELOPMENT MODE)`);
    console.log(`To: ${to}`);
    console.log(`User: ${user.name}`);
    console.log(`Reset URL: ${url}`);
    console.log("-----------------------------------------");
    return { success: true, data: { id: "mock_id" } };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: "Reset your SaaSStarter password",
      react: ResetPasswordEmail({ 
        name: user.name, 
        resetLink: url 
      }),
    });

    if (error) {
      console.error("[MAIL] Error sending reset email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("[MAIL] Exception sending reset email:", error);
    return { success: false, error };
  }
}

/**
 * Send a Verification email.
 */
export async function sendVerificationEmail({ 
  to, 
  url,
  user 
}: { 
  to: string; 
  url: string;
  user: { name: string } 
}) {
  if (!resend) {
    console.log("-----------------------------------------");
    console.log(`[MAIL] EMAIL VERIFICATION (DEVELOPMENT MODE)`);
    console.log(`To: ${to}`);
    console.log(`User: ${user.name}`);
    console.log(`Verification URL: ${url}`);
    console.log("-----------------------------------------");
    return { success: true, data: { id: "mock_id" } };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: "Verify your SaaSStarter email address",
      react: VerificationEmail({ 
        name: user.name, 
        verificationLink: url 
      }),
    });

    if (error) {
      console.error("[MAIL] Error sending verification email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("[MAIL] Exception sending verification email:", error);
    return { success: false, error };
  }
}
