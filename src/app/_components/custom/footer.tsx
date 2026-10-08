"use client";

import { mainSiteUrl } from "@/lib/site";
import { useCurrentLocale, useScopedI18n } from "@/packages/locales/client";

interface FooterProps {
  /**
   * The copyright year, resolved once at build time by the server-rendered
   * layout. Computing it client-side would follow the visitor's clock and
   * mismatch the prerendered HTML once a calendar year turns over.
   */
  year: number;
}

export const Footer = ({ year }: FooterProps) => {
  const t = useScopedI18n("footer");
  const locale = useCurrentLocale();

  return (
    <footer className="border-t border-card-border bg-page">
      <div className="mx-auto flex max-w-[1224px] flex-col gap-4 px-6 py-8 text-[14px] text-prose-muted sm:flex-row sm:items-center sm:justify-between">
        <span>
          {t("copyright", { year: String(year) })} — {t("street")}, {t("zip")}
        </span>
        <div className="flex flex-wrap gap-6">
          <a href={mainSiteUrl(locale)} className="hover:text-forest">
            {t("mainSite")}
          </a>
          <a href="mailto:info@isagog.com" className="hover:text-forest">
            {t("email")}
          </a>
        </div>
      </div>
    </footer>
  );
};
