import {
  type LinksFunction,
  type MetaFunction,
  useLoaderData,
  Link,
} from 'react-router';
import httpStatus from 'http-status-codes';
import { VscArrowLeft } from 'react-icons/vsc';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import { Button } from '~/components/ui/button';
import type { TContentfulPost } from '~/shared/types';

import { getRootFBSEO_V2, getCanonicalDomain } from '~/utils/seo';

import { fetchContentfulWithSlug, fetchContentfulLatestPosts } from '~/routes/blog/api';
import styles from '~/routes/blog/styles/blog.css?url';
import FollowUs from '~/routes/blog/components/FollowUs';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

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
    const latest = await fetchContentfulLatestPosts({ total: 6 });

    return Response.json({
      blog: res,
      latestPosts: latest,
      canonicalLink: `${getCanonicalDomain()}/blog/post/${blog}`,
    });
  } catch (e) {
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


// Create a bespoke renderOptions object to target BLOCKS.EMBEDDED_ENTRY (linked block entries e.g. code blocks)
// INLINES.EMBEDDED_ENTRY (linked inline entries e.g. a reference to another blog post)
// and BLOCKS.EMBEDDED_ASSET (linked assets e.g. images)

function renderOptions() {
  // ref: https://www.contentful.com/blog/rendering-linked-assets-entries-in-contentful/
  return {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: (node: any, next: any) => {
        // render the asset accordingly
        return (
          <div className="w-full flex justify-center py-4 mb-4">
            <img src={node?.data?.target?.fields?.file?.url} alt="My image alt text" />
          </div>
        );
      },
      [INLINES.HYPERLINK]: ({ data }: any, children: any) => {
        if (data.uri.startsWith('https://peasydeal.com') || data.uri.startsWith('https://www.peasydeal.com')) {
          // trim the uri to remove the domain
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
  const { blog: post, latestPosts } = useLoaderData<LoaderData>();
  const nodes = documentToReactComponents(post.body, renderOptions()) || [];

  return (
    <div className="w-full p-4 md:px-10 md:py-8 max-w-screen-xl mx-auto bg-white">
      <div className="peasydeal-blog pt-4">
        <div id="primary" className="content-area with-sidebar">
          { /* button to previous page */}

          <Button asChild variant="ghost" size="lg" className="border-0 px-1">
            <Link to="/blog">
              <span className="mr-2 inline-flex rounded-full bg-muted px-2 py-1">
                <VscArrowLeft />
              </span>
              <span className="font-lg underline">Latest posts</span>
            </Link>
          </Button>

          <div className="mt-4 text-[#666]">
            <time className="font-poppins font-medium" dateTime={post.publishedDate}>
              {
                // format the date to MM, DD, YYYY
                new Date(post.publishedDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              }
            </time>
          </div>
          <h1 className="font-poppins font-bold text-[32px] md:text-[48px] lg:text-[68px] mt-2 md:mt-4">
            {post.postName}
          </h1>

          <div className="my-4 flex-wrap flex-direction">
            {post.tags.map((tag: any) => (
              <span
                key={`tags_${tag}`}
                className="mr-2 mb-2 inline-flex items-center rounded-2xl border border-green-500 px-3 py-2 text-sm font-semibold text-green-700"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="peasydeal-blog pt-4">
            {nodes}
          </div>
        </div>

        <div id="secondary" className="widget-area sidebar" role="complementary">
          <h3 className="pb-2 font-poppins border-b-4 border-[#000]">Latest posts</h3>
          <div className="flex flex-col">
            {latestPosts.map((latestPost: any) => (
              <Link to={`/blog/post/${latestPost.slug}`} key={`latest_post_${latestPost.slug}`}>
                <div className="flex flex-row items-center py-2">
                  <div className="w-1/3">
                    <img src={latestPost.featuredImage?.url} alt={latestPost.featuredImage?.fileName} className="rounded-xl" />
                  </div>
                  <div className="w-2/3 pl-3">
                    <span className="font-poppins font-medium text-[#333] text-base mb-2">
                      {latestPost.postName}
                    </span>
                    <div className="text-[12px] ">
                      <time className="font-poppins" dateTime={latestPost.publishedDate}>
                        {
                          // format the date to MM, DD, YYYY
                          new Date(latestPost.publishedDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        }
                      </time>
                    </div>
                  </div>

                </div>
              </Link>
            ))}
          </div>

          <FollowUs />
        </div>
      </div>

    </div>
  );
}
