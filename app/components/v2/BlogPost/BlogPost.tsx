import { Link } from "react-router";
import { cn } from "~/lib/utils";
import { Badge } from "~/components/v2/Badge/Badge";

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */

function BackArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  BlogArticle                                                        */
/* ------------------------------------------------------------------ */

export interface BlogArticleProps {
  title: string;
  tags?: string[];
  publishDate?: string;
  featuredImage?: string;
  /** Rich text content as React nodes (from Contentful renderer) */
  children: React.ReactNode;
  className?: string;
}

export function BlogArticle({
  title,
  tags,
  publishDate,
  featuredImage,
  children,
  className,
}: BlogArticleProps) {
  const formattedDate = publishDate
    ? new Date(publishDate).toLocaleDateString("en-GB", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : undefined;

  return (
    <article className={cn("max-w-full", className)}>
      {/* Back navigation */}
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 font-body text-sm text-rd-text-secondary hover:text-black transition-colors duration-fast mb-6"
      >
        <BackArrowIcon />
        Back to Blog
      </Link>

      {/* Header */}
      <header className="mb-8">
        {tags && tags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mb-4">
            {tags.map((tag) => (
              <Badge key={tag} variant="new">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <h1 className="font-heading text-4xl font-bold text-black leading-tight mb-4 max-redesign-sm:text-[28px]">
          {title}
        </h1>

        {formattedDate && (
          <p className="font-body text-[13px] text-rd-text-muted">
            Published {formattedDate}
          </p>
        )}
      </header>

      {/* Featured image */}
      {featuredImage && (
        <img
          src={featuredImage}
          alt=""
          className="w-full aspect-video object-cover rounded-rd-md mb-10"
          loading="lazy"
        />
      )}

      {/* Article body — prose styling */}
      <div className="blog-prose max-w-[680px]">{children}</div>
    </article>
  );
}
