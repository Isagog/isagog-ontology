import { SectionHeading } from "@/app/_components/custom/section-heading";
import { getScopedI18n } from "@/packages/locales/server";

export const Prospettive = async () => {
  const t = await getScopedI18n("ontologies.prospettive");

  const examples = [
    { number: "01", title: t("ex1.title"), body: t("ex1.body") },
    { number: "02", title: t("ex2.title"), body: t("ex2.body") },
    { number: "03", title: t("ex3.title"), body: t("ex3.body") },
    { number: "04", title: t("ex4.title"), body: t("ex4.body") },
  ];

  return (
    <section id="prospettive" className="scroll-anchor bg-page px-6 py-20">
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

        <p className="mt-10 max-w-[800px] text-[16.5px] leading-[1.6] text-prose-muted">
          {t("intro")}
        </p>

        <ol className="mt-8 grid list-none gap-8 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {examples.map((example) => (
            <li key={example.number} className="border-t border-divider pt-6">
              <span className="font-serif text-[12px] text-num">{example.number}</span>
              <h3 className="mt-2 mb-3 font-serif text-[21px] leading-[1.25] text-forest">
                {example.title}
              </h3>
              <p className="text-[15px] leading-[1.55] text-prose-muted">{example.body}</p>
            </li>
          ))}
        </ol>

        <p className="mt-12 max-w-[800px] font-serif text-[20px] italic leading-[1.5] text-forest">
          {t("closing")}
        </p>
      </div>
    </section>
  );
};
