import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import { MediaWrapper } from "@/components/MediaWrapper";
import { ProTip } from "@/components/ProTip";
import { Spoiler } from "@/components/Spoiler";
import { StoryImage } from "@/components/StoryImage";
import { extractHeadings, splitContent } from "@/lib/content";
import { slugify } from "@/lib/format";
import { stripCoverFromBody } from "@/lib/story-figure";

type ArticleBodyProps = {
  markdown: string;
  /** When set, body figures that match this URL are hidden (cover stays on hero/card). */
  coverImageUrl?: string;
};

function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown components={markdownComponents} urlTransform={(url) => url}>
      {children}
    </ReactMarkdown>
  );
}

const markdownComponents: Components = {
  h2: ({ children }) => {
    const text = String(children);
    return <h2 id={slugify(text)}>{children}</h2>;
  },
  h3: ({ children }) => {
    const text = String(children);
    return <h3 id={slugify(text)}>{children}</h3>;
  },
  a: ({ href, children }) => (
    <a href={href} {...(href?.startsWith("http") ? { rel: "noreferrer", target: "_blank" } : {})}>
      {children}
    </a>
  ),
  img: ({ src, alt }) =>
    src ? <StoryImage src={String(src)} alt={alt ?? ""} /> : null,
};

export function ArticleBody({ markdown, coverImageUrl }: ArticleBodyProps) {
  const cleaned = coverImageUrl
    ? stripCoverFromBody(markdown, coverImageUrl)
    : markdown;
  const blocks = splitContent(cleaned);

  return (
    <div className="prose-vcf">
      {blocks.map((block, index) => {
        if (block.type === "protip") {
          return (
            <ProTip key={index}>
              <Markdown>{block.text}</Markdown>
            </ProTip>
          );
        }
        if (block.type === "spoiler") {
          return (
            <Spoiler key={index}>
              <Markdown>{block.text}</Markdown>
            </Spoiler>
          );
        }
        if (block.type === "media") {
          return (
            <MediaWrapper
              key={index}
              caption={block.caption}
              accent={block.accent}
            />
          );
        }
        if (block.type === "figure") {
          return (
            <StoryImage
              key={index}
              src={block.src}
              alt={block.alt}
              caption={block.caption}
              align={block.align}
              size={block.size}
            />
          );
        }

        return (
          <Markdown key={index}>{block.text}</Markdown>
        );
      })}
    </div>
  );
}

export function articleHeadings(markdown: string) {
  return extractHeadings(markdown);
}
