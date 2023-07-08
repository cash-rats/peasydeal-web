import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { LinksFunction, V2_MetaFunction } from '@remix-run/node';
import type { LoaderFunction } from "@remix-run/node";
import httpStatus from 'http-status-codes';

import type { IBlogStaticProps } from '~/shared/types';
import { getRootFBSEO_V2 } from '~/utils/seo';

import { getStaticProps } from "./api";
import styles from './styles/blog.css';
import BlogLayout from "./components/BlogLayout";
import gradientBg from './images/gradient-bg.jpg';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

export const meta: V2_MetaFunction = ({ data }: { data: TContentfulPost }) => {
  const contentfulFields = data || {};
  return getRootFBSEO_V2()
    .map(tag => {
      if (!('property' in tag)) return tag;

      if (tag.property === 'og:title') {
        tag.content = contentfulFields?.seoReference?.fields?.SEOtitle;
      }

      if (tag.property === 'og:description') {
        tag.content = contentfulFields?.seoReference?.fields?.SEOdescription;
      }

      if (tag.property === 'og:image') {
        tag.content = contentfulFields?.seoReference?.fields?.ogImage?.fields?.file?.url;
      }

      return tag;
    });
};

export const loader: LoaderFunction = async () => {
  try {
    const res = await getStaticProps({ params: { page: 1 } });

    return json<IBlogStaticProps>(res);
  } catch (e) {
    console.error(e);

    throw json(e, {
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}

export default function BlogIndex() {
  const { postSummaries, currentPage, totalPages } = useLoaderData() as IBlogStaticProps;

  return (
    <div className="w-full p-4 md:px-10 md:py-8 max-w-screen-xl mx-auto bg-white">
      <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
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
