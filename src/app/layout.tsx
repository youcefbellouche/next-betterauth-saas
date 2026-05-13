import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat, Fira_Code } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { PostHogProvider } from "@/providers/PostHogProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SaaSStarter — Build, Ship, and Scale Faster",
    template: "%s | SaaSStarter",
  },
  description:
    "The most advanced Next.js SaaS template with Better Auth, Stripe, Prisma, and Tailwind CSS. Built for speed and visual excellence.",
  keywords: ["SaaS", "Next.js", "Better Auth", "Stripe", "Prisma", "Tailwind CSS", "Template"],
  authors: [{ name: "SaaSStarter Team" }],
  creator: "SaaSStarter",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://saas-starter.com",
    title: "SaaSStarter — Build, Ship, and Scale Faster",
    description:
      "The most advanced Next.js SaaS template with Better Auth, Stripe, Prisma, and Tailwind CSS.",
    siteName: "SaaSStarter",
  },
  twitter: {
    card: "summary_large_image",
    title: "SaaSStarter — Build, Ship, and Scale Faster",
    description:
      "The most advanced Next.js SaaS template with Better Auth, Stripe, Prisma, and Tailwind CSS.",
    creator: "@saasstarter",
  },
  metadataBase: new URL("https://saas-starter.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${firaCode.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PostHogProvider>
            {children}
          </PostHogProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
