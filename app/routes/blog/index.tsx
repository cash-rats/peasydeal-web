import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { LinksFunction, V2_MetaFunction } from '@remix-run/node';
import type { LoaderFunction } from "@remix-run/node";
import httpStatus from 'http-status-codes';
import type { DynamicLinksFunction } from 'remix-utils';
import type { IBlogStaticProps } from '~/shared/types';
import { getStaticProps } from "./api";
import BlogLayout from "./components/BlogLayout";
import gradientBg from './images/gradient-bg.jpg';
import blogOGImage from './images/peasydeal-blog-ogimage.jpg';
import {
  getBlogTitleText,
  getCanonicalDomain,
  getBlogFBSEO_V2,
} from '~/utils/seo';

import styles from './styles/blog.css';

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

export const loader: LoaderFunction = async () => {
  try {
    const res = await getStaticProps({ params: { page: 1 } });

    return json<{
      blogs: IBlogStaticProps,
      canonicalLink: string,
    }>({
      blogs: res,
      canonicalLink: `${getCanonicalDomain()}/blog/page/1`
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
      <div className="text-center px-4 py-10 mb-6" style={{
        backgroundImage: `url(${gradientBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        <h1 className="font-bold font-poppins text-[48px] lg:text-[72px]">
          PEASY<span className="text-[#d02e7d]">DEAL</span> BLOG
        </h1>
        <h3 className="font-medium text-xl">
          Quality you can trust, prices you can afford. Signature Selection of trendy deal.
        </h3>
      </div>

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
