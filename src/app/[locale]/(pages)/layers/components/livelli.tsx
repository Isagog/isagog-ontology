import { SectionHeading } from "@/app/_components/custom/section-heading";
import type { Locale } from "@/lib/locale-href";
import { ontologyVersions } from "@/lib/ontology-explorer/data";
import { mainSiteUrl } from "@/lib/site";
import { getScopedI18n } from "@/packages/locales/server";

export const Livelli = async ({ locale }: { locale: Locale }) => {
  const t = await getScopedI18n("ontologies.livelli");

  const layers = [
    { id: "top", name: t("top.name"), tagline: t("top.tagline"), body: t("top.body") },
    { id: "agents", name: t("agents.name"), tagline: t("agents.tagline"), body: t("agents.body") },
    { id: "frame", name: t("frames.name"), tagline: t("frames.tagline"), body: t("frames.body") },
  ] as const;

  return (
    <section id="livelli" className="scroll-anchor bg-tecnologia px-6 py-20">
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

        <div className="my-9 grid gap-8 md:grid-cols-3">
          {layers.map((layer) => (
            <article key={layer.id} id={layer.id} className="scroll-anchor border-t border-divider pt-6">
              <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-sage">
                {t("versionLabel")} {ontologyVersions[layer.id]}
              </span>
              <h2 className="mt-2 mb-2 font-serif text-[24px] text-forest">{layer.name}</h2>
              <p className="mb-3 text-[16px] font-semibold leading-[1.45] text-terracotta">
                {layer.tagline}
              </p>
              <p className="text-[15.5px] leading-[1.6] text-prose-muted">{layer.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-16 grid gap-10 border-t border-divider pt-8 md:grid-cols-2">
          <div>
            <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-sage">
              {t("cliente.eyebrow")}
            </span>
            <h2 className="mt-4 font-serif text-[clamp(24px,2.6vw,31px)] leading-[1.2] text-forest">
              {t("cliente.titleLine1")}
              <br />
              <em className="not-italic text-sage">{t("cliente.titleEm")}</em>
            </h2>
          </div>
          <div className="text-[16px] leading-[1.6] text-prose-muted">
            <p className="mb-5">{t("cliente.p1")}</p>
            <p className="mb-5">{t("cliente.p2")}</p>
            <p className="mb-6">{t("cliente.p3")}</p>
            <a
              href={mainSiteUrl(locale, "/approach")}
              className="inline-block rounded-[5px] border border-forest/25 px-5 py-3 text-[15px] text-forest transition-colors hover:border-forest"
            >
              {t("cliente.cta")} →
            </a>
          </div>
        </div>

        <p className="mt-12 border-t border-divider pt-6 text-[14px] text-forest">{t("license")}</p>
      </div>
    </section>
  );
};
