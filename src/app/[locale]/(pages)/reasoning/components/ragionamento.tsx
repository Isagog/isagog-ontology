import { SectionHeading } from "@/app/_components/custom/section-heading";
import { getScopedI18n } from "@/packages/locales/server";
import { Network, Sparkles } from "lucide-react";

export const Ragionamento = async () => {
  const t = await getScopedI18n("ontologies.ragionamento");

  const readers = [
    { key: "llm", Icon: Sparkles, title: t("llm.title"), p1: t("llm.p1"), p2: t("llm.p2") },
    { key: "kg", Icon: Network, title: t("kg.title"), p1: t("kg.p1"), p2: t("kg.p2") },
  ];

  return (
    <section id="ragionamento" className="scroll-anchor bg-page px-6 py-20">
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

        <div className="mt-10 grid gap-10 md:grid-cols-2">
          {readers.map(({ key, Icon, title, p1, p2 }) => (
            <article key={key} className="border-t border-divider pt-6">
              <h3 className="mb-4 flex items-center gap-3 font-serif text-[24px] text-forest">
                <Icon className="text-terracotta" size={22} strokeWidth={1.75} aria-hidden />
                {title}
              </h3>
              <p className="mb-5 text-[16px] leading-[1.6] text-prose-muted">{p1}</p>
              <p className="text-[16px] leading-[1.6] text-prose-muted">{p2}</p>
            </article>
          ))}
        </div>

        <p className="mt-12 max-w-[800px] font-serif text-[20px] italic leading-[1.5] text-forest">
          {t("closing")}
        </p>
      </div>
    </section>
  );
};
