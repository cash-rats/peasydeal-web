/**
 * Shared v2 Contentful rich-text renderers for static pages.
 *
 * Provides consistent typography aligned with the redesign design system:
 * - font-heading / font-body families
 * - rd-* color tokens
 * - redesign-* breakpoints
 */
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import { Link } from "react-router";
import { cn } from "~/lib/utils";

/* ------------------------------------------------------------------ */
/*  Rich-text node renderers                                           */
/* ------------------------------------------------------------------ */

const renderNode = {
  [BLOCKS.PARAGRAPH]: (_node: any, children: any) => (
    <p className="font-body text-[15px] leading-relaxed text-rd-text-body">
      {children}
    </p>
  ),
  [BLOCKS.HEADING_1]: (_node: any, children: any) => (
    <h2 className="font-heading text-2xl font-bold text-black redesign-sm:text-3xl">
      {children}
    </h2>
  ),
  [BLOCKS.HEADING_2]: (_node: any, children: any) => (
    <h3 className="font-heading text-xl font-bold text-black redesign-sm:text-2xl">
      {children}
    </h3>
  ),
  [BLOCKS.HEADING_3]: (_node: any, children: any) => (
    <h4 className="font-heading text-lg font-bold text-black">{children}</h4>
  ),
  [BLOCKS.UL_LIST]: (_node: any, children: any) => (
    <ul className="list-disc space-y-1.5 pl-6 font-body text-[15px] leading-relaxed text-rd-text-body">
      {children}
    </ul>
  ),
  [BLOCKS.OL_LIST]: (_node: any, children: any) => (
    <ol className="list-decimal space-y-1.5 pl-6 font-body text-[15px] leading-relaxed text-rd-text-body">
      {children}
    </ol>
  ),
  [BLOCKS.LIST_ITEM]: (_node: any, children: any) => (
    <li className="font-body text-[15px] leading-relaxed text-rd-text-body">
      {children}
    </li>
  ),
  [BLOCKS.QUOTE]: (_node: any, children: any) => (
    <blockquote className="border-l-[3px] border-black bg-rd-bg-card px-5 py-4 font-body text-[15px] leading-relaxed text-rd-text-body italic">
      {children}
    </blockquote>
  ),
  [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
    const url = node?.data?.target?.fields?.file?.url;
    if (!url) return null;
    return (
      <div className="w-full py-2">
        <img
          src={url}
          alt=""
          className="w-full rounded-rd-md"
          loading="lazy"
        />
      </div>
    );
  },
  [INLINES.HYPERLINK]: (node: any, children: any) => {
    const uri = node?.data?.uri || "#";
    // Internal links use <Link>
    if (
      uri.startsWith("/") ||
      uri.startsWith("https://peasydeal.com") ||
      uri.startsWith("https://www.peasydeal.com")
    ) {
      const path = uri
        .replace("https://peasydeal.com", "")
        .replace("https://www.peasydeal.com", "");
      return (
        <Link
          to={path}
          className="font-medium text-black underline underline-offset-2 decoration-1 hover:text-rd-text-secondary transition-colors duration-fast"
        >
          {children}
        </Link>
      );
    }
    return (
      <a
        className="font-medium text-black underline underline-offset-2 decoration-1 hover:text-rd-text-secondary transition-colors duration-fast"
        href={uri}
        target="_blank"
        rel="noreferrer"
      >
        {children}
      </a>
    );
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export interface ContentfulRichTextProps {
  document: any;
  className?: string;
}

export function ContentfulRichText({
  document,
  className,
}: ContentfulRichTextProps) {
  if (!document) return null;

  return (
    <div className={cn("space-y-5", className)}>
      {documentToReactComponents(document, { renderNode })}
    </div>
  );
}
