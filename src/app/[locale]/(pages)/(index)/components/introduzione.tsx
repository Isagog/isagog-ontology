import { SectionHeading } from "@/app/_components/custom/section-heading";
import { getScopedI18n } from "@/packages/locales/server";

export const Introduzione = async () => {
  const t = await getScopedI18n("ontologies.hero");

  return (
    <section id="ontologie" className="scroll-anchor bg-visione px-6 py-20">
      <div className="mx-auto max-w-[1224px]">
        <SectionHeading
          as="h1"
          tone="dark"
          eyebrow={t("eyebrow")}
          title={
            <>
              {t("titleLine1")}
              <br />
              <em className="not-italic text-em-dark">{t("titleEm")}</em>
            </>
          }
          lead={t("lead")}
        />

        <div className="mt-12 grid gap-x-10 border-t border-cream/15 pt-8 text-[16.5px] leading-[1.6] text-cream-soft md:grid-cols-3">
          <p className="mb-5">{t("p1")}</p>
          <p className="mb-5">{t("p2")}</p>
          <p className="mb-5">{t("p3")}</p>
        </div>
      </div>
    </section>
  );
};
