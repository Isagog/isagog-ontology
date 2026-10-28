"""Public ontology resources, resolved locally without network access.

No RDF framework or private Isagog package is needed to locate a resource.
The catalog and Turtle files come from the same versioned distribution.
"""

from __future__ import annotations

import json
from importlib.resources import files
from importlib.resources.abc import Traversable
from pathlib import Path


def load_catalog() -> dict:
    """Read the bundled catalog (or the authoritative files in an editable checkout)."""
    resource = files(__package__).joinpath("catalog.json")
    if not resource.is_file():
        resource = Path(__file__).resolve().parents[2] / "catalog.json"
    return json.loads(resource.read_text(encoding="utf-8"))


def current_ontology(module: str) -> dict:
    """Return the current release of core, agents or frames; unknown modules raise KeyError."""
    catalog = load_catalog()
    version_iri = catalog["current"][module]
    return next(entry for entry in catalog["ontologies"] if entry["version_iri"] == version_iri)


def ontology_registry(module: str) -> dict[str, str]:
    """Current ontology IRI and version IRI mapped to the same resource path."""
    entry = current_ontology(module)
    keys = ("ontology_iri", "version_iri", "document_url")
    return {entry[key]: entry["file"] for key in keys if key in entry}


def ontology_resource(iri: str) -> Traversable | None:
    """Resolve an ontology/version IRI to Turtle, including explicitly archived versions.

    Unversioned IRIs select the catalog's current release. The retired top IRI
    selects its frozen 4.7 release. This does not translate terms or add mappings.
    """
    catalog = load_catalog()
    iri = iri.rstrip("/")
    selected = next((entry for entry in catalog["ontologies"] if entry["version_iri"] == iri), None)
    if selected is None:
        selected = next(
            (
                entry
                for entry in catalog["ontologies"]
                if iri in (entry["ontology_iri"], entry.get("document_url"))
                and entry["version_iri"] == catalog["current"].get(entry["id"])
            ),
            None,
        )
    if selected is None:
        return None
    relative = selected["file"].removeprefix("ontologies/")
    resource = files(__package__).joinpath("data", *relative.split("/"))
    if not resource.is_file():
        resource = Path(__file__).resolve().parents[2] / selected["file"]
    return resource
