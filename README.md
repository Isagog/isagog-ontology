# Isagog ontologies

Public source of truth for the Isagog OWL ontologies, their offline Python
resource package, and the browser at https://ontology.isagog.com.

| Module | Version | Term namespace | Imports |
| --- | --- | --- | --- |
| core | 5.0 | `https://isagog.com/ontology/core#` | — |
| agents | 2.0 | `https://isagog.com/ontology/agents#` | core 5.0 |
| frame | 2.0 | `https://isagog.com/ontology/frame#` | core 5.0 |

## Sources and versions

`ontologies/` contains the authoritative Turtle files. `catalog.json` records
ontology/version IRIs, exact imports, SHA-256 checksums and provenance. Published
version files are immutable: make changes in a new version and update the
catalog's `current` entries. Ontology versions are independent of the Python
bundle version (`1.0.0` initially).

`ontologies/legacy/` preserves top 4.7, agents 1.0 and frame 1.1 byte for byte
from their former private repositories. Their exact source commits and paths
are recorded in the catalog. The archived IsagogOntologies repository is
historical and is not an upstream dependency.

Core 5.0 renames `/ontology/top#` to `/ontology/core#`; agents 2.0 and frame 2.0
import core 5.0. There is no equivalence/mapping ontology or dual-namespace
runtime support. The old versions remain available as historical resources.
MAXXI ontology alignment and KG migration are separate work; MeMa stays on its
existing pinned software/ontology versions.

## Offline Python resources

The `isagog-ontologies` distribution contains only Turtle, a catalog and a
standard-library resource resolver. It has no dependency on private Isagog
software or RDF libraries. It can be installed from a public Git commit or a
wheel attached to an `ontologies-v<bundle-version>` GitHub release.

```python
from isagog_ontologies import ontology_resource

resource = ontology_resource("https://isagog.com/ontology/core/5.0")
text = resource.read_text(encoding="utf-8")
```

Bare ontology IRIs select the bundle's current release; version IRIs always
select the named release. Unknown versions return `None`, never a newer file.
Applications should pin the bundle and use exact version IRIs in `owl:imports`.
The private core/agents/frames modules keep their Python integration and
models; they consume these public sources and do not maintain Turtle copies.

## Development and validation

```sh
uv sync --locked
uv run pytest
uv run ruff check python scripts/ontologies-to-json.py scripts/export-ontologies.py tests
uv run python scripts/ontologies-to-json.py
uv run python scripts/export-ontologies.py
uv build
pnpm install --frozen-lockfile
pnpm test
pnpm test:edge
pnpm typecheck
pnpm lint
uv run -- pnpm build
```

The explorer JSON is generated from the catalog, without private checkouts.
CI checks it with `scripts/ontologies-to-json.py --check`. The export script
produces `public/ontology/` downloads (not committed) and `edge/routes.mjs`
(committed). The static build exports both the site and downloads into `out/`;
`scripts/check-export.mjs` verifies routes, anchors and download checksums.

Next.js 16 uses `output: "export"`. Pages live under
`src/app/[locale]/(pages)/`; Italian and English copy under
`src/packages/locales/lang/`. The layers page links to the complete Turtle
files; the explorer is a compact view, not a complete OWL serialization.

## Publication and canonical IRIs

A main-branch push builds and deploys the browser/downloads to GitHub Pages.
Pull requests validate the same build without deploying. To publish a bundle,
create and push `ontologies-v1.0.0` (matching pyproject/catalog versions); the
release workflow validates, builds and attaches the wheel and sdist. Private
consumers may pin the public source commit before this release exists.

GitHub Pages alone cannot negotiate RDF/HTML for IRIs hosted on isagog.com.
`edge/worker.mjs` provides that routing, configured by `edge/wrangler.toml`.
After the downloads are deployed, deploy the worker in the account managing
isagog.com, with the route `isagog.com/ontology/*`. This requires that the
route run through Cloudflare; otherwise use the same catalog-driven behavior
in the actual HTTP host/proxy. Analytics configuration alone does not enable
this routing. The worker is not deployed by the GitHub Pages workflow.

Expected behavior:

- `GET https://isagog.com/ontology/core` with `Accept: text/turtle`: core 5.0.
- `GET https://isagog.com/ontology/core/5.0`: the immutable core 5.0 Turtle.
- Likewise agents 2.0, frame 2.0 and each archived version, including top 4.7.
- Browsers requesting HTML: documentation, preserving `#Term` fragments.
- Unknown versions: 404. No supported representation: 406.
- Version responses are immutable; bare aliases have short cache lifetimes.

Deployment is complete only after checking those canonical URLs publicly with
both RDF and HTML Accept headers. Deploy the downloads before the edge route;
otherwise the worker reports an origin error rather than serving HTML as RDF.

## Licenses

Ontology definitions and RDF exports: **CC BY 4.0**, credited to Guido Vetere /
Isagog S.r.l.; see `LICENSES/CC-BY-4.0.txt` and the metadata in each Turtle.
Code and site: **MIT**, see `LICENSE`. Private runtime code is not part of
this repository or distribution.
