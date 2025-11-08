import { json } from "react-router";
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
        tag.content = contentfulFields?.seoReference?.fields?.SEOtitle || 'PeasyDeal Privacy Policy';
      }

      if (tag.property === 'og:description') {
        tag.content = contentfulFields?.seoReference?.fields?.SEOdescription || 'This Privacy Notice explains in detail the types of personal data we may collect about you when you interact with us. It also explains how we’ll store and handle that data, and keep it safe.';
      }

      return tag;
    });
}

export const loader = async (: LoaderFunctionArgs) => {
  try {
    const entryId = "2V3hOJs5zIsijhGX8caGGc";
    const res = await fetchContentfulPostWithId({ entryId });

    return json<TContentfulPost>(res);
  } catch (e) {
    console.error(e);

    throw json(e, {
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}

export default function PrivacyPolicy() {
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
      <div className="peasydeal-v1 pt-4">
        {nodes}
      </div>
    </div>
  );
}