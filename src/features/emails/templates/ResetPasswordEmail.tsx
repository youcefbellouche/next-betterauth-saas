import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

interface ResetPasswordEmailProps {
  name?: string;
  resetLink?: string;
}

export function ResetPasswordEmail({
  name = "there",
  resetLink = "http://localhost:3000/reset-password",
}: ResetPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your SaaSStarter password</Preview>
      <Tailwind>
        <Body className="bg-slate-100 font-sans">
          <Container className="mx-auto my-10 max-w-[520px] rounded-xl bg-white p-0 shadow-lg">
            {/* Header Gradient Bar */}
            <Section className="rounded-t-xl bg-gradient-to-r from-red-600 to-orange-600 px-10 py-8 text-center">
              <Heading className="m-0 text-2xl font-bold text-white">
                ⚡ SaaSStarter
              </Heading>
              <Text className="m-0 mt-1 text-sm text-red-100">
                Security & Account
              </Text>
            </Section>

            {/* Main Body */}
            <Section className="px-10 py-8">
              <Heading className="m-0 text-xl font-bold text-slate-900">
                Password Reset Request
              </Heading>
              <Text className="mt-4 text-base leading-relaxed text-slate-600">
                Hi {name}, we received a request to reset the password for your
                SaaSStarter account. Click the button below to set a new
                password:
              </Text>

              {/* CTA Button */}
              <Section className="mt-8 text-center">
                <Button
                  className="rounded-lg bg-red-600 px-8 py-3 text-sm font-semibold text-white no-underline"
                  href={resetLink}
                >
                  Reset Password →
                </Button>
              </Section>

              <Text className="mt-6 text-sm text-slate-500">
                This link will expire in 1 hour. If you didn&apos;t request a
                password reset, you can safely ignore this email and your
                password will remain unchanged.
              </Text>
            </Section>

            <Hr className="mx-10 border-slate-200" />

            {/* Footer */}
            <Section className="px-10 pb-8 pt-4 text-center">
              <Text className="m-0 text-xs text-slate-400">
                © {new Date().getFullYear()} SaaSStarter. All rights reserved.
              </Text>
              <Text className="m-0 mt-1 text-xs text-slate-400">
                If you have any questions, please reply to this email.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default ResetPasswordEmail;
