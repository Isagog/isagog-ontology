/**
 * Compact view of the Isagog ontologies (top level, agents, frames) for the
 * explorer page. ontologies.json is generated from the Turtle sources by
 * scripts/ontologies-to-json.py — regenerate it rather than editing it.
 */
import raw from "./ontologies.json";

export type Layer = "top" | "agents" | "frame";
export type Lang = "it" | "en";

interface TermBase {
  id: string;
  layer: Layer;
  label: Record<Lang, string>;
  definition: Partial<Record<Lang, string>>;
  parents: string[];
}

export interface OntologyClass extends TermBase {
  kind: "class";
}

export interface OntologyProperty extends TermBase {
  kind: "object" | "data";
  domain: string[];
  range: string[];
  /** Entailment profile of a frame role: seven ordered +/-/? positions. */
  profile?: string;
}

export type OntologyTerm = OntologyClass | OntologyProperty;
export type TermGroup = "classes" | "properties";

interface RawData {
  ontologies: { id: Layer; version: string }[];
  classes: Omit<OntologyClass, "kind">[];
  properties: OntologyProperty[];
}

const data = raw as RawData;

export const ontologyVersions = Object.fromEntries(
  data.ontologies.map((o) => [o.id, o.version])
) as Record<Layer, string>;

export const terms: ReadonlyMap<string, OntologyTerm> = new Map<string, OntologyTerm>([
  ...data.classes.map((c): [string, OntologyTerm] => [c.id, { ...c, kind: "class" }]),
  ...data.properties.map((p): [string, OntologyTerm] => [p.id, p]),
]);

export const groupOf = (term: OntologyTerm): TermGroup =>
  term.kind === "class" ? "classes" : "properties";

const children = new Map<string, string[]>();
for (const term of terms.values()) {
  for (const parent of term.parents) {
    if (!terms.has(parent)) continue;
    children.set(parent, [...(children.get(parent) ?? []), term.id]);
  }
}

const byLabel = (lang: Lang) => (a: string, b: string) =>
  (terms.get(a)?.label[lang] ?? a).localeCompare(terms.get(b)?.label[lang] ?? b, lang);

export const childrenOf = (id: string, lang: Lang): string[] =>
  [...(children.get(id) ?? [])].sort(byLabel(lang));

/** Terms of a group with no parent among the known terms. */
export const rootsOf = (group: TermGroup, lang: Lang): string[] =>
  [...terms.values()]
    .filter((t) => groupOf(t) === group && !t.parents.some((p) => terms.has(p)))
    .map((t) => t.id)
    .sort(byLabel(lang));

const properties = [...terms.values()].filter(
  (t): t is OntologyProperty => t.kind !== "class"
);

export const propertiesWithDomain = (id: string, lang: Lang): string[] =>
  properties.filter((p) => p.domain.includes(id)).map((p) => p.id).sort(byLabel(lang));

export const propertiesWithRange = (id: string, lang: Lang): string[] =>
  properties.filter((p) => p.range.includes(id)).map((p) => p.id).sort(byLabel(lang));

/** Whether the term or any of its descendants belongs to the layer. */
export const subtreeHasLayer = (id: string, layer: Layer, seen = new Set<string>()): boolean => {
  if (seen.has(id)) return false;
  seen.add(id);
  if (terms.get(id)?.layer === layer) return true;
  return (children.get(id) ?? []).some((child) => subtreeHasLayer(child, layer, seen));
};

export const searchTerms = (query: string, lang: Lang): string[] => {
  const q = query.trim().toLocaleLowerCase(lang);
  if (q === "") return [];
  return [...terms.values()]
    .filter(
      (t) =>
        t.id.toLocaleLowerCase(lang).includes(q) ||
        t.label.it.toLocaleLowerCase(lang).includes(q) ||
        t.label.en.toLocaleLowerCase(lang).includes(q)
    )
    .map((t) => t.id)
    .sort(byLabel(lang));
};
