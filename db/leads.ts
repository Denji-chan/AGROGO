import type { z } from "zod";
import type { leadSchema } from "../lib/lead-schema";

// Server-only credentials: configure these in Vercel, never in client code.
export async function saveLead(lead: z.infer<typeof leadSchema>) {
  const account = process.env.CLOUDFLARE_ACCOUNT_ID;
  const database = process.env.CLOUDFLARE_D1_DATABASE_ID;
  const token = process.env.CLOUDFLARE_API_TOKEN;
  if (!account || !database || !token) {
    throw new Error("Lead storage is not configured");
  }
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(account)}/d1/database/${encodeURIComponent(database)}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
      body: JSON.stringify({
        sql: "INSERT INTO agrogo_leads (id,name,phone,region,service,role,locale,consent,created_at) VALUES (?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO NOTHING",
        params: [
          lead.id, lead.name, lead.phone, lead.region, lead.service,
          lead.role, lead.locale, "1", new Date().toISOString(),
        ],
      }),
    },
  );
  if (!response.ok) throw new Error(`Lead storage HTTP ${response.status}`);
  const data = await response.json() as {
    success?: boolean;
    result?: { success?: boolean }[];
  };
  if (data.success !== true || !Array.isArray(data.result) ||
      data.result.length !== 1 || data.result[0].success !== true) {
    throw new Error("Lead storage query failed");
  }
}
