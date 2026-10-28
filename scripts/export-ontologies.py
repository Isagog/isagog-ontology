"""Generate canonical static Turtle URLs and archived downloads from the catalog."""

from __future__ import annotations

import argparse
import json
from html import escape
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]


def documentation(entry: dict) -> bytes:
    """An HTML entry point for namespace/hash links; RDF has its own .ttl URL."""
    module = entry["id"]
    layers = f"https://ontology.isagog.com/en/layers/#{module}"
    explorer = "https://ontology.isagog.com/en/explorer/"
    return f'''<!doctype html><html lang="en"><meta charset="utf-8">
<title>Isagog {escape(module)} ontology</title>
<link rel="alternate" type="text/turtle" href="{escape(entry["document_url"])}">
<p><a href="{escape(layers)}">Ontology documentation</a> ·
<a href="{escape(entry["document_url"])}">Download Turtle</a></p>
<script>
let term = location.hash.slice(1);
try {{ term = decodeURIComponent(term); }} catch {{ term = ""; }}
const browser = {json.dumps(explorer)};
const prefix = {json.dumps(module + ":")};
location.replace(term
  ? browser + "#" + encodeURIComponent(prefix + term)
  : {json.dumps(layers)});
</script>
</html>'''.encode()


def outputs() -> dict[Path, bytes]:
    catalog_bytes = (ROOT / "catalog.json").read_bytes()
    catalog = json.loads(catalog_bytes)
    result = {
        ROOT / "public/catalog.json": catalog_bytes,
        ROOT / "public/ontology/catalog.json": catalog_bytes,
    }
    for entry in catalog["ontologies"]:
        relative = entry["file"].removeprefix("ontologies/")
        content = (ROOT / entry["file"]).read_bytes()
        result[ROOT / "public/ontology" / relative] = content
        version_url = urlsplit(entry["version_iri"])
        if version_url.netloc == "ontology.isagog.com":
            result[ROOT / "public" / version_url.path.lstrip("/")] = content
            if entry["version_iri"] == catalog["current"].get(entry["id"]):
                alias = urlsplit(entry["document_url"]).path.lstrip("/")
                result[ROOT / "public" / alias] = content
                namespace = urlsplit(entry["ontology_iri"]).path.lstrip("/")
                result[ROOT / "public" / namespace / "index.html"] = documentation(entry)
    return result


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    stale = []
    for path, content in outputs().items():
        if args.check:
            if not path.is_file() or path.read_bytes() != content:
                stale.append(str(path.relative_to(ROOT)))
        else:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(content)
    if stale:
        raise SystemExit("Stale ontology exports: " + ", ".join(stale))


if __name__ == "__main__":
    main()
