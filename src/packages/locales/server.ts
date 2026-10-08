import { createI18nServer } from "next-international/server";

export { setStaticParamsLocale } from "next-international/server";

export const { getI18n, getScopedI18n, getStaticParams } = createI18nServer({
  it: () => import("./lang/it"),
  en: () => import("./lang/en"),
});
