import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import type { LinksFunction, V2_MetaFunction } from '@remix-run/node';
import type { LoaderFunction } from "@remix-run/node";
import httpStatus from 'http-status-codes';
import { Button, Badge } from '@chakra-ui/react';
import { VscArrowLeft } from "react-icons/vsc";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import type { TContentfulPost } from '~/shared/types';

import { getRootFBSEO_V2 } from '~/utils/seo';

import { fetchContentfulWithSlug, fetchContentfulLatestPosts } from "../api";
import styles from '../styles/blog.css';
import FollowUs from "../components/FollowUs";

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

interface IBlogPostDataProps {
  blog: TContentfulPost,
  latestPosts: TContentfulPost[],
}

export const meta: V2_MetaFunction = ({ data }: { data: IBlogPostDataProps }) => {
  const contentfulFields = data || {};

  console.log('contentfulFields', contentfulFields)
  return getRootFBSEO_V2()
    .map(tag => {
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
    });
};

interface IBlog {
  blog: TContentfulPost,
  latestPosts: TContentfulPost[],
}

export const loader: LoaderFunction = async ({ params }) => {
  try {
    const { blog = '' } = params;
    const res = await fetchContentfulWithSlug({ slug: blog });
    const latest = await fetchContentfulLatestPosts({ total: 6 });

    return json<IBlog>({
      blog: res,
      latestPosts: latest,
    });
  } catch (e) {
    console.error(e);

    throw json(e, {
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}


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
  const { blog: post, latestPosts } = useLoaderData();
  const nodes = documentToReactComponents(post.body, renderOptions()) || [];

  return (
    <div className="w-full p-4 md:px-10 md:py-8 max-w-screen-xl mx-auto bg-white">
      <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
      <div className="peasydeal-blog pt-4">
        <div id="primary" className="content-area with-sidebar">
          { /* button to previous page */}

          <Link to="/blog">
            <Button
              variant="ghost"
              leftIcon={<VscArrowLeft />}
              size='lg'
              className="border-0 px-2"
            >
              <span className="font-lg underline pb-1">Latest posts</span>
            </Button>
          </Link>

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

          <div className="flex-wrap flex-direction my-4">
            {post.tags.map((tag: any) => (
              <Badge className="mr-2 mb-2 py-2 px-3 rounded-2xl" key={`tags_${tag}`} colorScheme='green'>{tag}</Badge>
            ))}
          </div>
          <div className="peasydeal-blog pt-4">
            {nodes}
          </div>
        </div>

        <div id="secondary" className="widget-area sidebar" role="complementary">
          <h3 className="pb-2 font-poppins border-b-4 border-[#000]">Latest posts</h3>
          <div className="flex flex-col">
            {latestPosts.map((post: any) => (
              <Link to={`/blog/post/${post.slug}`} key={`latest_post_${post.slug}`}>
                <div className="flex flex-row items-center py-2">
                  <div className="w-1/3">
                    <img src={post.featuredImage?.url} alt={post.featuredImage?.fileName} className="rounded-xl" />
                  </div>
                  <div className="w-2/3 pl-3">
                    <span className="font-poppins font-medium text-[#333] text-base mb-2">
                      {post.postName}
                    </span>
                    <div className="text-[12px] ">
                      <time className="font-poppins" dateTime={post.publishedDate}>
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
