import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import httpStatus from 'http-status-codes';
import { FcIdea } from 'react-icons/fc';
import type { LinksFunction, MetaFunction } from 'react-router';
import { data, useLoaderData, useRouteLoaderData } from 'react-router';

import { fetchContentfulPostWithId } from '~/api/products';
import type { TContentfulPost } from '~/shared/types';
import { getRootFBSEO_V2 } from '~/utils/seo';
import CatalogLayout, { links as CatalogLayoutLinks } from '~/components/layouts/CatalogLayout';
import type { RootLoaderData } from '~/root';
import { useCartCount } from '~/routes/hooks';

type LoaderData = TContentfulPost;

const FALLBACK_TITLE = 'Sell on PeasyDeal';
const FALLBACK_DESCRIPTION =
  'Join PeasyDeal as a seller and reach new customers. Explore the benefits and get started today.';

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

export const links: LinksFunction = () => [...CatalogLayoutLinks()];

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
    const entryId = '1LNn5LAShbDcw9nMG2Rh9v';
    const res = await fetchContentfulPostWithId({ entryId });

    return data<LoaderData>(res);
  } catch (e) {
    console.error(e);

    throw data(e, {
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};

export default function SellOnPeasyDeal() {
  const post = useLoaderData<LoaderData>();
  const rootData = useRouteLoaderData('root') as RootLoaderData | undefined;
  const categories = rootData?.categories ?? [];
  const navBarCategories = rootData?.navBarCategories ?? [];
  const cartCount = useCartCount();
  const attributes = post?.attributes as { benefits?: Array<{ name?: string; label?: string }> } | undefined;

  const intro = post?.introText
    ? documentToReactComponents(post.introText, { renderNode: richTextRenderers })
    : null;

  const nodes = post?.body
    ? documentToReactComponents(post.body, { renderNode: richTextRenderers })
    : null;

  return (
    <CatalogLayout
      categories={categories}
      navBarCategories={navBarCategories}
      cartCount={cartCount}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-orange-400 via-pink-500 to-teal-400 px-6 py-16 text-center text-white shadow-lg sm:px-10">
          <h1 className="text-3xl font-black sm:text-4xl">{post?.postName || 'Sell on PeasyDeal'}</h1>
          {intro ? (
            <div className="mt-4 text-xl font-semibold leading-8 sm:text-2xl">
              {intro}
            </div>
          ) : null}
        </div>

        {attributes?.benefits?.length ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {attributes.benefits.map((benefit, index) => (
              <div
                key={`benefit-${benefit?.name || index}`}
                className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-4 text-center shadow-sm"
              >
                <FcIdea fontSize="48px" className="mb-3" />
                <h2 className="text-lg font-semibold text-slate-800">{benefit?.label}</h2>
              </div>
            ))}
          </div>
        ) : null}

        <div className="space-y-6 text-slate-800">
          {nodes}
        </div>
      </div>
    </CatalogLayout>
  );
}
