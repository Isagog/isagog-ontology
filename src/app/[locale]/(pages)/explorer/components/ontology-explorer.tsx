"use client";

import { useRef, useState } from "react";
import { Search, Split } from "lucide-react";
import { cn } from "@/lib/utils";
import { hashForTerm, termIdFromHash } from "@/lib/ontology-explorer/deep-link";
import { useLocationHash } from "@/lib/use-location-hash";
import {
  childrenOf,
  groupOf,
  ontologyVersions,
  propertiesWithDomain,
  propertiesWithRange,
  rootsOf,
  searchTerms,
  subtreeHasLayer,
  terms,
  type Lang,
  type Layer,
  type OntologyTerm,
  type TermGroup,
} from "@/lib/ontology-explorer/data";
import { useCurrentLocale, useScopedI18n } from "@/packages/locales/client";

const LAYER_DOT: Record<Layer, string> = {
  top: "bg-forest",
  agents: "bg-terracotta",
  frame: "bg-olive",
};

const PROFILE_DIMS = ["dim1", "dim2", "dim3", "dim4", "dim5", "dim6", "dim7"] as const;

/** Opens on the speech act: one entity, two perspectives (Event and Information). */
const INITIAL_TERM = "agents:SpeechAct";

/**
 * Browsable view of the three Isagog ontologies, built at build time from
 * src/lib/ontology-explorer/ontologies.json. Terms with several parents are
 * listed under each of them — the multiple classification the page talks
 * about, made visible. Static export prerenders the initial state, so the
 * tree and the speech act definition are readable without JS. A `#<term id>`
 * fragment (e.g. `#top:Agent`) selects that term; selecting a term writes it
 * back to the URL.
 */
