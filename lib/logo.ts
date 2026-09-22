import { existsSync } from "node:fs";
import { join } from "node:path";
import { LOGO_PNG, LOGO_SVG } from "@/lib/logo-paths";

export { LOGO_PNG, LOGO_SVG };

export const LOGO_FILE_PNG = join(process.cwd(), "public/images/logo.png");
export const LOGO_FILE_SVG = join(process.cwd(), "public/images/logo.svg");

export function hasLogoSvg() {
  return existsSync(LOGO_FILE_SVG);
}

export function getLogoSrc() {
  return hasLogoSvg() ? LOGO_SVG : LOGO_PNG;
}
