import httpStatus from 'http-status-codes';
import { FcIdea } from 'react-icons/fc';
import type { MetaFunction } from 'react-router';
import { data, useLoaderData, useRouteLoaderData } from 'react-router';
import { useMemo } from 'react';

import { fetchContentfulPostWithId } from '~/api/contentful.server';
import type { TContentfulPost } from '~/shared/types';
import { getRootFBSEO_V2 } from '~/utils/seo';
import { V2Layout } from '~/components/v2/GlobalLayout';
import type { RootLoaderData } from '~/root';
import { Breadcrumbs } from '~/components/v2/Breadcrumbs';
import { PageTitle } from '~/components/v2/PageTitle';
import { ContentfulRichText } from '~/components/v2/ContentfulRichText';

type LoaderData = TContentfulPost;

const FALLBACK_TITLE = 'Sell on PeasyDeal';
const FALLBACK_DESCRIPTION =
  'Join PeasyDeal as a seller and reach new customers. Explore the benefits and get started today.';

export const meta: MetaFunction = ({ data: loaderData }) => {
  const post = loaderData as LoaderData | undefined;
  return getRootFBSEO_V2().map(tag => {
    if (!('property' in tag)) return tag;
    if (tag.property === 'og:title') {
      tag.content = post?.seoReference?.fields?.SEOtitle || FALLBACK_TITLE;
    }
    if (tag.property === 'og:description') {
      tag.content = post?.seoReference?.fields?.SEOdescription || FALLBACK_DESCRIPTION;
    }
    return tag;
  });
};

export const loader = async () => {
  try {
    const entryId = '1LNn5LAShbDcw9nMG2Rh9v';
    const res = (await fetchContentfulPostWithId({ entryId })) as LoaderData;
    return data<LoaderData>(res);
  } catch (e) {
    console.error(e);
    throw data(e, { status: httpStatus.INTERNAL_SERVER_ERROR });
  }
};

export default function SellOnPeasyDeal() {
  const post = useLoaderData<LoaderData>();
  const rootData = useRouteLoaderData('root') as RootLoaderData | undefined;
  const categories = rootData?.categories ?? [];
  const navBarCategories = rootData?.navBarCategories ?? [];
  const attributes = post?.attributes as { benefits?: Array<{ name?: string; label?: string }> } | undefined;

  const breadcrumbs = useMemo(
    () => [{ label: 'Home', href: '/' }, { label: 'Sell on PeasyDeal' }],
    []
  );

  return (
    <V2Layout categories={categories} navBarCategories={navBarCategories}>
      <div className="v2 max-w-[var(--container-max)] mx-auto px-4 redesign-sm:px-6 redesign-md:px-12 py-6">
        <Breadcrumbs items={breadcrumbs} className="mb-4" />
        <PageTitle
          title={post?.postName || FALLBACK_TITLE}
          subtitle={FALLBACK_DESCRIPTION}
        />

        {attributes?.benefits?.length ? (
          <div className="grid gap-4 grid-cols-2 redesign-sm:grid-cols-3 redesign-md:grid-cols-4 mb-8">
            {attributes.benefits.map((benefit, index) => (
              <div
                key={`benefit-${benefit?.name || index}`}
                className="flex flex-col items-center justify-center rounded-rd-md border border-rd-border bg-rd-bg-card p-5 text-center transition-shadow hover:shadow-card-hover"
              >
                <FcIdea fontSize="48px" className="mb-3" />
                <h2 className="font-heading text-base font-semibold text-black">{benefit?.label}</h2>
              </div>
            ))}
          </div>
        ) : null}

        <div className="max-w-[780px] mx-auto">
          <ContentfulRichText document={post?.body} />
        </div>
      </div>
    </V2Layout>
  );
}
