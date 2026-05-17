import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SITE_URL = "https://prepperspanama.github.io/blog";
const SITE_NAME = "Preppers Panamá";
const SITE_DESCRIPTION = "Blog sobre preparacionismo, mochilas de emergencia, primeros auxilios y tecnologías de comunicación para situaciones de crisis en Panamá.";

const posts = [
  {
    slug: "microclimas-y-riesgos-en-panama",
    title: "Microclimas y Riesgos en Panamá: Por qué el Istmo es Propenso a Desastres",
    date: new Date("2026-05-12"),
    excerpt: "Panamá es un laboratorio climático de 75,517 km². Analizamos sus 8 microclimas, la matriz de riesgos por provincia y por qué el Istmo ya no es una zona libre de desastres.",
    category: "Geografía",
  },
  {
    slug: "que-es-ser-prepper",
    title: "¿Qué es ser Prepper? Más allá de los mitos del fin del mundo",
    date: new Date("2026-05-11"),
    excerpt: "El preparacionismo no es paranoia, es responsabilidad. Analizamos la filosofía prepper y por qué es vital en el siglo XXI.",
    category: "Táctica",
  },
];

function escapeXml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const items = posts
  .map(
    (p) => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${SITE_URL}/blog/${p.slug}/</link>
      <guid>${SITE_URL}/blog/${p.slug}/</guid>
      <description>${escapeXml(p.excerpt)}</description>
      <category>${escapeXml(p.category)}</category>
      <pubDate>${p.date.toUTCString()}</pubDate>
    </item>`
  )
  .join("\n");

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}/</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>es-pa</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

const outDir = resolve(__dirname, "..", "out");
writeFileSync(resolve(outDir, "rss.xml"), rss, "utf-8");
console.log("✓ RSS feed generated at out/rss.xml");
