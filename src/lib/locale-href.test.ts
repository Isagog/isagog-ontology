import { describe, expect, it } from "vitest";
import { localeHref, stripLocale } from "./locale-href";

describe("localeHref", () => {
  it("prefixes an internal path with the locale", () => {
    expect(localeHref("it", "/platform")).toBe("/it/platform");
  });

  it("maps the root path to the locale root", () => {
    expect(localeHref("en", "/")).toBe("/en");
  });

  it("leaves external and non-path hrefs untouched", () => {
    expect(localeHref("it", "mailto:info@isagog.com")).toBe("mailto:info@isagog.com");
    expect(localeHref("it", "https://example.com")).toBe("https://example.com");
    expect(localeHref("it", "#contatto")).toBe("#contatto");
  });
});

describe("stripLocale", () => {
  it("removes a leading locale segment", () => {
    expect(stripLocale("/it/platform")).toBe("/platform");
    expect(stripLocale("/en/blog/article-1")).toBe("/blog/article-1");
  });

  it("returns the root for a bare locale segment", () => {
    expect(stripLocale("/it")).toBe("/");
    expect(stripLocale("/en/")).toBe("/");
  });

  it("leaves a pathname without a locale prefix unchanged", () => {
    expect(stripLocale("/platform")).toBe("/platform");
  });
});
