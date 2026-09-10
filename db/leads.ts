import { env } from "cloudflare:workers";
export function leadsDatabase() {
  if (!env.DB) throw new Error("Lead storage unavailable");
  return env.DB;
}
