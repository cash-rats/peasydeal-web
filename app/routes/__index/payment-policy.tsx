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

  return [
    { title: contentfulFields?.seoReference?.fields?.SEOtitle || 'PeasyDeal Payment Policy' },

    ...getRootFBSEO_V2()
      .map(tag => {
        if (!('property' in tag)) return tag;

        if (tag.property === 'og:description') {
          tag.content = contentfulFields?.seoReference?.fields?.SEOdescription || 'Stay informed about our payment policy and how it affects your experience on PeasyDeal. Read our comprehensive policy here!';
        }

        return tag
      }),
  ];
}

export const loader = async (: LoaderFunctionArgs) => {
  try {
    const entryId = "Iwfcj4d3O8fGQcjSm2xHo";
    const res = await fetchContentfulPostWithId({ entryId });

    return json<TContentfulPost>(res);
  } catch (e) {
    console.error(e);

    throw json(e, {
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}

export default function PaymentPolicy() {
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