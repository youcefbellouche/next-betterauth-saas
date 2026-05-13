import posthog from "posthog-js";

/**
 * PostHog Initialization
 * Initializes the PostHog client on the browser side.
 */
if (typeof window !== "undefined") {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com";

  if (key) {
    posthog.init(key, {
      api_host: host,
      person_profiles: "identified_only",
      capture_pageview: false, // Pageviews are handled manually in the provider for App Router
    });
  }
}

export { posthog };
