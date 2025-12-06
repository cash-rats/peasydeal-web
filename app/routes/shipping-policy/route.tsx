import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import httpStatus from 'http-status-codes';
import type { MetaFunction } from 'react-router';
import { data, useLoaderData } from 'react-router';

import { fetchContentfulPostWithId } from '~/api/products';
import type { TContentfulPost } from '~/shared/types';
import { getRootFBSEO_V2 } from '~/utils/seo';

type LoaderData = TContentfulPost;

const FALLBACK_TITLE = 'Shipping Policy | PeasyDeal - Fast Shipping & Full Item Tracking';
const FALLBACK_DESCRIPTION =
  'Order with confidence with PeasyDeal. Fast shipment with full shipment tracking. Discover our shipping policy and shop today!';

const richTextRenderers = {
  [BLOCKS.PARAGRAPH]: (_node: any, children: any) => (
    <p className="text-lg leading-8 text-slate-700">{children}</p>
  ),
  [BLOCKS.HEADING_1]: (_node: any, children: any) => (
    <h2 className="text-2xl font-semibold text-slate-800 sm:text-3xl">{children}</h2>
  ),
  [BLOCKS.HEADING_2]: (_node: any, children: any) => (
    <h3 className="text-xl font-semibold text-emerald-700 sm:text-2xl">{children}</h3>
  ),
  [BLOCKS.HEADING_3]: (_node: any, children: any) => (
    <h4 className="text-lg font-semibold text-emerald-700">{children}</h4>
  ),
  [BLOCKS.UL_LIST]: (_node: any, children: any) => (
    <ul className="list-disc space-y-2 pl-6 text-lg leading-8 text-slate-700">{children}</ul>
  ),
  [BLOCKS.OL_LIST]: (_node: any, children: any) => (
    <ol className="list-decimal space-y-2 pl-6 text-lg leading-8 text-slate-700">{children}</ol>
  ),
  [BLOCKS.LIST_ITEM]: (_node: any, children: any) => (
    <li className="text-lg leading-7 text-slate-700">{children}</li>
  ),
  [BLOCKS.QUOTE]: (_node: any, children: any) => (
    <blockquote className="border-l-4 border-emerald-500 bg-slate-50 px-4 py-3 text-lg leading-8 text-slate-800 italic">
      {children}
    </blockquote>
  ),
  [INLINES.HYPERLINK]: (node: any, children: any) => (
    <a
      className="font-medium text-blue-600 underline underline-offset-2 transition-colors hover:text-blue-700"
      href={node?.data?.uri || '#'}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  ),
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const contentfulFields = data || {};

  return getRootFBSEO_V2().map(tag => {
    if (!('property' in tag)) return tag;

    if (tag.property === 'og:title') {
      tag.content = contentfulFields?.seoReference?.fields?.SEOtitle || FALLBACK_TITLE;
    }

    if (tag.property === 'og:description') {
      tag.content = contentfulFields?.seoReference?.fields?.SEOdescription || FALLBACK_DESCRIPTION;
    }

    return tag;
  });
};

export const loader = async () => {
  try {
    const entryId = '2wjkGGuCQnqiIDjZrsySYL';
    const res = await fetchContentfulPostWithId({ entryId });

    return data<LoaderData>(res);
  } catch (e) {
    console.error(e);

    throw data(e, {
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};

export default function ShippingPolicy() {
  const post = useLoaderData<LoaderData>();

  const nodes = post?.body
    ? documentToReactComponents(post.body, { renderNode: richTextRenderers })
    : null;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-4 text-center">
        <h1 className="text-3xl font-semibold text-slate-800 sm:text-4xl">
          {post?.postName || 'Shipping Policy'}
        </h1>
        {post?.seoReference?.fields?.SEOdescription ? (
          <p className="text-lg leading-7 text-slate-700">
            {post.seoReference.fields.SEOdescription}
          </p>
        ) : null}
      </header>

      <div className="space-y-6 text-slate-800">
        {nodes}
      </div>
    </div>
  );
}
