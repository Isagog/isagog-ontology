"use client";

import { localeHref } from "@/lib/locale-href";
import { useCurrentLocale } from "@/packages/locales/client";
import Link from "next/link";
import type { ComponentProps } from "react";

/**
 * Drop-in replacement for next/link that prefixes internal hrefs with the
 * current locale ("/platform" -> "/it/platform"). Required because the static
 * export uses real /it and /en URL segments instead of middleware rewrites.
 * In-page anchors ("#contatto") and external hrefs pass through untouched.
 */
export const LocaleLink = ({ href, ...props }: ComponentProps<typeof Link>) => {
  const locale = useCurrentLocale();
  const resolved = typeof href === "string" ? localeHref(locale, href) : href;
  return <Link href={resolved} {...props} />;
};
