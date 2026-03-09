import {
  type MetaFunction,
  useLoaderData,
  Link,
  redirect,
} from 'react-router';
import httpStatus from 'http-status-codes';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import type { TContentfulPost } from '~/shared/types';

import { getRootFBSEO_V2, getCanonicalDomain } from '~/utils/seo';

import { fetchContentfulWithSlug, fetchContentfulLatestPosts } from '~/routes/blog/api';
import { BlogArticle } from '~/components/v2/BlogPost';
import { BlogSidebar } from '~/components/v2/BlogLayout';
import type { LatestPost } from '~/components/v2/BlogLayout';

interface IBlogPostDataProps {
  blog: TContentfulPost;
  latestPosts: TContentfulPost[];
  canonicalLink: string;
}

type LoaderData = IBlogPostDataProps;

export const loader = async ({ params }: { params: Record<string, string | undefined> }) => {
  try {
    const { blog = '' } = params;
    const res = await fetchContentfulWithSlug({ slug: blog });

    if (!res) {
      throw redirect('/blog');
    }

    const latest = await fetchContentfulLatestPosts({ total: 6 });

    return Response.json({
      blog: res,
      latestPosts: latest,
      canonicalLink: `${getCanonicalDomain()}/blog/post/${blog}`,
    });
  } catch (e) {
    if (e instanceof Response) throw e;
    console.error(e);

    throw Response.json(e, {
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const contentfulFields = (data || {}) as IBlogPostDataProps;

  return [
    { tagName: 'link', rel: 'canonical', href: data?.canonicalLink },
    ...getRootFBSEO_V2()
      .map((tag) => {
        if (!('property' in tag)) return tag;

        if (tag.property === 'og:title') {
          tag.content = contentfulFields?.blog?.seoTitle;
        }

        if (tag.property === 'og:description') {
          tag.content = contentfulFields?.blog?.seoDesc;
        }

        if (tag.property === 'og:image') {
          tag.content = contentfulFields?.blog?.featuredImage?.fields?.file?.url;
        }

        return tag;
      })
  ];
};


// Custom Contentful rich text render options
function renderOptions() {
  return {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: (node: any, next: any) => {
        return (
          <div className="w-full flex justify-center py-4 mb-4">
            <img
              src={node?.data?.target?.fields?.file?.url}
              alt=""
              className="w-full rounded-rd-sm"
            />
          </div>
        );
      },
      [INLINES.HYPERLINK]: ({ data }: any, children: any) => {
        if (data.uri.startsWith('https://peasydeal.com') || data.uri.startsWith('https://www.peasydeal.com')) {
          const uri = data.uri.replace('https://peasydeal.com', '').replace('https://www.peasydeal.com', '');
          return <Link to={uri}>{children}</Link>
        }

        return (
          <a
            href={data.uri}
            target="_blank"
            rel="noopener noreferrer"
          >{children}</a>
        )
      }
    },
  };
}


export default function BlogPost() {
  const { blog: post, latestPosts: latestPostsRaw } = useLoaderData<LoaderData>();
  const nodes = documentToReactComponents(post.body, renderOptions()) || [];

  const latestPosts: LatestPost[] = (latestPostsRaw || []).map((p: any) => ({
    slug: p.slug,
    title: p.postName,
    featuredImage: p.featuredImage?.url,
    publishDate: p.publishedDate,
  }));

  return (
    <div className="v2 max-w-[var(--container-max)] mx-auto px-[var(--container-padding)] py-12">
      <div className="flex gap-12">
        {/* Article content */}
        <div className="flex-1 min-w-0">
          <BlogArticle
            title={post.postName}
            tags={post.tags}
            publishDate={post.publishedDate}
            featuredImage={post.featuredImage?.fields?.file?.url}
          >
            {nodes}
          </BlogArticle>
        </div>

        {/* Sidebar */}
        <div className="hidden redesign-md:block w-[280px] flex-shrink-0">
          <BlogSidebar latestPosts={latestPosts} />
        </div>
      </div>
    </div>
  );
}
