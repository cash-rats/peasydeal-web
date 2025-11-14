import { data } from "react-router";
import { useLoaderData } from "react-router";
import type { LinksFunction, MetaFunction } from 'react-router';
import type { LoaderFunctionArgs } from "react-router";
import httpStatus from 'http-status-codes';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import type { TContentfulPost } from '~/shared/types';

import { fetchContentfulPostWithId } from "./api";
import { getRootFBSEO_V2 } from '~/utils/seo';
import styles from './styles/StaticPage.css?url';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

export const meta: MetaFunction = ({ data }: { data: TContentfulPost }) => {
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

export const loader = async (: LoaderFunctionArgs) => {
  try {
    const entryId = "2wjkGGuCQnqiIDjZrsySYL";
    const res = await fetchContentfulPostWithId({ entryId });

    return data<TContentfulPost>(res);
  } catch (e) {
    console.error(e);

    throw data(e, {
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