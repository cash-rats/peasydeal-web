import { Link } from "react-router";
import { cn } from "~/lib/utils";
import { Badge } from "~/components/v2/Badge/Badge";

export interface BlogPostCardProps {
  slug: string;
  title: string;
  excerpt?: string;
  featuredImage?: string;
  tags?: string[];
  publishDate?: string;
  className?: string;
}

export function BlogPostCard({
  slug,
  title,
  excerpt,
  featuredImage,
  tags,
  publishDate,
  className,
}: BlogPostCardProps) {
  const formattedDate = publishDate
    ? new Date(publishDate).toLocaleDateString("en-GB", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : undefined;

  return (
    <Link to={`/blog/post/${slug}`} className="group">
      <article
        className={cn(
          "rounded-rd-md overflow-hidden bg-white border border-[#F0F0F0]",
          "transition-all duration-normal cursor-pointer",
          "hover:shadow-card-hover hover:-translate-y-0.5",
          className
        )}
      >
        {/* Image */}
        {featuredImage && (
          <div className="overflow-hidden">
            <img
              src={featuredImage}
              alt=""
              className="w-full aspect-[16/10] object-cover bg-rd-bg-card transition-transform duration-slow group-hover:scale-[1.03]"
              loading="lazy"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-5">
          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex gap-1.5 flex-wrap mb-2.5">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="new"
                  className="!text-[10px] !px-2 !py-[3px]"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="font-heading text-lg font-bold text-black leading-snug mb-2 line-clamp-2">
            {title}
          </h3>

          {/* Excerpt */}
          {excerpt && (
            <p className="font-body text-sm text-rd-text-body leading-relaxed mb-3 line-clamp-3">
              {excerpt}
            </p>
          )}

          {/* Meta */}
          {formattedDate && (
            <p className="font-body text-xs text-rd-text-muted">
              {formattedDate}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
