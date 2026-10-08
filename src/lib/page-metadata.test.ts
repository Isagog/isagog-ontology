import { describe, expect, it } from "vitest";
import { buildPageMetadata } from "./page-metadata";

describe("buildPageMetadata", () => {
  const layers = buildPageMetadata({ locale: "en", path: "/layers", title: "T", description: "D" });

  it("puts the canonical URL on the minisite origin, with a trailing slash", () => {
    expect(layers.alternates?.canonical).toBe("https://ontology.isagog.com/en/layers/");
  });

  it("lists both locales as hreflang alternates", () => {
    expect(layers.alternates?.languages).toEqual({
      it: "https://ontology.isagog.com/it/layers/",
      en: "https://ontology.isagog.com/en/layers/",
    });
  });

  it("uses the tree social image with the locale's alt text", () => {
    expect(layers.openGraph?.images).toEqual([
      expect.objectContaining({
        url: "https://ontology.isagog.com/images/tree.avif",
        alt: "Illustration of a tree, Isagog",
      }),
    ]);
  });

  it("maps the home page to the locale root", () => {
    const home = buildPageMetadata({ locale: "it", path: "", title: "T", description: "D" });
    expect(home.alternates?.canonical).toBe("https://ontology.isagog.com/it/");
  });

  it("never sets a robots restriction", () => {
    expect(layers.robots).toBeUndefined();
  });
});
