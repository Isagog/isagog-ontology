// Canonical ontology IRIs on isagog.com; the static site remains on GitHub Pages.
import { routes } from "./routes.mjs";

function quality(accept, type) {
  let best = { specificity: -1, q: 0 };
  for (const part of accept.toLowerCase().split(",")) {
    const [range, ...parameters] = part.trim().split(";");
    const specificity = range === type ? 2 : range === `${type.split("/")[0]}/*` ? 1 : range === "*/*" ? 0 : -1;
    if (specificity < 0) continue;
    const parameter = parameters.find((value) => value.trim().startsWith("q="));
    const q = parameter ? Number(parameter.trim().slice(2)) : 1;
    if (specificity > best.specificity) best = { specificity, q: Number.isFinite(q) && q >= 0 && q <= 1 ? q : 0 };
  }
  return best.q;
}

export async function handleRequest(request, env = {}, fetchAsset = fetch) {
  const url = new URL(request.url);
  const explicitTurtle = url.pathname.endsWith(".ttl");
  const path = url.pathname.replace(/\/$/, "").replace(/\.ttl$/, "");
  const route = routes[`https://isagog.com${path}`];
  if (!route) return new Response("Unknown ontology or version", { status: 404 });
  if (!["GET", "HEAD"].includes(request.method)) {
    return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
  }
  const site = (env.ONTOLOGY_SITE_URL || "https://ontology.isagog.com").replace(/\/$/, "");
  const asset = `${site}${route.asset}`;
  const accept = request.headers.get("Accept") || "*/*";
  const turtle = quality(accept, "text/turtle");
  const html = quality(accept, "text/html");
  const headers = new Headers({
    Vary: "Accept",
    "Access-Control-Allow-Origin": "*",
    Link: `<${asset}>; rel="alternate"; type="text/turtle"`,
  });
  if (!explicitTurtle && html > turtle) {
    // A hash namespace's #Term never reaches the server. Preserve it in this
    // browser-only redirect, and send generic visits to the layer description.
    const layer = route.id === "top" ? "core" : route.id;
    const layers = `${site}/en/layers/#${layer}`;
    const explorer = `${site}/en/explorer/`;
    const body = `<!doctype html><html lang="en"><meta charset="utf-8"><title>Isagog ${route.id} ontology</title>
<link rel="alternate" type="text/turtle" href="${asset}">
<p><a href="${asset}">Download Turtle</a> · <a href="${layers}">Documentation</a></p>
<script>const fragment = location.hash.slice(1); location.replace(fragment ? ${JSON.stringify(explorer)} + "#" + encodeURIComponent(${JSON.stringify(layer + ":")} + decodeURIComponent(fragment)) : ${JSON.stringify(layers)});</script></html>`;
    headers.set("Content-Type", "text/html; charset=utf-8");
    headers.set("Cache-Control", "public, max-age=300");
    return new Response(request.method === "HEAD" ? null : body, { headers });
  }
  if (!explicitTurtle && turtle === 0) {
    return new Response("Available representation: text/turtle", { status: 406, headers });
  }
  headers.set("Content-Type", "text/turtle; charset=utf-8");
  headers.set("Cache-Control", route.versioned ? "public, max-age=31536000, immutable" : "public, max-age=300");
  headers.set("ETag", `"${route.sha256}"`);
  if (request.headers.get("If-None-Match") === headers.get("ETag")) {
    return new Response(null, { status: 304, headers });
  }
  // Never cache an origin failure as a successful immutable release.
  try {
    const response = await fetchAsset(asset, { method: "GET" });
    if (!response.ok) return new Response("Ontology download unavailable", { status: 502 });
    const body = await response.arrayBuffer();
    const digest = await crypto.subtle.digest("SHA-256", body);
    const checksum = Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
    if (checksum !== route.sha256) {
      return new Response("Ontology checksum mismatch", { status: 502 });
    }
    return new Response(request.method === "HEAD" ? null : body, { headers });
  } catch {
    return new Response("Ontology download unavailable", { status: 502 });
  }
}

const worker = {
  fetch(request, env) {
    return handleRequest(request, env);
  },
};

export default worker;
