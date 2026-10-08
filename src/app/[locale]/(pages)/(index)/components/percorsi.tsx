import { LocaleLink as Link } from "@/app/_components/custom/locale-link";
import { getScopedI18n } from "@/packages/locales/server";
import { ArrowRight } from "lucide-react";

const PAGES = ["perspectives", "layers", "reasoning", "explorer"] as const;

/** Entry cards to the four pages of the minisite. */
export const Percorsi = async () => {
  const t = await getScopedI18n("home.percorsi");

  return (
    <section id="percorsi" className="scroll-anchor bg-page px-6 py-20">
      <div className="mx-auto max-w-[1224px]">
        <h2 className="text-[12px] font-semibold uppercase tracking-[0.1em] text-sage">
          {t("eyebrow")}
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PAGES.map((page) => (
            <Link
              key={page}
              href={`/${page}`}
              className="group rounded-[5px] border border-card-border bg-paper p-7 transition-colors hover:border-forest"
            >
              <h3 className="font-serif text-[22px] leading-[1.2] text-forest">{t(`${page}.title`)}</h3>
              <p className="mt-3 text-[15px] leading-[1.5] text-prose-muted">{t(`${page}.body`)}</p>
              <ArrowRight
                size={20}
                aria-hidden
                className="mt-5 text-forest transition-transform group-hover:translate-x-1"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
