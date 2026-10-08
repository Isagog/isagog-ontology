export const locales = ["it", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "it";

const localePattern = new RegExp(`^/(${locales.join("|")})(/.*)?$`);

/**
 * Prefix an internal absolute path with the active locale.
 * External links (http, mailto, #, etc.) are returned unchanged.
 */
export function localeHref(locale: string, href: string): string {
  if (!href.startsWith("/")) return href;
  if (href === "/") return `/${locale}`;
  return `/${locale}${href}`;
}

/**
 * Remove a leading /it or /en segment from a pathname so locale-agnostic
 * route checks (active nav state) keep working after static export.
 */
export function stripLocale(pathname: string): string {
  const match = pathname.match(localePattern);
  if (!match) return pathname;
  const rest = match[2];
  if (rest === undefined || rest === "/") return "/";
  return rest;
}
