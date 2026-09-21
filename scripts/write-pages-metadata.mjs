import { cpSync, existsSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "out");
const docs = join(root, "docs");

if (!existsSync(out)) {
  console.error("out/ is missing; run next build first");
  process.exit(1);
}

writeFileSync(join(out, "CNAME"), "vicecityfeed.com\n");
writeFileSync(join(out, ".nojekyll"), "");

rmSync(docs, { recursive: true, force: true });
cpSync(out, docs, { recursive: true });

console.log("Wrote CNAME + .nojekyll and synced out/ → docs/ for GitHub Pages");
