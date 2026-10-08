import { terms } from "./data";

/**
 * Explorer deep links: "#top:Agent" selects top:Agent. Returns the term id
 * when the fragment names a known term, null otherwise (empty, unknown or
 * malformed) — the explorer then keeps its default view.
 */
export const termIdFromHash = (hash: string): string | null => {
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  if (raw === "") return null;

  let id: string;
  try {
    id = decodeURIComponent(raw);
  } catch {
    return null;
  }
  return terms.has(id) ? id : null;
};

/** The fragment that selects a term. Ids are "<prefix>:<LocalName>", safe in a fragment as is. */
export const hashForTerm = (id: string): string => `#${id}`;
