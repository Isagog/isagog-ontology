"""Generate the explorer view from the public catalog and authoritative Turtle files."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

from rdflib import OWL, RDF, RDFS, Graph, Literal, Namespace, URIRef

CORE = Namespace("https://ontology.isagog.com/core#")
FRAME = Namespace("https://ontology.isagog.com/frames#")
PREFIXES = {
    "https://ontology.isagog.com/core#": "core",
    "https://ontology.isagog.com/agents#": "agents",
    "https://ontology.isagog.com/frames#": "frames",
}
OUT = Path(__file__).resolve().parent.parent / "src/lib/ontology-explorer/ontologies.json"


def curie(node) -> str | None:
    if not isinstance(node, URIRef):
        return None
    for ns, prefix in PREFIXES.items():
        if str(node).startswith(ns):
            return f"{prefix}:{str(node)[len(ns) :]}"
    return None


ACCENTS = {"a": "à", "e": "è", "i": "ì", "o": "ò", "u": "ù"}


def fix_accents(text: str) -> str:
    """The frame ontology writes Italian accents as apostrophes (e', unita')."""
    text = re.sub(r"\b(\w*ch)e'(?!\w)", r"\1é", text)
    return re.sub(r"\b(\w*)([aeiou])'(?!\w)", lambda m: m[1] + ACCENTS[m[2]], text)


def by_lang(g: Graph, subject, predicate) -> dict[str, str]:
    out: dict[str, str] = {}
    for value in g.objects(subject, predicate):
        if isinstance(value, Literal) and value.language in ("it", "en"):
            text = " ".join(str(value).split())
            out.setdefault(value.language, fix_accents(text) if value.language == "it" else text)
    return out


def first_line(text: str) -> str:
    return text.split("\n\n")[0].strip()


def describe(g: Graph, subject, layer: str) -> dict:
    label = by_lang(g, subject, RDFS.label)
    definition = by_lang(g, subject, CORE.definition)
    if not definition:
        # The frame ontology has no operational definitions: fall back to the
        # first paragraph of the comment.
        definition = {k: first_line(v) for k, v in by_lang(g, subject, RDFS.comment).items()}
    local = curie(subject).split(":", 1)[1]
    return {
        "id": curie(subject),
        "layer": layer,
        "label": {"it": label.get("it", local), "en": label.get("en", local)},
        "definition": definition,
    }


def named(nodes) -> list[str]:
    return sorted({c for c in (curie(n) for n in nodes) if c})


def ontology_meta(g: Graph, layer: str) -> dict:
    onto = next(g.subjects(RDF.type, OWL.Ontology))
    version = str(next(g.objects(onto, OWL.versionIRI))).rsplit("/", 1)[-1].removesuffix(".ttl")
    return {
        "id": layer,
        "version": version,
        "label": by_lang(g, onto, RDFS.label),
        "iri": str(onto),
        "versionIRI": str(next(g.objects(onto, OWL.versionIRI))),
        "download": f"/{layer}.ttl",
        "license": str(g.value(onto, URIRef("http://purl.org/dc/elements/1.1/license"))),
    }


def extract(path: str, layer: str) -> tuple[dict, list[dict], list[dict]]:
    g = Graph().parse(path, format="turtle")
    own = next(ns for ns, p in PREFIXES.items() if p == layer)

    classes = []
    for c in sorted(set(g.subjects(RDF.type, OWL.Class)), key=str):
        if not str(c).startswith(own):
            continue
        entry = describe(g, c, layer)
        entry["parents"] = named(g.objects(c, RDFS.subClassOf))
        classes.append(entry)

    properties = []
    for kind, rdf_type in (("object", OWL.ObjectProperty), ("data", OWL.DatatypeProperty)):
        for p in sorted(set(g.subjects(RDF.type, rdf_type)), key=str):
            if not str(p).startswith(own):
                continue
            entry = describe(g, p, layer)
            entry["kind"] = kind
            entry["parents"] = named(g.objects(p, RDFS.subPropertyOf))
            entry["domain"] = named(g.objects(p, RDFS.domain))
            entry["range"] = named(g.objects(p, RDFS.range))
            profile = g.value(p, FRAME.entailment_profile)
            if profile is not None:
                entry["profile"] = str(profile)
            properties.append(entry)

    return ontology_meta(g, layer), classes, properties


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--check", action="store_true", help="Fail if the committed explorer data is stale."
    )
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    catalog = json.loads((root / "catalog.json").read_text())
    entries = {entry["version_iri"]: entry for entry in catalog["ontologies"]}
    data = {"ontologies": [], "classes": [], "properties": []}
    for layer in ("core", "agents", "frames"):
        entry = entries[catalog["current"][layer]]
        meta, classes, properties = extract(str(root / entry["file"]), layer)
        data["ontologies"].append(meta)
        data["classes"].extend(classes)
        data["properties"].extend(properties)
    content = json.dumps(data, ensure_ascii=False, indent=1) + "\n"
    if args.check:
        if not OUT.is_file() or OUT.read_text(encoding="utf-8") != content:
            raise SystemExit("Explorer data is stale: run python scripts/ontologies-to-json.py")
    else:
        OUT.parent.mkdir(parents=True, exist_ok=True)
        OUT.write_text(content, encoding="utf-8")
    print(f"{OUT.name}: {len(data['classes'])} classes, {len(data['properties'])} properties")


if __name__ == "__main__":
    main()
