import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync("src/app/globals.css", "utf-8");

const TOKENS: ReadonlyArray<readonly [string, string]> = [
  ["--color-page", "#f7f8f2"],
  ["--color-paper", "#fafbf7"],
  ["--color-forest", "#173c31"],
  ["--color-forest-deep", "#1a4939"],
  ["--color-sage", "#5c7147"],
  ["--color-em-dark", "#c0d78c"],
  ["--color-olive", "#668f3e"],
  ["--color-terracotta", "#b84623"],
  ["--color-cream", "#f1f5e7"],
  ["--color-cream-soft", "#d1ddca"],
  ["--color-visione", "#183d30"],
  ["--color-tecnologia", "#e8eedf"],
  ["--color-persone", "#f0f3e9"],
  ["--color-card-border", "#d7dfd0"],
  ["--color-divider", "#adbd9e"],
  ["--color-num", "#646e5a"],
  ["--color-result", "#506943"],
  ["--color-prose-muted", "#5d6c55"],
  ["--color-muted-ink", "#536157"],
];

describe("globals.css design tokens", () => {
  it.each(TOKENS)("defines %s as %s", (token, value) => {
    expect(css).toMatch(new RegExp(`${token}\\s*:\\s*${value}\\s*;`, "i"));
  });

  it("exposes every token to Tailwind through @theme inline", () => {
    const theme = css.slice(css.indexOf("@theme inline"), css.indexOf("}", css.indexOf("@theme inline")));
    for (const [token] of TOKENS) {
      expect(theme).toContain(token);
    }
  });
});
