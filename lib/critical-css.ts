/** First-paint fallback if the main stylesheet is late or 404s (Twitter in-app, 404.html). */
export const CRITICAL_CSS = `
html,body{background:#0b0b0b;color:#ffffff;margin:0}
body{min-height:100%;display:flex;flex-direction:column}
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.sr-only:focus,.sr-only:focus-visible{position:absolute;width:auto;height:auto;margin:0;overflow:visible;clip:auto;white-space:nowrap;left:1rem;top:1rem;z-index:100;border-radius:999px;background:#3bb8b3;color:#0b0b0b;padding:.5rem .75rem}
header.header-bar{position:sticky;top:0;z-index:50;background:#0b0b0b}
header.header-bar .header-primary{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:center;gap:.25rem;max-width:80rem;margin-inline:auto;padding:.5rem .75rem}
.site-logo-link{display:inline-flex;align-items:center;flex-shrink:0}
.site-logo-mark,header.header-bar img{max-height:64px;height:64px;width:auto;object-fit:contain}
`.replace(/\s+/g, " ").trim();
