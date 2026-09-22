import { SITE } from "@/lib/site";

type ShareLinkProps = {
  title: string;
  url: string;
};

export function shareIntentHref(title: string, url: string) {
  const canonical = url.startsWith("http") ? url : `${SITE.url}${url}`;
  const intent = new URL("https://x.com/intent/tweet");
  intent.searchParams.set("text", title);
  intent.searchParams.set("url", canonical);
  return intent.toString();
}

export function ShareLink({ title, url }: ShareLinkProps) {
  const href = shareIntentHref(title, url);

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      data-share-href={href}
      className="rounded-sm text-sm font-semibold tracking-wide text-white focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-white"
    >
      Share
    </a>
  );
}
