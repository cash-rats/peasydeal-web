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

  return getRootFBSEO_V2()
    .map(tag => {
      if (!('property' in tag)) return tag;

      if (tag.property === 'og:title') {
        tag.content = contentfulFields?.seoReference?.fields?.SEOtitle || 'Shipping Policy | PeasyDeal - Fast Shipping & Full Item Tracking';
      }

      if (tag.property === 'og:description') {
        tag.content = contentfulFields?.seoReference?.fields?.SEOdescription || `Order with confidence with PeasyDeal. Fast shipment with full shipment tracking. Discover our shipping policy and shop today!`;
      }

      return tag;
    })
};

export const loader: LoaderFunction = async () => {
  try {
    const entryId = "2wjkGGuCQnqiIDjZrsySYL";
    const res = await fetchContentfulPostWithId({ entryId });

    return json<TContentfulPost>(res);
  } catch (e) {
    console.error(e);

    throw json(e, {
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}

export default function ShippingPolicy() {
  const post = useLoaderData() as TContentfulPost;

  // @ts-ignore
  const nodes = documentToReactComponents(post.body) || [];

  return (
    <div className="w-full p-4 max-w-screen-xl mx-auto">
      <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
      <div className="peasydeal-v1 pt-4">
        <h1 className="">
          {post.postName}
        </h1>
      </div>
      <div className="peasydeal-v1">
        {nodes}
      </div>
    </div>
  );
}