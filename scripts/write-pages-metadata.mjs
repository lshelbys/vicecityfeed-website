import {
  cpSync,
  existsSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "out");
const manifestPath = join(root, ".pages-export.json");

const PROTECTED = new Set([
  ".git",
  ".github",
  ".gitignore",
  ".cursor",
  ".pages-export.json",
  "AGENTS.md",
  "app",
  "components",
  "content",
  "lib",
  "scripts",
  "public",
  "node_modules",
  ".next",
  "out",
  "package.json",
  "package-lock.json",
  "next.config.ts",
  "next-env.d.ts",
  "tsconfig.json",
  "tsconfig.tsbuildinfo",
  "eslint.config.mjs",
  "postcss.config.mjs",
  "README.md",
  "_config.yml",
]);

if (!existsSync(out)) {
  console.error("out/ is missing; run next build first");
  process.exit(1);
}

writeFileSync(join(out, "CNAME"), "vicecityfeed.com\n");
writeFileSync(
  join(out, ".nojekyll"),
  "# Disable Jekyll so GitHub Pages publishes index.html and _next/ as-is.\n",
);

const logo = join(root, "public/images/logo.png");
if (existsSync(logo)) {
  cpSync(logo, join(out, "favicon.ico"));
}

if (existsSync(manifestPath)) {
  const previous = JSON.parse(readFileSync(manifestPath, "utf8"));
  if (Array.isArray(previous)) {
    for (const name of previous) {
      if (PROTECTED.has(name)) continue;
      rmSync(join(root, name), { recursive: true, force: true });
    }
  }
}

const published = [];
for (const name of readdirSync(out)) {
  if (PROTECTED.has(name)) {
    console.warn(`skipping protected name from out/: ${name}`);
    continue;
  }
  const dest = join(root, name);
  rmSync(dest, { recursive: true, force: true });
  cpSync(join(out, name), dest, { recursive: true });
  published.push(name);
}

writeFileSync(manifestPath, `${JSON.stringify(published.sort(), null, 2)}\n`);
writeFileSync(join(root, "CNAME"), "vicecityfeed.com\n");
writeFileSync(join(root, ".nojekyll"), "");
rmSync(join(root, "docs"), { recursive: true, force: true });

console.log(
  "Wrote CNAME + .nojekyll and published out/ → repo root for GitHub Pages (main /)",
);
