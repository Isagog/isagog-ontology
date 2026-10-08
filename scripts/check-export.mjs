import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

// Next (output: "export") writes the static site to ./out. Every route must
// exist in both locales; a missing one would 404 on GitHub Pages.
const OUT = "out";
const LOCALES = ["it", "en"];
const ROUTES = ["", "explorer"];

const problems = [];
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

if (problems.length > 0) {
  console.error(`check-export: ${problems.length} problem(s):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}
console.error("check-export: ok");
