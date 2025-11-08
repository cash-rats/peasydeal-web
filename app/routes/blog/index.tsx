import { useLoaderData } from "react-router";
import type { LinksFunction, MetaFunction } from 'react-router';
import type { LoaderFunction } from "react-router";
import httpStatus from 'http-status-codes';
import { getStaticProps } from "./api";
import BlogLayout from "./components/BlogLayout";
import gradientBg from './images/gradient-bg.jpg';
import blogOGImage from './images/peasydeal-blog-ogimage.jpg';
import {
  getBlogTitleText,
  getCanonicalDomain,
  getBlogFBSEO_V2,
} from '~/utils/seo';

import styles from './styles/blog.css?url';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

export const meta: MetaFunction<typeof loader> = ({ loaderData }) => {
  return [
    { title: getBlogTitleText() },
    ...getBlogFBSEO_V2(blogOGImage),
    { tagName: 'link', rel: 'canonical', href: loaderData?.canonicalLink },
  ]
}

export const loader: LoaderFunction = async () => {
  try {
    const res = await getStaticProps({ params: { page: 1 } });

    return Response.json({
      blogs: res,
      canonicalLink: `${getCanonicalDomain()}/blog/page/1`
    });
  } catch (e) {
    console.error(e);

    throw Response.json(e, {
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
