import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import { MediaWrapper } from "@/components/MediaWrapper";
import { ProTip } from "@/components/ProTip";
import { Spoiler } from "@/components/Spoiler";
import { extractHeadings, splitContent } from "@/lib/content";
import { slugify } from "@/lib/format";

type ArticleBodyProps = {
  markdown: string;
};

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
};

export function ArticleBody({ markdown }: ArticleBodyProps) {
  const blocks = splitContent(markdown);

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
