import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const rows = [];
function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
    const path = join(dir, entry.name);
    if (entry.name.startsWith("@")) {
      walk(path);
      continue;
    }
    try {
      const p = JSON.parse(readFileSync(join(path, "package.json"), "utf8"));
      rows.push({
        name: p.name,
        version: p.version,
        license: p.license || "UNDECLARED",
      });
    } catch {
      /* directories without manifests */
    }
  }
}
walk("node_modules");
rows.sort((a, b) => a.name.localeCompare(b.name));
writeFileSync(
  "qa/dependency-licenses.json",
  JSON.stringify(rows, null, 2) + "\n",
);
const unknown = rows.filter((p) => p.license === "UNDECLARED");
console.log(
  `${rows.length} installed package licenses recorded; ${unknown.length} undeclared.`,
);
if (unknown.length) {
  console.log(unknown);
  process.exitCode = 1;
}
