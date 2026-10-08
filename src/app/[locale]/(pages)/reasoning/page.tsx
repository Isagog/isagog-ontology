import { buildPageMetadata } from "@/lib/page-metadata";
import { getScopedI18n, setStaticParamsLocale } from "@/packages/locales/server";
import type { Metadata } from "next";
import { Ragionamento } from "./components/ragionamento";

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
    path: "/reasoning",
    title: t("reasoning.title"),
    description: t("reasoning.description"),
  });
}

const ReasoningPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  return (
    <main>
      <Ragionamento />
    </main>
  );
};

export default ReasoningPage;
