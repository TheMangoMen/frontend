import posthog from "posthog-js";

// Public, write-only project key, committed in .env.production and baked in at build time.
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;

// Events go through our own domain (see src/app/ingest) so ad blockers don't drop them.
const INGEST_PATH = "/ingest";

let initialized = false;

export function initAnalytics() {
    if (initialized || !POSTHOG_KEY || typeof window === "undefined") return;
    posthog.init(POSTHOG_KEY, {
        api_host: INGEST_PATH,
        ui_host: "https://us.posthog.com",
        // Pageviews on client-side navigation, page leaves, autocapture, web vitals.
        defaults: "2025-05-24",
        person_profiles: "identified_only",
        session_recording: { maskAllInputs: true },
    });
    initialized = true;
}

export function identify(uid: string, properties: Record<string, unknown>) {
    if (!initialized) return;
    posthog.identify(uid, properties);
}

export function resetIdentity() {
    if (!initialized) return;
    posthog.reset();
}

export function capture(event: string, properties?: Record<string, unknown>) {
    if (!initialized) return;
    posthog.capture(event, properties);
}
