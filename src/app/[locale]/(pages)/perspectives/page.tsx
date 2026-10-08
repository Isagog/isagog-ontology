import { buildPageMetadata } from "@/lib/page-metadata";
import { getScopedI18n, setStaticParamsLocale } from "@/packages/locales/server";
import type { Metadata } from "next";
import { Prospettive } from "./components/prospettive";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setStaticParamsLocale(locale);
  const t = await getScopedI18n("meta");
  return buildPageMetadata({
    locale,
    path: "/perspectives",
    title: t("perspectives.title"),
    description: t("perspectives.description"),
  });
}

const PerspectivesPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  return (
    <main>
      <Prospettive />
    </main>
  );
};

export default PerspectivesPage;
