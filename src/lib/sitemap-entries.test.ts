import { describe, expect, it } from "vitest";
import { buildSitemapEntries } from "./sitemap-entries";

const lastModified = new Date("2026-10-08T00:00:00Z");
const entries = buildSitemapEntries({
  siteUrl: "https://ontology.isagog.com",
  locales: ["it", "en"],
  paths: [
    { path: "", priority: 1 },
    { path: "/explorer", priority: 0.9 },
  ],
  lastModified,
});

describe("buildSitemapEntries", () => {
  it("fans every path out across every locale", () => {
    expect(entries.map((e) => e.url)).toEqual([
      "https://ontology.isagog.com/it/",
      "https://ontology.isagog.com/it/explorer/",
      "https://ontology.isagog.com/en/",
      "https://ontology.isagog.com/en/explorer/",
    ]);
  });

  it("keeps each path's priority and marks pages as monthly", () => {
    expect(entries[1]).toEqual({
      url: "https://ontology.isagog.com/it/explorer/",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    });
  });
});
