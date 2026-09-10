export function siteUrl(): URL {
  const configured = process.env.SITE_URL;
  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  return new URL(configured || (vercelHost ? `https://${vercelHost}` : "http://localhost:3000"));
}
