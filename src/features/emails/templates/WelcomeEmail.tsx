import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

interface WelcomeEmailProps {
  name: string;
  loginUrl?: string;
}

export function WelcomeEmail({
  name = "there",
  loginUrl = "http://localhost:3000/login",
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to SaaSStarter — your account is ready!</Preview>
      <Tailwind>
        <Body className="bg-slate-100 font-sans">
          <Container className="mx-auto my-10 max-w-[520px] rounded-xl bg-white p-0 shadow-lg">
            {/* Header Gradient Bar */}
            <Section className="rounded-t-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-10 py-8 text-center">
              <Heading className="m-0 text-2xl font-bold text-white">
                ⚡ SaaSStarter
              </Heading>
              <Text className="m-0 mt-1 text-sm text-blue-100">
                Build. Ship. Scale.
              </Text>
            </Section>

            {/* Main Body */}
            <Section className="px-10 py-8">
              <Heading className="m-0 text-xl font-bold text-slate-900">
                Welcome aboard, {name}! 🎉
              </Heading>
              <Text className="mt-4 text-base leading-relaxed text-slate-600">
                We&apos;re thrilled to have you on board. Your account has been
                created successfully and you&apos;re ready to start building
                something amazing.
              </Text>

              <Text className="mt-2 text-base leading-relaxed text-slate-600">
                Here&apos;s what you can do next:
              </Text>

              {/* Feature List */}
              <Section className="mt-4 rounded-lg bg-slate-50 p-5">
                <Text className="m-0 text-sm text-slate-700">
                  ✅ &nbsp; Set up your profile in <strong>Settings</strong>
                </Text>
                <Text className="m-0 mt-2 text-sm text-slate-700">
                  ✅ &nbsp; Choose a plan that fits your needs
                </Text>
                <Text className="m-0 mt-2 text-sm text-slate-700">
                  ✅ &nbsp; Explore the dashboard and analytics
                </Text>
              </Section>

              {/* CTA Button */}
              <Section className="mt-8 text-center">
                <Button
                  className="rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white no-underline"
                  href={loginUrl}
                >
                  Go to Your Dashboard →
                </Button>
              </Section>

              <Text className="mt-6 text-sm text-slate-500">
                If you didn&apos;t create this account, you can safely ignore
                this email.
              </Text>
            </Section>

            <Hr className="mx-10 border-slate-200" />

            {/* Footer */}
            <Section className="px-10 pb-8 pt-4 text-center">
              <Text className="m-0 text-xs text-slate-400">
                © {new Date().getFullYear()} SaaSStarter. All rights reserved.
              </Text>
              <Text className="m-0 mt-1 text-xs text-slate-400">
                <Link
                  href={loginUrl}
                  className="text-blue-500 underline"
                >
                  Dashboard
                </Link>
                {" · "}
                <Link
                  href="#"
                  className="text-blue-500 underline"
                >
                  Unsubscribe
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default WelcomeEmail;
