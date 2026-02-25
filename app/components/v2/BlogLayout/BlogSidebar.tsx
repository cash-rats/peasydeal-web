import { Link } from "react-router";
import { cn } from "~/lib/utils";

/* ------------------------------------------------------------------ */
/*  Social Icons                                                       */
/* ------------------------------------------------------------------ */

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="18" cy="6" r="1.5" fill="currentColor" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 4L10.5 12.5L4 20H6L12 14L17 20H21L14 11L20 4H18L12.5 9.5L8 4H4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M18 2H15C13.3431 2 12 3.34315 12 5V8H9V12H12V22H16V12H19L20 8H16V5C16 4.44772 16.4477 4 17 4H20V2H18Z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Latest Posts Widget                                                 */
/* ------------------------------------------------------------------ */

export interface LatestPost {
  slug: string;
  title: string;
  featuredImage?: string;
  publishDate?: string;
}

export interface BlogSidebarProps {
  latestPosts?: LatestPost[];
  className?: string;
}

export function BlogSidebar({ latestPosts, className }: BlogSidebarProps) {
  return (
    <aside className={cn("space-y-8", className)}>
      {/* Latest Posts */}
      {latestPosts && latestPosts.length > 0 && (
        <div>
          <h3 className="font-body text-sm font-semibold uppercase tracking-[1px] text-black mb-5 pb-3 border-b-2 border-black">
            Latest Posts
          </h3>
          <div className="space-y-0">
            {latestPosts.slice(0, 6).map((post) => {
              const formattedDate = post.publishDate
                ? new Date(post.publishDate).toLocaleDateString("en-GB", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : undefined;

              return (
                <Link
                  key={post.slug}
                  to={`/blog/post/${post.slug}`}
                  className="flex gap-3.5 py-3.5 border-b border-[#F0F0F0] group cursor-pointer"
                >
                  {post.featuredImage && (
                    <img
                      src={post.featuredImage}
                      alt=""
                      className="w-[72px] h-[72px] rounded-rd-sm object-cover flex-shrink-0 bg-rd-bg-card"
                      loading="lazy"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="font-body text-[13px] font-medium text-black leading-snug line-clamp-2 group-hover:underline">
                      {post.title}
                    </p>
                    {formattedDate && (
                      <p className="font-body text-[11px] text-rd-text-muted mt-1">
                        {formattedDate}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Follow Us */}
      <div className="p-6 bg-rd-bg-card rounded-rd-md">
        <h3 className="font-body text-sm font-semibold uppercase tracking-[1px] text-black mb-4">
          Follow Us
        </h3>
        <div className="flex gap-4">
          {[
            { icon: <InstagramIcon />, href: "https://www.instagram.com/peasydeal/", label: "Instagram" },
            { icon: <TwitterIcon />, href: "https://twitter.com/peasydeal", label: "Twitter" },
            { icon: <FacebookIcon />, href: "https://www.facebook.com/peasydeal", label: "Facebook" },
          ].map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              aria-label={social.label}
              className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-[#333] hover:scale-105 transition-all duration-fast"
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
