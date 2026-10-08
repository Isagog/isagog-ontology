import type { Metadata } from "next";
import en from "../packages/locales/lang/en";
import itLocale from "../packages/locales/lang/it";
import { locales } from "./locale-href";
import { SITE_URL } from "./site";

const SITE_NAME = "Isagog";
const SOCIAL_IMAGE_PATH = "/images/tree.avif";
const SOCIAL_IMAGE_ALT: Readonly<Record<string, string>> = {
  it: itLocale.meta.socialImageAlt,
  en: en.meta.socialImageAlt,
};

interface BuildPageMetadataArgs {
  locale: string;
  /** Root-relative, locale-agnostic path: "" for home, "/layers" etc. */
  path: string;
  title: string;
  description: string;
}

/** Per-page metadata: canonical, hreflang alternates and Open Graph/Twitter identity. */
export function buildPageMetadata({
  locale,
  path,
  title,
  description,
}: BuildPageMetadataArgs): Metadata {
  const canonical = `${SITE_URL}/${locale}${path}/`;
  const languages = Object.fromEntries(locales.map((loc) => [loc, `${SITE_URL}/${loc}${path}/`]));
  const imageUrl = `${SITE_URL}${SOCIAL_IMAGE_PATH}`;

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: SOCIAL_IMAGE_ALT[locale] ?? SOCIAL_IMAGE_ALT.it }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical,
      languages,
    },
  };
}
