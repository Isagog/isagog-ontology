"""Check live canonical ontology documents against the release catalog (stdlib only)."""

import hashlib
import json
import time
from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]


def check() -> None:
    catalog = json.loads((ROOT / "catalog.json").read_text())
    for entry in catalog["ontologies"]:
        if "archive_path" in entry:
            iri = "https://ontology.isagog.com" + entry["archive_path"]
            with urlopen(iri, timeout=15) as response:
                assert response.status == 200, iri
                assert response.headers.get_content_type() == "text/turtle", iri
                assert hashlib.sha256(response.read()).hexdigest() == entry["sha256"], iri
                print(f"{iri}: archived download unchanged", flush=True)
        if entry["status"] != "current":
            continue
        for iri in (entry["document_url"], entry["version_iri"]):
            with urlopen(Request(iri, headers={"Accept": "text/turtle"}), timeout=15) as response:
                assert response.status == 200, iri
                assert response.headers.get_content_type() == "text/turtle", iri
                assert hashlib.sha256(response.read()).hexdigest() == entry["sha256"], iri
                print(f"{iri}: HTTP 200, text/turtle, checksum OK", flush=True)
        with urlopen(entry["ontology_iri"], timeout=15) as response:
            assert response.status == 200, entry["ontology_iri"]
            assert response.headers.get_content_type() == "text/html"
            assert entry["document_url"] in response.read().decode()
            print(f"{entry['ontology_iri']}: HTML documentation OK", flush=True)


if __name__ == "__main__":
    for attempt in range(5):
        try:
            check()
            break
        except (OSError, AssertionError):
            if attempt == 4:
                raise
            time.sleep(5)
