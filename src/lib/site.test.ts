import { describe, expect, it } from "vitest";
import { MAIN_SITE_URL, SITE_URL, mainSiteUrl } from "./site";

describe("site URLs", () => {
  it("serves the minisite from its own origin", () => {
    expect(SITE_URL).toBe("https://ontology.isagog.com");
    expect(MAIN_SITE_URL).toBe("https://isagog.com");
  });

  it("links the main site's locale root", () => {
    expect(mainSiteUrl("it")).toBe("https://isagog.com/it/");
  });

  it("links a main-site page with a trailing slash", () => {
    expect(mainSiteUrl("en", "/approach")).toBe("https://isagog.com/en/approach/");
  });
});
