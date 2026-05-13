import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

interface VerificationEmailProps {
  name?: string;
  verificationLink?: string;
}

export function VerificationEmail({
  name = "there",
  verificationLink = "http://localhost:3000/verify-email",
}: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your SaaSStarter email address</Preview>
      <Tailwind>
        <Body className="bg-slate-100 font-sans">
          <Container className="mx-auto my-10 max-w-[520px] rounded-xl bg-white p-0 shadow-lg">
            {/* Header Gradient Bar */}
            <Section className="rounded-t-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-10 py-8 text-center">
              <Heading className="m-0 text-2xl font-bold text-white">
                ⚡ SaaSStarter
              </Heading>
              <Text className="m-0 mt-1 text-sm text-blue-100">
                Confirm your identity
              </Text>
            </Section>

            {/* Main Body */}
            <Section className="px-10 py-8">
              <Heading className="m-0 text-xl font-bold text-slate-900">
                Verify Your Email
              </Heading>
              <Text className="mt-4 text-base leading-relaxed text-slate-600">
                Hi {name}, thanks for joining SaaSStarter! Please confirm your
                email address by clicking the button below:
              </Text>

              {/* CTA Button */}
              <Section className="mt-8 text-center">
                <Button
                  className="rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white no-underline"
                  href={verificationLink}
                >
                  Verify Email Address →
                </Button>
              </Section>

              <Text className="mt-6 text-sm text-slate-500">
                If you didn&apos;t sign up for a SaaSStarter account, you can
                safely ignore this email.
              </Text>
            </Section>

            <Hr className="mx-10 border-slate-200" />

            {/* Footer */}
            <Section className="px-10 pb-8 pt-4 text-center">
              <Text className="m-0 text-xs text-slate-400">
                © {new Date().getFullYear()} SaaSStarter. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default VerificationEmail;
