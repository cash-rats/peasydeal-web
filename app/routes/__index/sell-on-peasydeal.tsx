import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { LinksFunction, MetaFunction } from '@remix-run/node';
import type { LoaderFunction } from "@remix-run/node";
import httpStatus from 'http-status-codes';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { FcIdea } from 'react-icons/fc';
import type { TContentfulPost } from '~/shared/types';

import { fetchContentfulPostWithId } from "./api";
import { getRootFBSEO } from '~/utils/seo';
import styles from './styles/StaticPage.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

export const meta: MetaFunction = ({ data }: { data: TContentfulPost }) => {
  const contentfulFields = data || {};

  return {
    ...getRootFBSEO(),
    'og:title': contentfulFields?.seoReference?.fields?.SEOtitle || 'PeasyDeal Return Policy',
    'og:description': contentfulFields?.seoReference?.fields?.SEOdescription || `No hassle, no b.s. returns - get your cash back fast! We strongly believe in happy customers - and that's why PeasyDeal offer easy refund policy with no strings attached!`,
  };
};

export const loader: LoaderFunction = async () => {
  try {
    const entryId = "1LNn5LAShbDcw9nMG2Rh9v";
    const res = await fetchContentfulPostWithId({ entryId });

    return json<TContentfulPost>(res);
  } catch (e) {
    console.error(e);

    throw json(e, {
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}

export default function SellOnPeasyDeal() {
  const post = useLoaderData() as TContentfulPost;

  console.log(post.attributes)

  // @ts-ignore
  const nodes = documentToReactComponents(post.body) || [];
  // @ts-ignore
  const intro = documentToReactComponents(post.introText) || [];

  const { attributes = {} } = post || {};

  return (
    <div className="w-full p-4 max-w-screen-xl mx-auto">
      <div className="static-banner-background flex flex-col justify-center py-20 px-10 rounded-xl">
        <div className="flex flex-col justify-center align-center text-center">
          <h1 className="text-white text-4xl mb-4 font-poppins font-black">{post.postName}</h1>
          <h5 className="text-white text-2xl">
            {intro}
          </h5>
        </div>
      </div>
      {
        attributes?.benefits && attributes?.benefits.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
            {
              attributes?.benefits.map((benefit: any, index: number) => {
                return (
                  <div
                    key={`benefit-${benefit?.name}`}
                    className="flex flex-col justify-center align-center text-center bg-[#efefef] rounded-md p-4"
                  >
                    <FcIdea fontSize="48px" className="mb-2 self-center" />
                    <h1 className="text-black text-xl p-4 font-poppins">{benefit?.label}</h1>
                  </div>
                )
              })
            }
          </div>
        )
      }
      <div className="peasydeal-v1 pt-4">
        {nodes}
      </div>
    </div>
  );
}
