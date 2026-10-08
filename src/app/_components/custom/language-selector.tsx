"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { localeHref, stripLocale, type Locale } from "@/lib/locale-href";
import { cn } from "@/lib/utils";
import { useCurrentLocale } from "@/packages/locales/client";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ItalianFlag = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 16" className={className} aria-hidden="true" focusable="false">
    <rect width="8" height="16" fill="#009246" />
    <rect x="8" width="8" height="16" fill="#ffffff" />
    <rect x="16" width="8" height="16" fill="#ce2b37" />
  </svg>
);

const BritishFlag = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 16" className={className} aria-hidden="true" focusable="false">
    <rect width="24" height="16" fill="#012169" />
    <path d="M0,0 L24,16 M24,0 L0,16" stroke="#ffffff" strokeWidth="3.2" />
    <path d="M0,0 L24,16 M24,0 L0,16" stroke="#c8102e" strokeWidth="1.6" />
    <path d="M12,0 V16 M0,8 H24" stroke="#ffffff" strokeWidth="5.4" />
    <path d="M12,0 V16 M0,8 H24" stroke="#c8102e" strokeWidth="3.2" />
  </svg>
);

type Language = {
  locale: Locale;
  label: string;
  Flag: typeof ItalianFlag;
};

const italian: Language = { locale: "it", label: "Italiano", Flag: ItalianFlag };
const english: Language = { locale: "en", label: "English", Flag: BritishFlag };
const languages = [italian, english];

/**
 * Flag-based locale switcher. Links to the same page under the other locale
 * prefix (static export uses real /it and /en URL segments, so switching is
 * plain navigation rather than a client-side locale change).
 */
export const LanguageSelector = ({ className }: { className?: string }) => {
  const locale = useCurrentLocale();
  const pathname = stripLocale(usePathname());
  const current = locale === "en" ? english : italian;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={current.label}
        className={cn(
          "flex items-center gap-1 cursor-pointer rounded-md px-1.5 py-1 outline-none",
          className
        )}
      >
        <current.Flag className="h-4 w-6 rounded-[2px] shadow-sm" />
        <ChevronDown className="h-3.5 w-3.5 opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36 bg-page border-card-border">
        {languages.map(({ locale: itemLocale, label, Flag }) => (
          <DropdownMenuItem key={itemLocale} asChild>
            <Link
              href={localeHref(itemLocale, pathname)}
              className={cn(
                "flex items-center gap-2 text-[15px] text-forest cursor-pointer",
                itemLocale === locale && "font-medium"
              )}
            >
              <Flag className="h-4 w-6 rounded-[2px] shadow-sm" />
              {label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
