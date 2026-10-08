"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { stripLocale } from "@/lib/locale-href";
import { mainSiteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useCurrentLocale, useScopedI18n } from "@/packages/locales/client";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LanguageSelector } from "./language-selector";
import { LocaleLink as Link } from "./locale-link";

const isActive = (pathname: string, href: string): boolean => pathname.startsWith(href);

export const Header = () => {
  const t = useScopedI18n("nav");
  const locale = useCurrentLocale();
  const pathname = stripLocale(usePathname());
  const [open, setOpen] = useState(false);

  const navItems = [
    { href: "/perspectives", label: t("perspectives") },
    { href: "/layers", label: t("layers") },
    { href: "/reasoning", label: t("reasoning") },
    { href: "/explorer", label: t("explorer") },
  ];
  const mainSite = mainSiteUrl(locale);

  return (
    <header className="fixed top-0 z-50 w-full bg-page/90 backdrop-blur-sm border-b border-border">
      <div className="mx-auto flex max-w-[1224px] items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-serif text-[22px] text-forest">
            {t("wordmark")} <span className="text-sage">{t("siteName")}</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-[15px] text-forest/80 hover:text-forest transition-colors",
                  isActive(pathname, item.href) && "text-forest font-medium"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <a
            href={mainSite}
            className="flex items-center gap-1 text-[15px] text-forest/80 hover:text-forest transition-colors"
          >
            {t("mainSite")}
            <ArrowUpRight size={16} aria-hidden />
          </a>
          <LanguageSelector className="text-forest/80 hover:text-forest" />
        </div>

        <div className="lg:hidden flex items-center gap-2">
          <LanguageSelector className="text-forest/80 hover:text-forest" />
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger
              aria-label={t("menu")}
              className="flex h-8 w-8 items-center justify-center"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-page border-card-border">
              {navItems.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href} className="text-[15px] text-forest">
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem asChild>
                <a href={mainSite} className="text-[15px] text-terracotta">
                  {t("mainSite")} ↗
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
