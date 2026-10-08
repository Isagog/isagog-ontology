# Isagog ontologies

Static site for ontology.isagog.com: the Isagog ontologies (top level,
agents, frames) explained in five pages, with an interactive explorer.
Next.js 16 with `output: "export"`; GitHub Pages serves `out/`.

Linked from isagog.com (repo Isagog/isagog-web), which also forwards the
ontology IRIs `https://isagog.com/ontology/{top,agents,frame}[#Term]` here.

## Commands

    pnpm install
    pnpm dev          # dev server on :3000
    pnpm build        # static export into ./out (runs check-export afterwards)
    pnpm preview      # serve ./out
    pnpm test         # Vitest
    pnpm lint         # ESLint
    pnpm typecheck    # tsc --noEmit

## Structure

- `src/app/[locale]/(pages)/` — one route per page: `(index)`, `perspectives`,
  `layers`, `reasoning`, `explorer`.
- `src/lib/ontology-explorer/` — the explorer's data (`ontologies.json`,
  generated) and helpers; `deep-link.ts` handles `#<term id>` fragments.
- `src/packages/locales/lang/{it,en}.ts` — all copy; the two files must stay
  structurally identical (`parity.test.ts`).
- Header, footer and design tokens are copied from isagog-web; repeat brand
  changes there by hand.

## Regenerating the ontology data

The Turtle sources live in private repositories. With them checked out next
to this repo and rdflib installed:

    python scripts/ontologies-to-json.py \
        --top    ../isagog-core/src/isagog/models/knowledge/ontology/data/isagog-top-<version>.ttl \
        --agents ../isagog-agents/src/isagog/agents/ontology/data/isagog-agents-<version>.ttl \
        --frames ../isagog-frames/src/isagog/frames/ontology/data/isagog-frame-<version>.ttl

Commit the regenerated `src/lib/ontology-explorer/ontologies.json`; run
`pnpm test` first (`data.test.ts` pins structural invariants).

Design: isagog-web `docs/superpowers/specs/2026-10-08-ontology-minisite-design.md`.
