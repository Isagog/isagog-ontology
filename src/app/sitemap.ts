import { locales } from "@/lib/locale-href";
import { SITE_URL } from "@/lib/site";
import { buildSitemapEntries } from "@/lib/sitemap-entries";
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const PATHS = [
  { path: "", priority: 1 },
  { path: "/perspectives", priority: 0.8 },
  { path: "/layers", priority: 0.8 },
  { path: "/reasoning", priority: 0.8 },
  { path: "/explorer", priority: 0.9 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemapEntries({ siteUrl: SITE_URL, locales, paths: PATHS, lastModified: new Date() });
}
