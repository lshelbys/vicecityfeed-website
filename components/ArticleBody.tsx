import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import { ArticleFigure } from "@/components/ArticleFigure";
import { MediaWrapper } from "@/components/MediaWrapper";
import { ProTip } from "@/components/ProTip";
import { Spoiler } from "@/components/Spoiler";
import { extractHeadings, splitContent } from "@/lib/content";
import { slugify } from "@/lib/format";
import type { CoverAccent, CoverScene } from "@/lib/types";

type ArticleBodyProps = {
  markdown: string;
  figure?: {
    accent: CoverAccent;
    scene?: CoverScene;
    title: string;
    caption: string;
    kind?: string;
  };
};

function splitFirstParagraph(text: string): [string, string] {
  const match = text.match(/^([\s\S]+?)(\n\n[\s\S]*)$/);
  if (!match) return [text, ""];
  return [match[1], match[2]];
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
    src ? (
      // Uploaded story images are remote Storage URLs; the static export does not optimize them.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt ?? ""} data-story-image="" />
    ) : null,
};

export function ArticleBody({ markdown, figure }: ArticleBodyProps) {
  const blocks = splitContent(markdown);
  const figureIndex = figure
    ? blocks.findIndex((block) => block.type === "markdown")
    : -1;

  return (
    <div className="prose-vcf">
      {blocks.map((block, index) => {
        if (block.type === "protip") {
          return (
            <ProTip key={index}>
              <ReactMarkdown components={markdownComponents}>
                {block.text}
              </ReactMarkdown>
            </ProTip>
          );
        }
        if (block.type === "spoiler") {
          return (
            <Spoiler key={index}>
              <ReactMarkdown components={markdownComponents}>
                {block.text}
              </ReactMarkdown>
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
        if (figure && index === figureIndex) {
          const [lead, rest] = splitFirstParagraph(block.text);
          return (
            <div key={index}>
              <ReactMarkdown components={markdownComponents}>{lead}</ReactMarkdown>
              <ArticleFigure
                accent={figure.accent}
                scene={figure.scene}
                title={figure.title}
                caption={figure.caption}
                kind={figure.kind}
              />
              {rest ? (
                <ReactMarkdown components={markdownComponents}>{rest}</ReactMarkdown>
              ) : null}
            </div>
          );
        }

        return (
          <ReactMarkdown key={index} components={markdownComponents}>
            {block.text}
          </ReactMarkdown>
        );
      })}
    </div>
  );
}

export function articleHeadings(markdown: string) {
  return extractHeadings(markdown);
}
