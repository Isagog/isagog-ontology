import { SectionHeading } from "@/app/_components/custom/section-heading";
import { getScopedI18n } from "@/packages/locales/server";
import { OntologyExplorer } from "./ontology-explorer";

export const Esplora = async () => {
  const t = await getScopedI18n("ontologies.esplora");

  return (
    <section id="esplora" className="scroll-anchor bg-tecnologia px-6 py-20">
      <div className="mx-auto max-w-[1224px]">
        <SectionHeading
          as="h1"
          eyebrow={t("eyebrow")}
          title={
            <>
              {t("titleLine1")}
              <br />
              <em className="not-italic text-sage">{t("titleEm")}</em>
            </>
          }
        />

        <p className="mt-10 mb-10 max-w-[800px] text-[16.5px] leading-[1.6] text-prose-muted">
          {t("intro")}
        </p>

        <OntologyExplorer />
      </div>
    </section>
  );
};
