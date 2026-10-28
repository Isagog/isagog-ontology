# Contributing

## Working with the ontologies

The authoritative Turtle sources live in `ontologies/`. The public catalog
records release identities, source paths, imports and checksums. Archived
sources, including historical `frame` versions, are under `ontologies/legacy/`;
the active frames ontology uses `ontologies/frames/`.

Published ontology versions are immutable. Prepare a new version for any
change to a released Turtle document, then update the catalog and regenerate
the explorer and downloadable files. Preserve existing download URLs when
moving source files; `archive_path` records an explicit historical export path.

A license change requires a separate review of rights and release scope.
Keep the declared license consistent across Turtle metadata, notices, the
catalog, package metadata and the public site. A new release or identifier
does not revoke permissions already granted for earlier material.

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

The explorer JSON is generated from the catalog. Use
`scripts/ontologies-to-json.py --check` to detect stale committed data.
The export script produces the public Turtle aliases, version documents,
namespace documentation and catalog. Generated files under `public/` are
excluded from Git. The static export check verifies their checksums.

The Python distribution includes the source Turtle files and an offline
resource catalog. Its version is independent of ontology version numbers.
`uv build` builds a wheel and sdist without depending on the browser build.

## Website

Pages live in `src/app/[locale]/(pages)/`. Italian and English copy in
`src/packages/locales/lang/` must have matching keys. Follow `AGENTS.md` and
read the documentation bundled with the installed Next.js version before
changing application code.

## Publication

Pull requests run validation without deploying. A main-branch push deploys
the static site and ontology downloads. After deployment,
`scripts/check-published-ontologies.py` verifies live documents and historical
export paths against the catalog.

To publish a Python distribution, tag the verified source commit with
`ontologies-v<bundle-version>`. The tag must match the package and catalog
versions. The release workflow publishes the wheel and sdist.
