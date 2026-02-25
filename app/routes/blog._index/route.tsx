import { useState, useMemo } from 'react';
import type { MetaFunction } from 'react-router';
import { useLoaderData, Link } from 'react-router';
import httpStatus from 'http-status-codes';
import { cn } from '~/lib/utils';

import { getStaticProps, fetchContentfulLatestPosts } from '~/routes/blog/api';
import blogOGImage from '~/routes/blog/images/peasydeal-blog-ogimage.jpg';
import {
  getBlogTitleText,
  getCanonicalDomain,
  getBlogFBSEO_V2,
} from '~/utils/seo';

import { Breadcrumbs } from '~/components/v2/Breadcrumbs';
import { BlogPostCard } from '~/components/v2/BlogLayout';
import { BlogPagination } from '~/components/v2/BlogLayout';
import { BlogSidebar } from '~/components/v2/BlogLayout';
import type { LatestPost } from '~/components/v2/BlogLayout';

/* ------------------------------------------------------------------ */
/*  Loader                                                             */
/* ------------------------------------------------------------------ */

type LoaderData = {
  postSummaries: any[];
  currentPage: number;
  totalPages: number;
  latestPosts: any[];
  canonicalLink: string;
};

export const loader = async () => {
  try {
    const [res, latest] = await Promise.all([
      getStaticProps({ params: { page: 1 } }),
      fetchContentfulLatestPosts({ total: 6 }),
    ]);

    return Response.json({
      postSummaries: res.postSummaries,
      currentPage: res.currentPage,
      totalPages: res.totalPages,
      latestPosts: latest,
      canonicalLink: `${getCanonicalDomain()}/blog`,
    });
  } catch (e) {
    console.error(e);
    throw Response.json(e, { status: httpStatus.INTERNAL_SERVER_ERROR });
  }
};

export const meta: MetaFunction = ({ data }) => {
  const loaderData = data as LoaderData | undefined;
  return [
    { title: getBlogTitleText() },
    { tagName: 'link', rel: 'canonical', href: loaderData?.canonicalLink },
    ...getBlogFBSEO_V2(blogOGImage),
  ];
};

/* ------------------------------------------------------------------ */
/*  Hero Featured Post                                                 */
/* ------------------------------------------------------------------ */

function BlogHeroPost({ post }: { post: any }) {
  const formattedDate = post.publishedDate
    ? new Date(post.publishedDate).toLocaleDateString('en-GB', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : undefined;

  return (
    <Link
      to={`/blog/post/${post.slug}`}
      className="group block relative w-full rounded-rd-lg overflow-hidden mb-12"
    >
      <div className="aspect-[16/7] max-redesign-sm:aspect-[4/3]">
        {post.featuredImage?.url && (
          <img
            src={post.featuredImage.url}
            alt=""
            className="w-full h-full object-cover transition-transform duration-slow group-hover:scale-[1.02]"
          />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-8 redesign-md:p-12 z-10">
        {formattedDate && (
          <p className="font-body text-sm text-white/80 mb-2">
            {formattedDate}
          </p>
        )}
        <h2 className="font-heading text-[28px] redesign-md:text-[40px] font-bold text-white leading-tight mb-4 max-w-[600px]">
          {post.postName}
        </h2>
        <span className="inline-flex items-center px-6 py-2.5 bg-white text-black font-body text-sm font-medium rounded-full group-hover:bg-[#F0F0F0] transition-colors duration-fast">
          Learn More
        </span>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Category Filter Tabs                                               */
/* ------------------------------------------------------------------ */

function CategoryTabs({
  tags,
  activeTag,
  onSelect,
}: {
  tags: string[];
  activeTag: string | null;
  onSelect: (tag: string | null) => void;
}) {
  return (
    <div className="flex items-center gap-6 mb-10 overflow-x-auto pb-1">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={cn(
          'font-body text-sm whitespace-nowrap pb-1 border-b-2 transition-colors duration-fast bg-transparent cursor-pointer px-0',
          activeTag === null
            ? 'font-semibold text-black border-black'
            : 'font-normal text-rd-text-secondary border-transparent hover:text-black'
        )}
      >
        All posts
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => onSelect(tag)}
          className={cn(
            'font-body text-sm whitespace-nowrap pb-1 border-b-2 transition-colors duration-fast bg-transparent cursor-pointer px-0',
            activeTag === tag
              ? 'font-semibold text-black border-black'
              : 'font-normal text-rd-text-secondary border-transparent hover:text-black'
          )}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function BlogIndex() {
  const {
    postSummaries,
    currentPage,
    totalPages,
    latestPosts: latestPostsRaw,
  } = useLoaderData<LoaderData>();

  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Extract unique tags for filter tabs
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    postSummaries.forEach((post: any) => {
      (post.tags ?? []).forEach((tag: string) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [postSummaries]);

  // Featured post = first post
  const featuredPost = postSummaries[0];
  const remainingPosts = postSummaries.slice(1);

  // Filter posts by active tag (client-side within current page)
  const filteredPosts = useMemo(() => {
    if (!activeTag) return remainingPosts;
    return remainingPosts.filter((post: any) =>
      (post.tags ?? []).includes(activeTag)
    );
  }, [remainingPosts, activeTag]);

  // Map latest posts for sidebar
  const sidebarLatestPosts: LatestPost[] = useMemo(
    () =>
      (latestPostsRaw || []).map((p: any) => ({
        slug: p.slug,
        title: p.postName,
        featuredImage: p.featuredImage?.url,
        publishDate: p.publishedDate,
      })),
    [latestPostsRaw]
  );

  const breadcrumbs = useMemo(
    () => [{ label: 'Home', href: '/' }, { label: 'Our Journey' }],
    []
  );

  return (
    <div className="v2 max-w-[var(--container-max)] mx-auto px-4 redesign-sm:px-6 redesign-md:px-12 py-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbs} className="mb-4" />

      {/* Page title */}
      <h1 className="font-heading text-hero font-bold text-black text-center mb-10 max-redesign-sm:text-[32px]">
        Our Journey
      </h1>

      {/* Hero featured post */}
      {featuredPost && <BlogHeroPost post={featuredPost} />}

      {/* Category filter tabs */}
      {allTags.length > 0 && (
        <CategoryTabs
          tags={allTags}
          activeTag={activeTag}
          onSelect={setActiveTag}
        />
      )}

      {/* Content area with sidebar */}
      <div className="flex gap-12">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Post grid */}
          <div className="grid grid-cols-1 redesign-sm:grid-cols-2 redesign-md:grid-cols-3 gap-6">
            {filteredPosts.map((post: any) => (
              <BlogPostCard
                key={post.sys?.id ?? post.slug}
                slug={post.slug}
                title={post.postName}
                excerpt={post.excerpt}
                featuredImage={post.featuredImage?.url}
                tags={post.tags}
                publishDate={post.publishedDate}
              />
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <p className="font-body text-sm text-rd-text-secondary text-center py-12">
              No posts found for this category.
            </p>
          )}

          {/* Pagination — only when showing all posts (no tag filter) */}
          {!activeTag && (
            <BlogPagination
              currentPage={Number(currentPage)}
              totalPages={Number(totalPages)}
            />
          )}
        </div>

        {/* Sidebar — hidden on mobile */}
        <div className="hidden redesign-md:block w-[280px] flex-shrink-0">
          <BlogSidebar latestPosts={sidebarLatestPosts} />
        </div>
      </div>
    </div>
  );
}
