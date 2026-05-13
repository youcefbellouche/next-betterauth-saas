# 🚀 Ultimate Next.js 16 SaaS Starter

The definitive, production-ready foundation for your next big idea. Engineered for **Performance**, **Security**, and **Developer Velocity**. This isn't just a boilerplate; it's a battle-hardened architecture built on the bleeding edge of the Next.js ecosystem.

---

## 🛠 Tech Stack & Architecture

This template leverages the latest features of **Next.js 16.2.6**, optimized for the **Cache Components** paradigm.

- **Framework**: [Next.js 16.2.6](https://nextjs.org/) (App Router, Turbopack)
- **Caching**: [Partial Prerendering (PPR)](https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering) & Dynamic-by-Default architecture.
- **Authentication**: [Better Auth](https://www.better-auth.com/) (Plugins: Admin, Stripe, Impersonation).
- **Database**: [Prisma ORM](https://www.prisma.io/) with **PostgreSQL**.
- **Payments**: [Stripe](https://stripe.com/) (Subscription Management & Webhooks).
- **Styling**: **Tailwind CSS v4** (Modern CSS-first approach) & [shadcn/ui](https://ui.shadcn.com/).
- **Analytics**: [PostHog](https://posthog.com/) (Auto-capture & Session Replays).
- **Email**: [Resend](https://resend.com/) (Transactional emails via React Email).

---

## ✨ Key Features

- **🛡️ Superadmin Mode **: A comprehensive dashboard for user management, maintenance mode toggling, and impersonation.
- **⚡ Partial Prerendering**: Instant shell delivery with streamed dynamic content for sub-second perceived performance.
- **📋 URL-Driven Data Tables**: Robust filtering, sorting, and pagination powered by `searchParams` for shareable UI states.
- **🎨 Modern Theming**: Dark/Light mode support with harmonious **OKLCH** color palettes.
- **⏳ Waitlist Mode**: Toggle between open registration and a conversion-optimized waitlist flow.
- **🔐 Edge RBAC**: Centralized session protection via high-performance Edge Middleware.

---

## 🚀 Getting Started

Follow these steps to go from zero to a fully functional SaaS in minutes.

### 1. Clone & Install
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory and populate it with the following:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# Authentication
BETTER_AUTH_SECRET="your-generated-secret"
BETTER_AUTH_URL="http://localhost:3000"
ADMIN_SETUP_SECRET="your-super-secret-setup-key"

# Payments (Stripe)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Emails (Optional)
RESEND_API_KEY="re_..."

# Analytics (Optional)
NEXT_PUBLIC_POSTHOG_KEY="phc_..."
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"
```

### 3. Database Migration
Initialize your database schema:
```bash
npx prisma db push
```

### 4. Stripe Webhook Tunneling
To handle payments locally, use the Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/auth/stripe/webhook
```

### 5. Day Zero: Admin Setup
1. Start the development server: `npm run dev`
2. Navigate to `/admin/setup`
3. Enter your `ADMIN_SETUP_SECRET` to initialize the first Superadmin account.

---

## 📧 Optional Integrations

### Resend (Emails)
Set your `RESEND_API_KEY` to enable transactional emails for password resets and email verification. The system uses a dedicated queue for high reliability.

### PostHog (Analytics)
Set the PostHog environment variables to gain deep insights into user behavior, including session recordings and heatmaps, out of the box.

---

## ☕ Support

If this template helps you ship faster, consider supporting the project:

[![Buy Me A Coffee](https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png)](https://buymeacoffee.com/youcefbellouche)
