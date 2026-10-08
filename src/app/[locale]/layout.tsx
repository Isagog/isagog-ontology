import { BodyWrapper } from "@/app/_components/custom/body-wrapper";
import { CloudflareAnalytics } from "@/app/_components/custom/cloudflare-analytics";
import { Footer } from "@/app/_components/custom/footer";
import { Header } from "@/app/_components/custom/header";
import { SITE_URL } from "@/lib/site";
import { I18nProviderClient } from "@/packages/locales/client";
import { getStaticParams } from "@/packages/locales/server";
import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import type { ReactNode } from "react";
import "../globals.css";

export const metadata: Metadata = {
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  // buildPageMetadata's alternates resolve against this.
  metadataBase: new URL(SITE_URL),
  // Title, description, canonical and hreflang alternates are per-page —
  // see src/lib/page-metadata.ts and each route's generateMetadata.
};

export function generateStaticParams() {
  return getStaticParams();
}

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// Resolved once during the static build, so every page's footer bakes in
// the same year. See Footer's `year` prop.
const buildYear = new Date().getFullYear();

export default async function RootLayout({
  children,
  params,
}: Readonly<{ children: ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;

  return (
    <html lang={locale} className={`${inter.variable} ${fraunces.variable} font-sans`}>
      <I18nProviderClient locale={locale}>
        <BodyWrapper className="pt-[72px]">
          <Header />
          {children}
          <Footer year={buildYear} />
          <CloudflareAnalytics />
        </BodyWrapper>
      </I18nProviderClient>
    </html>
  );
}
