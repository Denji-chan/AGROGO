import { Miniflare } from "miniflare";
import { readFile, readdir } from "node:fs/promises";
import assert from "node:assert/strict";
import path from "node:path";
const root = process.cwd();
const server = path.join(root, "dist/server");
const files = (await readdir(server, { recursive: true })).filter(
  (f) => f.endsWith(".js") && f !== "index.js",
);
const mf = new Miniflare({
  modules: ["index.js", ...files].map((f) => ({
    type: "ESModule",
    path: path.join(server, f),
  })),
  modulesRoot: server,
  modulesRules: [
    { type: "ESModule", include: ["**/*.js", "**/*.mjs"], fallthrough: true },
  ],
  compatibilityDate: "2026-05-15",
  compatibilityFlags: ["nodejs_compat"],
  d1Databases: ["DB"],
  assets: {
    directory: path.join(root, "dist/client"),
    binding: "ASSETS",
    routerConfig: { has_user_worker: true },
  },
  cf: false,
  port: 0,
});
try {
  const db = await mf.getD1Database("DB");
  await db.exec(
    (
      await readFile(path.join(root, "drizzle/0000_flimsy_azazel.sql"), "utf8")
    ).replaceAll("\n", " "),
  );
  for (const [locale, phrase] of [
    ["uz", "Fermerdan"],
    ["ru", "От фермера"],
    ["en", "From farm"],
  ]) {
    const res = await mf.dispatchFetch(`http://agrogo.test/${locale}`);
    const body = await res.text();
    assert.equal(res.status, 200, `${locale} response`);
    assert.ok(body.includes(phrase), `${locale} translated heading`);
    assert.ok(body.includes(`lang="${locale}"`), `${locale} document language`);
    assert.ok(body.includes('id="join"'), `${locale} join form`);
    assert.ok(
      !body.includes("MISSING_MESSAGE") &&
        !body.includes("Your site is taking shape"),
      `${locale} no placeholders`,
    );
    console.log(`PASS /${locale}: SSR content, language, form`);
  }
  for (const [header, expected] of [
    ["ru-RU,uz;q=0.5", "/ru"],
    ["de-DE,en-US;q=0.8", "/en"],
    ["fr-FR", "/uz"],
  ]) {
    const res = await mf.dispatchFetch("http://agrogo.test/", {
      headers: { "Accept-Language": header },
      redirect: "manual",
    });
    assert.ok([307, 308].includes(res.status));
    assert.equal(
      new URL(res.headers.get("location"), "http://agrogo.test").pathname,
      expected,
    );
  }
  const stored = await mf.dispatchFetch("http://agrogo.test/", {
    headers: { "Accept-Language": "en", Cookie: "agrogo_locale=ru" },
    redirect: "manual",
  });
  assert.equal(
    new URL(stored.headers.get("location"), "http://agrogo.test").pathname,
    "/ru",
  );
  console.log("PASS browser language, saved preference, Uzbek fallback");
  const data = {
    id: crypto.randomUUID(),
    name: "AGROGO Integration Check",
    phone: "+998 90 123 45 67",
    region: "nukus",
    service: "storage",
    role: "farmer",
    locale: "uz",
    consent: true,
    website: "",
  };
  const send = (body) =>
    mf.dispatchFetch("http://agrogo.test/api/leads", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: "http://agrogo.test",
      },
      body: JSON.stringify(body),
    });
  for (let i = 0; i < 2; i++) {
    const res = await send(data);
    assert.equal(res.status, 201, await res.text());
  }
  assert.equal(
    (await db.prepare("SELECT COUNT(*) AS n FROM agrogo_leads").first()).n,
    1,
  );
  assert.equal(
    (await db.prepare("SELECT phone FROM agrogo_leads").first()).phone,
    "+998901234567",
  );
  assert.equal(
    (await send({ ...data, id: crypto.randomUUID(), consent: false })).status,
    400,
  );
  assert.equal(
    (await send({ ...data, id: crypto.randomUUID(), phone: "wrong" })).status,
    400,
  );
  assert.equal(
    (await send({ ...data, id: crypto.randomUUID(), website: "spam" })).status,
    400,
  );
  console.log(
    "PASS lead persistence, normalization, consent, invalid data, duplicate prevention",
  );
  for (const asset of [
    "/images/hero-farm.webp",
    "/world-map.svg",
    "/favicon.svg",
    "/robots.txt",
    "/sitemap.xml",
  ]) {
    const res = await mf.dispatchFetch(`http://agrogo.test${asset}`);
    assert.equal(res.status, 200, asset);
    await res.arrayBuffer();
  }
  assert.equal((await mf.dispatchFetch("http://agrogo.test/de")).status, 404);
  console.log("PASS images, SEO routes, invalid-locale 404");
} finally {
  await mf.dispose();
}
