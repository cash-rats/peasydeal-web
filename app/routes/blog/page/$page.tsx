import { json } from "@remix-run/node";
import { useLoaderData } from "react-router";
import type { LinksFunction, V2_MetaFunction } from '@remix-run/node';
import type { LoaderFunction } from "@remix-run/node";
import type { DynamicLinksFunction } from 'remix-utils';
import httpStatus from 'http-status-codes';
import type { IBlogStaticProps } from '~/shared/types';

import { getStaticProps } from "../api";
import BlogLayout from "../components/BlogLayout";
import blogOGImage from '../images/peasydeal-blog-ogimage.jpg';

import {
  getBlogTitleText,
  getCanonicalDomain,
  getBlogFBSEO_V2,
} from '~/utils/seo';

import styles from '../styles/blog.css?url';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

type LoaderType = {
  canonicalLink: string;
};

export const meta: V2_MetaFunction = () => {
  return [
    {
      title: getBlogTitleText(),
    },
    ...getBlogFBSEO_V2(blogOGImage),
  ]
}

const dynamicLinks: DynamicLinksFunction<LoaderType> = ({ data }) => {
  return [
    {
      rel: 'canonical', href: data?.canonicalLink,
    },
  ];
}

export const handle = { dynamicLinks };

export const loader: LoaderFunction = async ({ params }) => {
  try {
    const { page = '1' } = params;
    const res = await getStaticProps({ params: { page: parseInt(page) } });

    return json<{
      blogs: IBlogStaticProps
      canonicalLink: string,
    }>({
      blogs: res,
      canonicalLink: `${getCanonicalDomain()}/blog/page/${parseInt(page)}`
    });
  } catch (e) {
    console.error(e);

    throw json(e, {
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}

export default function BlogIndex() {
  const { blogs: { postSummaries, currentPage, totalPages } } = useLoaderData();

  return (
    <div className="w-full p-4 md:px-10 md:py-8 max-w-screen-xl mx-auto bg-white">
      <div className="peasydeal-blog pt-4">
        <BlogLayout
          postSummaries={postSummaries}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
