import type { LinksFunction, MetaFunction } from 'react-router';
import { useLoaderData } from 'react-router';
import httpStatus from 'http-status-codes';

import { getStaticProps } from '~/routes/blog/api';
import BlogLayout from '~/routes/blog/components/BlogLayout';
import blogOGImage from '~/routes/blog/images/peasydeal-blog-ogimage.jpg';
import {
  getBlogTitleText,
  getCanonicalDomain,
  getBlogFBSEO_V2,
} from '~/utils/seo';

import styles from '~/routes/blog/styles/blog.css?url';

type LoaderData = {
  blogs: Awaited<ReturnType<typeof getStaticProps>>;
  canonicalLink: string;
};

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

export const loader = async ({ params }: { params: Record<string, string | undefined> }) => {
  try {
    const { page = '1' } = params;
    const res = await getStaticProps({ params: { page: parseInt(page, 10) } });

    return Response.json({
      blogs: res,
      canonicalLink: `${getCanonicalDomain()}/blog/page/${parseInt(page, 10)}`,
    });
  } catch (e) {
    console.error(e);

    throw Response.json(e, {
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};

export const meta: MetaFunction<typeof loader> = ({ loaderData }) => {
  return [
    { title: getBlogTitleText() },
    { tagName: 'link', rel: 'canonical', href: loaderData?.canonicalLink },
    ...getBlogFBSEO_V2(blogOGImage),
  ];
};

export default function BlogIndex() {
  const {
    blogs: { postSummaries, currentPage, totalPages },
  } = useLoaderData<LoaderData>();

  return (
    <div className="mx-auto w-full max-w-screen-xl bg-white p-4 md:px-10 md:py-8">
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
