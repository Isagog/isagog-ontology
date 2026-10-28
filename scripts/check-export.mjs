import { existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

// Next (output: "export") writes the static site to ./out. Every route must
// exist in both locales; a missing one would 404 on GitHub Pages.
const OUT = "out";
const LOCALES = ["it", "en"];
const ROUTES = ["", "perspectives", "layers", "reasoning", "explorer"];

const problems = [];
const catalog = JSON.parse(readFileSync("catalog.json", "utf-8"));
for (const entry of catalog.ontologies) {
  const archivePath = entry.archive_path ?? `/ontology/${entry.file.replace(/^ontologies\//, "")}`;
  const paths = [join(OUT, archivePath)];
  if (new URL(entry.version_iri).hostname === "ontology.isagog.com") {
    paths.push(join(OUT, new URL(entry.version_iri).pathname));
    if (catalog.current[entry.id] === entry.version_iri) {
      paths.push(join(OUT, new URL(entry.document_url).pathname));
      const doc = join(OUT, new URL(entry.ontology_iri).pathname, "index.html");
      if (!existsSync(doc) || !readFileSync(doc, "utf-8").includes(entry.document_url)) {
        problems.push(`missing namespace documentation ${doc}`);
      }
    }
  }
  for (const file of paths) {
    if (!existsSync(file)) {
      problems.push(`missing ontology download ${file}`);
    } else if (createHash("sha256").update(readFileSync(file)).digest("hex") !== entry.sha256) {
      problems.push(`${file}: checksum differs from the authoritative catalog`);
    }
  }
}
for (const locale of LOCALES) {
  for (const route of ROUTES) {
    const file = join(OUT, locale, route, "index.html");
    if (!existsSync(file)) problems.push(`missing ${file}`);
  }
}
if (!existsSync(join(OUT, "index.html"))) problems.push(`missing ${join(OUT, "index.html")}`);

// Without JS the explorer still shows its prerendered default term.
const DEFAULT_TERM_LABEL = { it: "Atto Linguistico", en: "Speech Act" };
for (const locale of LOCALES) {
  const file = join(OUT, locale, "explorer", "index.html");
  if (existsSync(file) && !readFileSync(file, "utf-8").includes(DEFAULT_TERM_LABEL[locale])) {
    problems.push(`${file}: default term "${DEFAULT_TERM_LABEL[locale]}" not prerendered`);
  }
}

// Layer anchors: the IRI stubs on isagog.com and the main site's links
// land on /layers/#core, #agents and #frames.
for (const locale of LOCALES) {
  const file = join(OUT, locale, "layers", "index.html");
  if (!existsSync(file)) continue;
  const html = readFileSync(file, "utf-8");
  for (const anchor of ["core", "agents", "frames"]) {
    if (!html.includes(`id="${anchor}"`)) problems.push(`${file}: no id="${anchor}"`);
  }
}

// GitHub Pages reads the custom domain from out/CNAME.
const cname = join(OUT, "CNAME");
if (!existsSync(cname) || readFileSync(cname, "utf-8").trim() !== "ontology.isagog.com") {
  problems.push(`${cname}: must contain ontology.isagog.com`);
}
for (const file of ["sitemap.xml", "robots.txt"]) {
  if (!existsSync(join(OUT, file))) problems.push(`missing ${join(OUT, file)}`);
}
const sitemapFile = join(OUT, "sitemap.xml");
if (existsSync(sitemapFile)) {
  const sitemapXml = readFileSync(sitemapFile, "utf-8");
  for (const locale of LOCALES) {
    for (const route of ROUTES) {
      const url = `https://ontology.isagog.com/${locale}/${route ? `${route}/` : ""}`;
      if (!sitemapXml.includes(`<loc>${url}</loc>`)) problems.push(`sitemap.xml: no ${url}`);
    }
  }
}

if (problems.length > 0) {
  console.error(`check-export: ${problems.length} problem(s):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}
console.error("check-export: ok");
