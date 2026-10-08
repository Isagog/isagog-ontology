"""
Build src/lib/ontology-explorer/ontologies.json from the Isagog ontologies.

The explorer page reads a compact view of the three ontologies:
labels and operational definitions (top:definition) in both languages, the
class and property hierarchies, and property domains and ranges. Extended
rdfs:comment documentation is left out on purpose — the operational
definitions are the same compact view the ontologies offer to language models.

Usage (rdflib required, e.g. from the isagog-core virtualenv):

    python scripts/ontologies-to-json.py \
        --top    ../isagog-core/src/isagog/models/knowledge/ontology/data/isagog-top-4.7.ttl \
        --agents ../isagog-agents/src/isagog/agents/ontology/data/isagog-agents-1.0.ttl \
        --frames ../isagog-frames/src/isagog/frames/ontology/data/isagog-frame-1.1.ttl
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

from rdflib import OWL, RDF, RDFS, Graph, Literal, Namespace, URIRef

TOP = Namespace("https://isagog.com/ontology/top#")
FRAME = Namespace("https://isagog.com/ontology/frame#")
PREFIXES = {
    "https://isagog.com/ontology/top#": "top",
    "https://isagog.com/ontology/agents#": "agents",
    "https://isagog.com/ontology/frame#": "frame",
}
OUT = Path(__file__).resolve().parent.parent / "src/lib/ontology-explorer/ontologies.json"


def curie(node) -> str | None:
    if not isinstance(node, URIRef):
        return None
    for ns, prefix in PREFIXES.items():
        if str(node).startswith(ns):
            return f"{prefix}:{str(node)[len(ns):]}"
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
    definition = by_lang(g, subject, TOP.definition)
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
    version = str(next(g.objects(onto, OWL.versionIRI))).rsplit("/", 1)[-1]
    return {"id": layer, "version": version, "label": by_lang(g, onto, RDFS.label)}


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
    parser = argparse.ArgumentParser()
    parser.add_argument("--top", required=True)
    parser.add_argument("--agents", required=True)
    parser.add_argument("--frames", required=True)
    args = parser.parse_args()

    data = {"ontologies": [], "classes": [], "properties": []}
    for layer, path in (("top", args.top), ("agents", args.agents), ("frame", args.frames)):
        meta, classes, properties = extract(path, layer)
        data["ontologies"].append(meta)
        data["classes"].extend(classes)
        data["properties"].extend(properties)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"{OUT}: {len(data['classes'])} classes, {len(data['properties'])} properties")


if __name__ == "__main__":
    main()
