# Isagog ontologies

Public source of truth for the Isagog OWL ontologies, the offline Python data
package, and the browser at https://ontology.isagog.com.

| Ontology | Turtle download | Current version |
| --- | --- | --- |
| core | https://ontology.isagog.com/core.ttl | 6.0 |
| agents | https://ontology.isagog.com/agents.ttl | 3.0 |
| frames | https://ontology.isagog.com/frames.ttl | 3.0 |

Term IRIs use the extensionless namespace, for example
`https://ontology.isagog.com/core#Person`, `agents#SpeechAct` and `frames#Frame`.
Ontology IRIs are `https://ontology.isagog.com/core`, `/agents` and `/frames`;
they open HTML documentation. The corresponding `.ttl` documents serve RDF.
There is no automatic HTML/RDF negotiation: imports use exact `.ttl` version IRIs.
Everything is served statically by GitHub Pages. No Worker, HTTP proxy or DNS
change is required.

## Sources, releases and imports

`ontologies/` contains the authoritative Turtle files. `catalog.json` records
ontology/version IRIs, Turtle document URLs, term namespaces, exact imports,
checksums and provenance.
The bundle version is **2.0.0**, independent of the ontology versions.

Version IRIs identify immutable, directly downloadable Turtle files:

- https://ontology.isagog.com/core/6.0.ttl
- https://ontology.isagog.com/agents/3.0.ttl
- https://ontology.isagog.com/frames/3.0.ttl

Agents and frames import core 6.0 by that exact version IRI. A generic OWL
loader can therefore follow imports over HTTP; Python consumers resolve the
same IRIs offline through the bundled catalog. Unknown versions never select
a different file.

Published version files are immutable: changes require new versions and an
updated `current` catalog entry. All earlier Turtle releases remain unchanged,
including top 4.7, agents 1.0, frame 1.1, core 5.0, agents 2.0 and frame 2.0.
They remain downloadable under `/ontology/` at their previously published paths.
The old `isagog.com/ontology/...` identifiers are historical; no runtime mapping
ontology is introduced. The archived IsagogOntologies repository is not an
upstream dependency.

This release moves identifiers onto the static ontology host and standardizes
the frames filename/namespace to the plural. MAXXI ontology alignment and KG
migration remain separate; MeMa retains its existing pinned versions.

## Python resources

`isagog-ontologies` contains Turtle, a catalog and a standard-library resolver.
It has no runtime dependency on private Isagog code or RDF frameworks. Install
it from a public source commit or the wheel on an `ontologies-v<version>` release.

```python
from isagog_ontologies import ontology_resource

resource = ontology_resource("https://ontology.isagog.com/core/6.0.ttl")
text = resource.read_text(encoding="utf-8")
```

`current_ontology("core")`, `current_ontology("agents")` and
`current_ontology("frames")` describe the active family. Private core/agents/
frames packages own their integration code and generated models, not copies
of the Turtle sources.

## Development

```sh
uv sync --locked
uv run pytest
uv run ruff check python scripts tests
uv run python scripts/ontologies-to-json.py
uv run python scripts/export-ontologies.py
uv build
pnpm install --frozen-lockfile
pnpm test
pnpm typecheck
pnpm lint
uv run -- pnpm build
```

The explorer JSON is generated from the public catalog. CI checks it with
`scripts/ontologies-to-json.py --check`. The export script generates canonical
root-level `.ttl` files, immutable version paths, archived downloads and a
public `/catalog.json`; all are derived artifacts excluded from Git. The
static export check verifies every exported Turtle file against its checksum.

Next.js uses `output: "export"`. Pages live in `src/app/[locale]/(pages)/`;
Italian and English copy in `src/packages/locales/lang/` must have parity.
The layers page links directly to `/core.ttl`, `/agents.ttl` and `/frames.ttl`.
The explorer presents a compact view; those downloads contain the complete OWL.

## Publication

A main-branch push validates and deploys the static site and Turtle files to
GitHub Pages. After deployment, `scripts/check-published-ontologies.py` checks
all active Turtle document/version URLs for HTTP 200, `text/turtle` and exact
release checksums, plus the extensionless HTML documentation URLs. It can also be run manually with plain Python.

Tag `ontologies-v2.0.0` on the verified source commit to publish a GitHub release
with the wheel and sdist. The tag must match pyproject/catalog bundle versions.
Private consumers pin exact public Git commits for reproducibility.

## Licenses

Ontology definitions and RDF exports: **CC BY 4.0**, credited to Guido Vetere /
Isagog S.r.l.; see `LICENSES/CC-BY-4.0.txt` and each Turtle's metadata.
Code and site: **MIT**, see `LICENSE`. Private runtime code is not distributed
by this repository.
