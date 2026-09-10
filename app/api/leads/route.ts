import { leadSchema } from "@/lib/lead-schema";
import { saveLead } from "@/db/leads";

export const runtime = "nodejs";
export async function POST(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  if (!request.headers.get("content-type")?.includes("application/json"))
    return Response.json({ error: "invalid" }, { status: 415, headers });
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return Response.json({ error: "invalid" }, { status: 403, headers });
  try {
    const raw = await request.text();
    if (raw.length > 4096)
      return Response.json({ error: "invalid" }, { status: 413, headers });
    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      return Response.json({ error: "invalid" }, { status: 400, headers });
    }
    const parsed = leadSchema.safeParse(body);
    if (!parsed.success)
      return Response.json({ error: "invalid" }, { status: 400, headers });
    const d = parsed.data;
    await saveLead(d);
    return Response.json({ success: true }, { status: 201, headers });
  } catch (error) {
    console.error(
      "AGROGO lead storage failed",
      error instanceof Error ? error.message : "unknown",
    );
    return Response.json({ error: "server" }, { status: 503, headers });
  }
}