export const OntologyExplorer = () => {
  const t = useScopedI18n("ontologies.esplora");
  const lang: Lang = useCurrentLocale() === "it" ? "it" : "en";
  const [group, setGroup] = useState<TermGroup>("classes");
  const [layer, setLayer] = useState<Layer | "all">("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(INITIAL_TERM);
  const detailRef = useRef<HTMLDivElement>(null);

  const selected = terms.get(selectedId);

  // Deep links: "#top:Agent" selects that term, clearing any filter or
  // search that would hide it. Adjusting state during render (not in an
  // effect) is React's pattern for reacting to a changed input; appliedHash
  // records the last fragment handled so each one applies once.
  const hash = useLocationHash();
  const [appliedHash, setAppliedHash] = useState("");
  if (hash !== appliedHash) {
    setAppliedHash(hash);
    const linkedId = termIdFromHash(hash);
    const linkedTerm = linkedId === null ? undefined : terms.get(linkedId);
    if (linkedId !== null && linkedTerm) {
      setSelectedId(linkedId);
      setGroup(groupOf(linkedTerm));
      setLayer("all");
      setQuery("");
    }
  }

  const select = (id: string) => {
    const term = terms.get(id);
    if (!term) return;
    setSelectedId(id);
    setGroup(groupOf(term));
    // Make the selection copyable as a URL without adding history entries.
    // replaceState fires no hashchange; recording the hash as applied
    // keeps the block above from re-applying it (and clearing the search).
    const nextHash = hashForTerm(id);
    setAppliedHash(nextHash);
    window.history.replaceState(null, "", nextHash);
    if (window.matchMedia("(max-width: 767px)").matches) {
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const layers: { id: Layer | "all"; label: string }[] = [
    { id: "all", label: t("layerAll") },
    { id: "top", label: t("layerTop") },
    { id: "agents", label: t("layerAgents") },
    { id: "frame", label: t("layerFrame") },
  ];

  const results = searchTerms(query, lang);
  const visibleRoots = rootsOf(group, lang).filter(
    (id) => layer === "all" || subtreeHasLayer(id, layer)
  );

  return (
    <div className="grid min-w-0 gap-6 rounded-[8px] bg-paper p-5 sm:p-7 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="min-w-0">
        <div className="flex flex-wrap gap-2">
          {(["classes", "properties"] as const).map((g) => (
            <button
              key={g}
              type="button"
              aria-pressed={group === g && query === ""}
              onClick={() => {
                setGroup(g);
                setQuery("");
              }}
              className={cn(
                "rounded-[5px] border px-3 py-1.5 text-[14px] font-medium transition-colors",
                group === g && query === ""
                  ? "border-forest bg-forest text-cream"
                  : "border-card-border text-forest hover:border-forest"
              )}
            >
              {g === "classes" ? t("classesTab") : t("propertiesTab")}
            </button>
          ))}
        </div>

        <fieldset className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          <legend className="sr-only">{t("layerLabel")}</legend>
          {layers.map((l) => (
            <label key={l.id} className="flex cursor-pointer items-center gap-1.5 text-[13.5px] text-forest">
              <input
                type="radio"
                name="ontology-layer"
                value={l.id}
                checked={layer === l.id}
                onChange={() => setLayer(l.id)}
                className="accent-forest"
              />
              {l.id !== "all" && (
                <span className={cn("inline-block size-2 rounded-full", LAYER_DOT[l.id])} aria-hidden />
              )}
              {l.label}
            </label>
          ))}
        </fieldset>

        <label className="mt-4 flex items-center gap-2 rounded-[5px] border border-card-border bg-page px-3 py-2 focus-within:border-forest">
          <Search size={16} className="shrink-0 text-sage" aria-hidden />
          <span className="sr-only">{t("searchLabel")}</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full min-w-0 bg-transparent text-[14.5px] text-forest outline-none placeholder:text-prose-muted"
          />
        </label>

        <div className="mt-4 max-h-[360px] overflow-auto pr-1 md:max-h-[520px]">
          {query.trim() !== "" ? (
            results.length === 0 ? (
              <p className="text-[14.5px] text-prose-muted">{t("noResults")}</p>
            ) : (
              <ul className="list-none p-0">
                {results.map((id) => (
                  <li key={id}>
                    <TermButton id={id} lang={lang} selectedId={selectedId} onSelect={select} />
                  </li>
                ))}
              </ul>
            )
          ) : (
            <ul className="list-none p-0">
              {visibleRoots.map((id) => (
                <TreeNode
                  key={id}
                  id={id}
                  lang={lang}
                  layer={layer}
                  selectedId={selectedId}
                  onSelect={select}
                  ancestors={[]}
                  multipleLabel={t("multiple")}
                />
              ))}
            </ul>
          )}
        </div>
      </div>

      <div ref={detailRef} aria-live="polite" className="min-w-0 scroll-mt-24 border-t border-divider pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-7">
        {selected && <TermDetail term={selected} lang={lang} onSelect={select} />}
      </div>
    </div>
  );
};

const TermButton = ({
  id,
  lang,
  selectedId,
  onSelect,
  dimmed = false,
  multipleLabel,
}: {
  id: string;
  lang: Lang;
  selectedId: string;
  onSelect: (id: string) => void;
  dimmed?: boolean;
  multipleLabel?: string;
}) => {
  const term = terms.get(id);
  if (!term) return null;
  const isSelected = id === selectedId;

  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      aria-current={isSelected ? "true" : undefined}
      className={cn(
        "flex w-full items-center gap-2 rounded-[4px] px-2 py-1 text-left text-[14.5px] transition-colors",
        isSelected ? "bg-forest text-cream" : "text-forest hover:bg-tecnologia",
        dimmed && !isSelected && "opacity-45"
      )}
    >
      <span className={cn("inline-block size-2 shrink-0 rounded-full", LAYER_DOT[term.layer])} aria-hidden />
      <span className="min-w-0 truncate">{term.label[lang]}</span>
      {multipleLabel && term.parents.filter((p) => terms.has(p)).length > 1 && (
        <span title={multipleLabel} className="shrink-0">
          <Split
            size={14}
            className={isSelected ? "text-em-dark" : "text-terracotta"}
            aria-hidden
          />
          <span className="sr-only">{multipleLabel}</span>
        </span>
      )}
    </button>
  );
};

const TreeNode = ({
  id,
  lang,
  layer,
  selectedId,
  onSelect,
  ancestors,
  multipleLabel,
}: {
  id: string;
  lang: Lang;
  layer: Layer | "all";
  selectedId: string;
  onSelect: (id: string) => void;
  ancestors: string[];
  multipleLabel: string;
}) => {
  const term = terms.get(id);
  if (!term || ancestors.includes(id)) return null;
  const kids = childrenOf(id, lang).filter((k) => layer === "all" || subtreeHasLayer(k, layer));

  return (
    <li>
      <TermButton
        id={id}
        lang={lang}
        selectedId={selectedId}
        onSelect={onSelect}
        dimmed={layer !== "all" && term.layer !== layer}
        multipleLabel={multipleLabel}
      />
      {kids.length > 0 && (
        <ul className="ml-3 list-none border-l border-card-border pl-2">
          {kids.map((kid) => (
            <TreeNode
              key={kid}
              id={kid}
              lang={lang}
              layer={layer}
              selectedId={selectedId}
              onSelect={onSelect}
              ancestors={[...ancestors, id]}
              multipleLabel={multipleLabel}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const TermDetail = ({
  term,
  lang,
  onSelect,
}: {
  term: OntologyTerm;
  lang: Lang;
  onSelect: (id: string) => void;
}) => {
  const t = useScopedI18n("ontologies.esplora");
  const layerName = { top: t("layerTop"), agents: t("layerAgents"), frame: t("layerFrame") }[term.layer];
  const kind = { class: t("kindClass"), object: t("kindObject"), data: t("kindData") }[term.kind];
  const definition = term.definition[lang] ?? term.definition.en;
  const knownParents = term.parents.filter((p) => terms.has(p));
  const isClass = term.kind === "class";

  return (
    <div>
      <p className="flex flex-wrap items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-sage">
        <span className={cn("inline-block size-2 rounded-full", LAYER_DOT[term.layer])} aria-hidden />
        {layerName} {ontologyVersions[term.layer]} · {kind}
      </p>
      <h3 className="mt-3 font-serif text-[clamp(24px,2.6vw,31px)] leading-[1.2] text-forest">
        {term.label[lang]}
      </h3>
      <code className="mt-1 block text-[13px] text-prose-muted">{term.id}</code>

      <p className="mt-5 text-[16px] leading-[1.6] text-forest">{definition ?? t("noDefinition")}</p>
      {definition && term.definition[lang] === undefined && (
        <p className="mt-2 text-[13px] italic text-prose-muted">{t("onlyEnglish")}</p>
      )}

      <dl className="mt-6 grid gap-5">
        <Related
          label={isClass ? t("classParents") : t("propertyParents")}
          ids={knownParents}
          lang={lang}
          onSelect={onSelect}
        />
        <Related label={t("children")} ids={childrenOf(term.id, lang)} lang={lang} onSelect={onSelect} />
        {term.kind === "class" ? (
          <>
            <Related label={t("domainOf")} ids={propertiesWithDomain(term.id, lang)} lang={lang} onSelect={onSelect} />
            <Related label={t("rangeOf")} ids={propertiesWithRange(term.id, lang)} lang={lang} onSelect={onSelect} />
          </>
        ) : (
          <>
            <Related label={t("domain")} ids={term.domain} lang={lang} onSelect={onSelect} />
            <Related label={t("range")} ids={term.range} lang={lang} onSelect={onSelect} />
          </>
        )}
      </dl>

      {term.kind !== "class" && term.profile && (
        <div className="mt-6 border-t border-divider pt-5">
          <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-sage">{t("profile")}</p>
          <ul className="mt-3 grid list-none grid-cols-2 gap-x-6 gap-y-1.5 p-0 text-[14px] text-forest sm:grid-cols-3">
            {term.profile.split(",").map((value, i) => (
              <li key={PROFILE_DIMS[i]} className="flex items-center gap-2">
                <span className="w-4 text-center font-mono font-semibold text-terracotta">
                  {value === "-" ? "−" : value}
                </span>
                {t(PROFILE_DIMS[i] ?? "dim1")}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[12.5px] text-prose-muted">{t("profileLegend")}</p>
        </div>
      )}
    </div>
  );
};

const Related = ({
  label,
  ids,
  lang,
  onSelect,
}: {
  label: string;
  ids: string[];
  lang: Lang;
  onSelect: (id: string) => void;
}) => {
  const known = ids.filter((id) => terms.has(id));
  if (known.length === 0) return null;

  return (
    <div>
      <dt className="text-[12px] font-semibold uppercase tracking-[0.1em] text-sage">{label}</dt>
      <dd className="mt-2 flex flex-wrap gap-2">
        {known.map((id) => {
          const term = terms.get(id)!;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              className="flex items-center gap-1.5 rounded-[5px] border border-card-border px-2.5 py-1 text-[13.5px] text-forest transition-colors hover:border-forest"
            >
              <span className={cn("inline-block size-1.5 rounded-full", LAYER_DOT[term.layer])} aria-hidden />
              {term.label[lang]}
            </button>
          );
        })}
      </dd>
    </div>
  );
};
