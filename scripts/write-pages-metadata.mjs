import { existsSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "out");

if (!existsSync(out)) {
  console.error("out/ is missing; run next build first");
  process.exit(1);
}

writeFileSync(join(out, "CNAME"), "vicecityfeed.com\n");
writeFileSync(join(out, ".nojekyll"), "");
console.log("Wrote out/CNAME (vicecityfeed.com) and out/.nojekyll");
