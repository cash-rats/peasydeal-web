import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { LinksFunction, MetaFunction } from '@remix-run/node';
import type { LoaderFunction } from "@remix-run/node";
import httpStatus from 'http-status-codes';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import type { TContentfulPost } from '~/shared/types';

import { fetchContentfulPostWithId } from "./api";
import { getRootFBSEO } from '~/utils/seo';
import styles from './styles/StaticPage.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

export const meta: MetaFunction = ({ data }: { data: TContentfulPost}) => {
  const contentfulFields = data || {};

  return {
    ...getRootFBSEO(),
    'og:title': contentfulFields?.seoReference?.fields?.SEOtitle || 'Terms of Service',
    'og:description': contentfulFields?.seoReference?.fields?.SEOdescription || `Learn about PeasyDeal's terms of service and how they apply to your use of our website. Get all the information you need to know about our services and policies here.`,
  };
};

export const loader: LoaderFunction = async () => {
  try {
    const entryId = "5DsLbnFtdnoasflHy3ZU60";
    const res = await fetchContentfulPostWithId({ entryId });

    return json<TContentfulPost>(res);
  } catch(e) {
    console.error(e);

    throw json(e, {
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}

export default function ShippingPolicy  () {
  const post = useLoaderData() as TContentfulPost;

  // @ts-ignore
  const nodes = documentToReactComponents(post.body) || [];

  return (
    <div className="w-full p-4 max-w-screen-xl mx-auto">
      <div className="peasydeal-v1 pt-4">
        <h1 className="">
          { post.postName }
        </h1>
      </div>
      <div className="peasydeal-v1">
        { nodes }
      </div>
    </div>
  );
}