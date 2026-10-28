import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { handleRequest } from "./worker.mjs";

async function localAsset(url) {
  const path = new URL(url).pathname;
  return new Response(await readFile(new URL(`../public${path}`, import.meta.url)));
}

test("canonical version IRIs serve their exact RDF, with correct media type", async () => {
  const catalog = JSON.parse(await readFile(new URL("../catalog.json", import.meta.url)));
  for (const entry of catalog.ontologies) {
    const response = await handleRequest(new Request(entry.version_iri, {
      headers: { Accept: "text/turtle" },
    }), {}, localAsset);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("Content-Type"), /^text\/turtle/);
    assert.match(response.headers.get("Cache-Control"), /immutable/);
    const source = await readFile(new URL(`../${entry.file}`, import.meta.url), "utf8");
    assert.equal(await response.text(), source);
  }
});

test("bare IRIs select current releases and wildcard requests receive RDF", async () => {
  const response = await handleRequest(new Request("https://isagog.com/ontology/core/"), {}, localAsset);
  assert.match(await response.text(), /ontology\/core\/5\.0/);
  assert.doesNotMatch(response.headers.get("Cache-Control"), /immutable/);
});

test("browser response preserves term fragments and offers a direct RDF link", async () => {
  const response = await handleRequest(new Request("https://isagog.com/ontology/core", {
    headers: { Accept: "text/html,application/xhtml+xml,*/*;q=0.8" },
  }));
  assert.match(response.headers.get("Content-Type"), /^text\/html/);
  const body = await response.text();
  assert.match(body, /location.hash/);
  assert.match(body, /core:/);
  assert.match(body, /core\/5\.0\.ttl/);
});

test("negotiation respects preference and q=0", async () => {
  const response = await handleRequest(new Request("https://isagog.com/ontology/core", {
    headers: { Accept: "text/turtle;q=0, text/html;q=0, */*;q=1" },
  }));
  assert.equal(response.status, 406);
  const rdf = await handleRequest(new Request("https://isagog.com/ontology/core", {
    headers: { Accept: "text/html;q=0.5,text/turtle;q=1" },
  }), {}, localAsset);
  assert.match(rdf.headers.get("Content-Type"), /^text\/turtle/);
});

test("unknown versions, HEAD, conditional requests and origin failures", async () => {
  assert.equal((await handleRequest(new Request("https://isagog.com/ontology/core/4.7"))).status, 404);
  const head = await handleRequest(new Request("https://isagog.com/ontology/core/5.0", { method: "HEAD" }), {}, localAsset);
  assert.equal(head.status, 200);
  assert.equal(await head.text(), "");
  const cached = await handleRequest(new Request("https://isagog.com/ontology/core/5.0", {
    headers: { "If-None-Match": head.headers.get("ETag") },
  }));
  assert.equal(cached.status, 304);
  const failed = await handleRequest(new Request("https://isagog.com/ontology/core/5.0"), {}, async () => new Response(null, { status: 404 }));
  assert.equal(failed.status, 502);
  assert.equal(failed.headers.get("Cache-Control"), null);
  const wrong = await handleRequest(new Request("https://isagog.com/ontology/core/5.0"), {}, async () => new Response("<html>Not RDF</html>"));
  assert.equal(wrong.status, 502);
  const unreachable = await handleRequest(new Request("https://isagog.com/ontology/core/5.0"), {}, async () => { throw new Error("Network unavailable"); });
  assert.equal(unreachable.status, 502);
});
