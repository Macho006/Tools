import type { Meta } from "./types";

function pickFirst(...vals: Array<string | null | undefined>) {
  for (const v of vals) {
    const t = (v ?? "").trim();
    if (t) return t;
  }
  return "";
}

export function normalizeUrl(input: string) {
  const t = (input ?? "").trim();
  if (!t) return "";

  // agar /Macho006/... bo‘lsa github.com deb hisoblaymiz (sizning misolingizga mos)
  if (t.startsWith("/")) return `https://github.com${t}`;

  // github.com/... yoki boshqa domen protokolsiz bo‘lsa https:// qo‘shamiz
  if (!/^https?:\/\//i.test(t)) return `https://${t}`;

  return t;
}

export function domainFromUrl(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function toAbsUrl(baseUrl: string, maybeRelative: string) {
  try {
    return new URL(maybeRelative, baseUrl).toString();
  } catch {
    return maybeRelative;
  }
}

export function parseOgFromHtml(html: string, sourceUrl: string): Meta {
  const doc = new DOMParser().parseFromString(html, "text/html");

  const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute("content");
  const ogDesc  = doc.querySelector('meta[property="og:description"]')?.getAttribute("content");
  const ogImg   = doc.querySelector('meta[property="og:image"]')?.getAttribute("content");
  const ogUrl   = doc.querySelector('meta[property="og:url"]')?.getAttribute("content");

  const twTitle = doc.querySelector('meta[name="twitter:title"]')?.getAttribute("content");
  const twDesc  = doc.querySelector('meta[name="twitter:description"]')?.getAttribute("content");
  const twImg   = doc.querySelector('meta[name="twitter:image"]')?.getAttribute("content");

  const titleTag = doc.querySelector("title")?.textContent ?? "";
  const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute("content");

  const finalUrl = pickFirst(ogUrl, sourceUrl);
  const title = pickFirst(ogTitle, twTitle, titleTag);
  const description = pickFirst(ogDesc, twDesc, metaDesc);
  const imageRaw = pickFirst(ogImg, twImg);
  const image = imageRaw ? toAbsUrl(finalUrl, imageRaw) : "";

  return {
    url: finalUrl,
    title,
    description,
    image,
    domain: domainFromUrl(finalUrl),
  };
}

async function fetchText(url: string, signal?: AbortSignal) {
  const res = await fetch(url, { redirect: "follow", signal });
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return await res.text();
}

/**
 * Frontend-only:
 * - direct fetch ko‘p saytda CORS sabab ishlamaydi
 * - shuning uchun proxy (AllOrigins)ni birinchi urinamiz
 */
export async function fetchMetaFrontend(inputUrl: string, signal?: AbortSignal): Promise<Meta> {
  const u = normalizeUrl(inputUrl);
  if (!u) throw new Error("URL bo‘sh");

  // 1) proxy (ko‘proq ishlaydi)
  try {
    const proxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`;
    const html = await fetchText(proxy, signal);
    return parseOgFromHtml(html, u);
  } catch {
    // fallback
  }

  // 2) direct (CORS bo‘lsa)
  const html = await fetchText(u, signal);
  return parseOgFromHtml(html, u);
}
