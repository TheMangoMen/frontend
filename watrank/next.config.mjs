/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    // PostHog calls endpoints with a trailing slash (e.g. /ingest/e/); don't redirect them.
    skipTrailingSlashRedirect: true,
};

export default nextConfig;
