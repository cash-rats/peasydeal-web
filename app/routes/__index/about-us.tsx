import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { LinksFunction, V2_MetaFunction } from '@remix-run/node';
import type { LoaderFunction } from "@remix-run/node";
import httpStatus from 'http-status-codes';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import type { TContentfulPost } from '~/shared/types';

import { fetchContentfulPostWithId } from "./api";
import { getRootFBSEO_V2 } from '~/utils/seo';
import styles from './styles/StaticPage.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

export const meta: V2_MetaFunction = ({ data }: { data: TContentfulPost }) => {
  const contentfulFields = data || {};
  return [
    ...getRootFBSEO_V2(),
    {
      tagName: 'meta',
      name: 'og:title',
      content: contentfulFields?.seoReference?.fields?.SEOtitle,
    },
    {
      tagName: 'meta',
      name: 'og:description',
      content: contentfulFields?.seoReference?.fields?.SEOdescription,
    },
    {
      tagName: 'meta',
      name: 'og:image',
      content: contentfulFields?.seoReference?.fields?.ogImage?.fields?.file?.url,
    }
  ];
};

export const loader: LoaderFunction = async () => {
  try {
    const entryId = "2ihmYXUn9a3TVZB0AJLL1Z";
    const res = await fetchContentfulPostWithId({ entryId });

    return json<TContentfulPost>(res);
  } catch (e) {
    console.error(e);

    throw json(e, {
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}

export default function AboutUs() {
  const post = useLoaderData() as TContentfulPost;

  // @ts-ignore
  const nodes = documentToReactComponents(post.body) || [];

  return (
    <div className="w-full p-4 max-w-screen-xl mx-auto">
      <div className="peasydeal-v1 pt-4">
        <h1 className="">
          {post.postName}
        </h1>
        <img
          className="w-full"
          src={post.featuredImage.fields.file.url}
          alt={post.postName}
        />
      </div>
      <div className="peasydeal-v1 pt-4">
        {nodes}
      </div>
    </div>
  );
}