const fs = require("fs");
const path = require("path");

const SITE_URL = "https://reppy.app.br";
const ROOT = path.resolve(__dirname, "..");
const OUTPUT = path.join(ROOT, "public", "sitemap.xml");
const now = new Date();
const TODAY = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
  now.getDate()
).padStart(2, "0")}`;

function loadApiUrl() {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;

  try {
    const env = fs.readFileSync(path.join(ROOT, ".env.local"), "utf8");
    const match = env.match(/^\s*NEXT_PUBLIC_API_URL\s*=\s*(.*)$/m);
    if (match) {
      return match[1].trim().split("#")[0].trim().replace(/^["']|["']$/g, "");
    }
  } catch {}

  return "http://localhost:8080";
}

const API_URL = loadApiUrl().replace(/\/$/, "");

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlEntry({ path: routePath, lastmod = TODAY, changefreq, priority }) {
  const clean = routePath.replace(/^\/+|\/+$/g, "");
  const loc = `${SITE_URL}/${clean}${clean ? "/" : ""}`;
  return [
    "  <url>",
    `    <loc>${escapeXml(loc)}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    "  </url>",
  ].join("\n");
}

async function getJson(endpoint) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
}

async function fetchDynamicRoutes() {
  const events = [];
  const organizers = new Set();

  try {
    const sections = await getJson("/client/home-events");
    if (Array.isArray(sections)) {
      for (const section of sections) {
        for (const event of section?.events ?? []) {
          if (typeof event?.slug === "string" && event.slug) events.push(event.slug);
        }
      }
    }
  } catch (error) {
    console.warn(`[sitemap] events unavailable: ${error.message}`);
    return { events: [], organizers: [] };
  }

  const uniqueEvents = [...new Set(events)];
  for (let index = 0; index < uniqueEvents.length; index += 5) {
    const batch = uniqueEvents.slice(index, index + 5);
    const details = await Promise.all(
      batch.map((slug) =>
        getJson(`/client/events/${encodeURIComponent(slug)}`).catch(() => null)
      )
    );

    for (const detail of details) {
      const slug = detail?.event?.organizer?.slug;
      if (typeof slug === "string" && slug) organizers.add(slug);
    }
  }

  return { events: uniqueEvents, organizers: [...organizers] };
}

async function main() {
  const { events, organizers } = await fetchDynamicRoutes();

  const entries = [
    urlEntry({ path: "/", changefreq: "weekly", priority: "1.0" }),
    urlEntry({ path: "/eventos", changefreq: "monthly", priority: "0.9" }),
    urlEntry({ path: "/taxas", changefreq: "monthly", priority: "0.9" }),
    ...events.map((slug) =>
      urlEntry({ path: `/${slug}`, changefreq: "monthly", priority: "0.6" })
    ),
    ...organizers.map((slug) =>
      urlEntry({
        path: `/organizador/${slug}`,
        changefreq: "monthly",
        priority: "0.6",
      })
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`;

  fs.writeFileSync(OUTPUT, xml, "utf8");
  console.log(
    `[sitemap] ${entries.length} URLs written (${events.length} eventos, ${organizers.length} organizadores)`
  );
}

main().catch((error) => {
  console.error("[sitemap] falha ao gerar:", error);
  process.exit(1);
});
