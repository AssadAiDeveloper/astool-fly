import type { MetadataRoute } from "next";
import { SITE_URL } from "../lib/config";
import { LANGS, PAGES, pathFor } from "../lib/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const abs = (p: string) => `${SITE_URL}${p}`;
  const now = new Date();
  return PAGES.flatMap((p) =>
    LANGS.map((l) => ({
      url: abs(pathFor(l, p.path)),
      lastModified: now,
      changeFrequency: p.key === "home" ? ("weekly" as const) : ("monthly" as const),
      priority: p.key === "home" ? 1 : p.key === "request" ? 0.8 : 0.7,
      alternates: { languages: Object.fromEntries([...LANGS.map((x) => [x, abs(pathFor(x, p.path))]), ["x-default", abs(pathFor("ar", p.path))]]) },
    }))
  );
}
