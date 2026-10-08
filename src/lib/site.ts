import type { Locale } from "./locale-href";

/** This site's origin. No base path: it is never served from a subpath. */
export const SITE_URL = "https://ontology.isagog.com";

/** The marketing site this minisite belongs to. */
export const MAIN_SITE_URL = "https://isagog.com";

/** Absolute URL of a main-site page, e.g. mainSiteUrl("en", "/approach") → ".../en/approach/". */
export function mainSiteUrl(locale: Locale, path = ""): string {
  return `${MAIN_SITE_URL}/${locale}${path}/`;
}
