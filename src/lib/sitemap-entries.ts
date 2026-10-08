/** Pure sitemap builder, kept out of src/app/sitemap.ts so it can be unit tested. */

export interface SitemapPathConfig {
  /** Locale-agnostic path: "" for home, "/layers" etc. */
  path: string;
  priority: number;
}

export interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: "monthly";
  priority: number;
}

export interface BuildSitemapEntriesOptions {
  siteUrl: string;
  locales: readonly string[];
  paths: readonly SitemapPathConfig[];
  lastModified: Date;
}

export function buildSitemapEntries({
  siteUrl,
  locales,
  paths,
  lastModified,
}: BuildSitemapEntriesOptions): SitemapEntry[] {
  return locales.flatMap((locale) =>
    paths.map(({ path, priority }) => ({
      url: `${siteUrl}/${locale}${path}/`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority,
    }))
  );
}
