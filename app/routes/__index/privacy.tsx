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
    'og:title': contentfulFields?.seoReference?.fields?.SEOtitle || 'PeasyDeal Privacy Policy',
    'og:description': contentfulFields?.seoReference?.fields?.SEOdescription || 'This Privacy Notice explains in detail the types of personal data we may collect about you when you interact with us. It also explains how we’ll store and handle that data, and keep it safe.',
  };
}

export const loader: LoaderFunction = async () => {
  try {
    const entryId = "2V3hOJs5zIsijhGX8caGGc";
    const res = await fetchContentfulPostWithId({ entryId });

    return json<TContentfulPost>(res);
  } catch(e) {
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
          { post.postName }
        </h1>
      </div>
      <div className="peasydeal-v1 pt-4">
        { nodes }
      </div>
    </div>
  );
}