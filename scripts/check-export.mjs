import { existsSync } from "node:fs";
import { join } from "node:path";

// Next (output: "export") writes the static site to ./out. Every route must
// exist in both locales; a missing one would 404 on GitHub Pages.
const OUT = "out";
const LOCALES = ["it", "en"];
const ROUTES = [""];

const problems = [];
for (const locale of LOCALES) {
  for (const route of ROUTES) {
    const file = join(OUT, locale, route, "index.html");
    if (!existsSync(file)) problems.push(`missing ${file}`);
  }
}
if (!existsSync(join(OUT, "index.html"))) problems.push(`missing ${join(OUT, "index.html")}`);

if (problems.length > 0) {
  console.error(`check-export: ${problems.length} problem(s):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}
console.error("check-export: ok");
