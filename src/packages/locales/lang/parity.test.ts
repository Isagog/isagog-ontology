import { describe, expect, it } from "vitest";
import en from "./en";
import itLocale from "./it";

/**
 * it.ts and en.ts must stay structurally identical: every component reads
 * its copy from a shared key path, so a key missing in one locale throws or
 * falls back silently. Compares key sequences (order included), and the
 * {param} placeholders of every string, since a placeholder missing in one
 * language renders as literal text there.
 */
const collectKeyPaths = (value: unknown, prefix = ""): string[] => {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return [];
  }

  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    const isLeaf = child === null || typeof child !== "object" || Array.isArray(child);
    return isLeaf ? [path] : [path, ...collectKeyPaths(child, path)];
  });
};

const collectStrings = (value: unknown, prefix = ""): Array<[string, string]> => {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return [];
  }

  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof child === "string" ? [[path, child] as [string, string]] : collectStrings(child, path);
  });
};

const placeholdersOf = (text: string): string[] =>
  [...text.matchAll(/\{(\w+)\}/g)].map((match) => match[1] ?? "").sort();

describe("locale file parity (it.ts / en.ts)", () => {
  it("declares the same key sequence in both locale files", () => {
    expect(collectKeyPaths(en)).toEqual(collectKeyPaths(itLocale));
  });

  it("uses the same {placeholders} for every key in both languages", () => {
    const enStrings = new Map(collectStrings(en));

    for (const [path, itValue] of collectStrings(itLocale)) {
      expect(placeholdersOf(enStrings.get(path) ?? ""), path).toEqual(placeholdersOf(itValue));
    }
  });
});
