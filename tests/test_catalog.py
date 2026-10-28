"""Catalog, import closure and migration invariants for the public releases."""

from hashlib import sha256
from pathlib import Path
from runpy import run_path
from urllib.parse import urlsplit

import pytest
from isagog_ontologies import current_ontology, load_catalog, ontology_resource
from rdflib import Graph, Literal, URIRef
from rdflib.compare import isomorphic
from rdflib.namespace import OWL, RDF, RDFS

ROOT = Path(__file__).resolve().parents[1]


@pytest.mark.parametrize("entry", load_catalog()["ontologies"], ids=lambda e: e["version_iri"])
def test_catalog_matches_turtle_and_imports_resolve(entry):
    resource = ontology_resource(entry["version_iri"])
    assert resource is not None and resource.is_file()
    data = resource.read_bytes()
    assert sha256(data).hexdigest() == entry["sha256"]
    graph = Graph().parse(data=data, format="turtle")
    ontology = URIRef(entry["ontology_iri"])
    assert set(graph.subjects(RDF.type, OWL.Ontology)) == {ontology}
    assert set(graph.objects(ontology, OWL.versionIRI)) == {URIRef(entry["version_iri"])}
    assert sorted(map(str, graph.objects(ontology, OWL.imports))) == sorted(entry["imports"])
    for iri in entry["imports"]:
        assert ontology_resource(iri).is_file()


def test_unversioned_iris_select_current_release_and_archive_stays_explicit():
    for module in ("core", "agents", "frames"):
        entry = current_ontology(module)
        assert (
            ontology_resource(entry["ontology_iri"]).read_bytes()
            == ontology_resource(entry["version_iri"]).read_bytes()
        )
    assert (
        ontology_resource("https://isagog.com/ontology/top").read_bytes()
        == ontology_resource("https://isagog.com/ontology/top/4.7").read_bytes()
    )
    assert ontology_resource("https://isagog.com/ontology/core/4.7") is None
    assert ontology_resource("https://example.org/missing") is None


@pytest.mark.parametrize(
    "old_module,old_version,new_module,new_version",
    [
        ("top", "4.7", "core", "5.0"),
        ("agents", "1.0", "agents", "2.0"),
        ("frame", "1.1", "frame", "2.0"),
    ],
)
def test_rename_preserves_all_axioms(old_module, old_version, new_module, new_version):
    old = Graph().parse(ROOT / f"ontologies/legacy/{old_module}/{old_version}.ttl")
    new = Graph().parse(ROOT / f"ontologies/{new_module}/{new_version}.ttl")
    transformed = Graph()
    metadata = {OWL.versionIRI, OWL.versionInfo, RDFS.label, RDFS.comment}

    def rename(term):
        if isinstance(term, URIRef):
            return URIRef(
                str(term).replace(
                    "https://isagog.com/ontology/top", "https://isagog.com/ontology/core"
                )
            )
        if isinstance(term, Literal):
            return Literal(
                str(term).replace("top:", "core:"), lang=term.language, datatype=term.datatype
            )
        return term

    # Only ontology-level release metadata and documentation may differ.
    for s, p, o in old:
        if str(s) == f"https://isagog.com/ontology/{old_module}" and p in metadata:
            continue
        # Operational definitions are documentation as well; their text stays identical.
        transformed.add((rename(s), rename(p), rename(o)))
    cleaned = Graph()
    for s, p, o in new:
        if str(s) == f"https://isagog.com/ontology/{new_module}" and p in metadata:
            continue
        if p == OWL.imports:
            o = URIRef(str(o).replace("/core/5.0", "/core/4.7"))
        cleaned.add((s, p, o))
    assert isomorphic(transformed, cleaned)
    assert not any(
        isinstance(term, URIRef) and str(term).startswith("https://isagog.com/ontology/top")
        for triple in new
        for term in triple
    )


@pytest.mark.parametrize("module", ["core", "agents", "frames"])
def test_static_alias_and_immutable_version_are_identical_complete_graphs(module):
    entry = current_ontology(module)
    assert entry["ontology_iri"] == f"https://ontology.isagog.com/{module}"
    assert entry["document_url"] == entry["ontology_iri"] + ".ttl"
    assert entry["namespace"] == entry["ontology_iri"] + "#"
    exported = run_path(str(ROOT / "scripts/export-ontologies.py"))["outputs"]()
    source = (ROOT / entry["file"]).read_bytes()
    for iri in (entry["document_url"], entry["version_iri"]):
        assert exported[ROOT / "public" / urlsplit(iri).path.lstrip("/")] == source
    assert ontology_resource(entry["document_url"]).read_bytes() == source
    page = exported[ROOT / "public" / module / "index.html"].decode()
    assert entry["document_url"] in page
    assert 'type="text/turtle"' in page


@pytest.mark.parametrize("module", ["core", "agents", "frames"])
def test_static_namespace_migration_preserves_axioms(module):
    previous = {"core": ("core", "5.0"), "agents": ("agents", "2.0"), "frames": ("frame", "2.0")}
    replacements = {}
    for current, (old, version) in previous.items():
        replacements[f"https://isagog.com/ontology/{old}"] = (
            f"https://ontology.isagog.com/{current}"
        )
        replacements[f"https://isagog.com/ontology/{old}/{version}"] = current_ontology(current)[
            "version_iri"
        ]

    def rename(term):
        if isinstance(term, URIRef):
            text = str(term)
            for old, new in sorted(replacements.items(), key=lambda item: -len(item[0])):
                if text == old or text.startswith(old + "#"):
                    return URIRef(new + text[len(old) :])
        if isinstance(term, Literal):
            return Literal(
                str(term).replace("frame:", "frames:"), lang=term.language, datatype=term.datatype
            )
        return term

    old_module, version = previous[module]
    old = Graph().parse(ROOT / f"ontologies/{old_module}/{version}.ttl")
    entry = current_ontology(module)
    new = Graph().parse(ROOT / entry["file"])
    metadata = {OWL.versionIRI, OWL.versionInfo, RDFS.label, RDFS.comment}
    transformed, actual = Graph(), Graph()
    for s, p, o in old:
        if str(s) == f"https://isagog.com/ontology/{old_module}" and p in metadata:
            continue
        transformed.add(tuple(rename(term) for term in (s, p, o)))
    for s, p, o in new:
        if str(s) == entry["ontology_iri"] and p in metadata:
            continue
        actual.add((s, p, o))
    assert isomorphic(transformed, actual)
    assert not any(
        isinstance(term, URIRef) and str(term).startswith("https://isagog.com/ontology/")
        for triple in new
        for term in triple
    )
