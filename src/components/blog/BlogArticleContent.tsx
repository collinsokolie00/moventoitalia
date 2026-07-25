import type { ReactNode } from "react";

function safeLink(value: string) {
  return /^(https?:\/\/|mailto:|tel:|\/)/i.test(value) ? value : null;
}

function safeImage(value: string) {
  return /^https:\/\//i.test(value) ? value : null;
}

function renderInline(value: string): ReactNode[] {
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  const parts = value.split(pattern).filter(Boolean);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*")) return <em key={index}>{part.slice(1, -1)}</em>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const href = safeLink(link[2]);
      return href ? <a key={index} href={href} className="font-semibold text-blue-700 underline decoration-blue-200 underline-offset-4 hover:text-blue-900">{link[1]}</a> : <span key={index}>{link[1]}</span>;
    }
    return part;
  });
}

export default function BlogArticleContent({ content }: { content: string }) {
  const blocks: ReactNode[] = [];
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  let paragraph: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push(<p key={`p-${blocks.length}`}>{renderInline(paragraph.join(" "))}</p>);
    paragraph = [];
  };
  const flushList = () => {
    if (!list) return;
    const items = list.items.map((item, index) => <li key={index}>{renderInline(item)}</li>);
    blocks.push(list.ordered ? <ol key={`ol-${blocks.length}`}>{items}</ol> : <ul key={`ul-${blocks.length}`}>{items}</ul>);
    list = null;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }
    const image = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (image) {
      flushParagraph();
      flushList();
      const src = safeImage(image[2]);
      if (src) blocks.push(<figure key={`image-${blocks.length}`}>
        {/* eslint-disable-next-line @next/next/no-img-element -- CMS images can use any validated HTTPS host. */}
        <img src={src} alt={image[1]} loading="lazy" />
        <figcaption>{image[1]}</figcaption>
      </figure>);
      continue;
    }
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      const children = renderInline(heading[2]);
      if (heading[1].length === 1) blocks.push(<h2 key={`h-${blocks.length}`}>{children}</h2>);
      else if (heading[1].length === 2) blocks.push(<h2 key={`h-${blocks.length}`}>{children}</h2>);
      else blocks.push(<h3 key={`h-${blocks.length}`}>{children}</h3>);
      continue;
    }
    if (line.startsWith("> ")) {
      flushParagraph();
      flushList();
      blocks.push(<blockquote key={`quote-${blocks.length}`}>{renderInline(line.slice(2))}</blockquote>);
      continue;
    }
    const unordered = line.match(/^[-*]\s+(.+)$/);
    const ordered = line.match(/^\d+\.\s+(.+)$/);
    if (unordered || ordered) {
      flushParagraph();
      const isOrdered = Boolean(ordered);
      if (list && list.ordered !== isOrdered) flushList();
      list ??= { ordered: isOrdered, items: [] };
      list.items.push((ordered ?? unordered)![1]);
      continue;
    }
    flushList();
    paragraph.push(line);
  }
  flushParagraph();
  flushList();

  return <div className="max-w-none text-lg leading-8 [&_a]:text-blue-700 [&_blockquote]:my-8 [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:bg-blue-50 [&_blockquote]:px-6 [&_blockquote]:py-4 [&_figcaption]:mt-2 [&_figcaption]:text-center [&_figcaption]:text-sm [&_figcaption]:text-slate-500 [&_figure]:my-10 [&_h2]:mb-5 [&_h2]:mt-12 [&_h2]:text-3xl [&_h2]:font-extrabold [&_h2]:tracking-tight [&_h2]:text-slate-950 [&_h3]:mb-4 [&_h3]:mt-10 [&_h3]:text-2xl [&_h3]:font-extrabold [&_h3]:text-slate-950 [&_img]:w-full [&_img]:rounded-3xl [&_li]:my-2 [&_li]:text-slate-700 [&_ol]:my-6 [&_ol]:list-decimal [&_ol]:pl-7 [&_p]:my-6 [&_p]:text-slate-700 [&_ul]:my-6 [&_ul]:list-disc [&_ul]:pl-7">{blocks}</div>;
}
