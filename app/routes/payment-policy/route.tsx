import httpStatus from 'http-status-codes';
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

const FALLBACK_TITLE = 'Payment Policy';
const FALLBACK_DESCRIPTION =
  'Learn about our accepted payment methods and payment processing policies.';

export const meta: MetaFunction = ({ data: loaderData }) => {
  const post = loaderData as LoaderData | undefined;
  return getRootFBSEO_V2().map((tag) => {
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
    const entryId = 'Iwfcj4d3O8fGQcjSm2xHo';
    const res = (await fetchContentfulPostWithId({ entryId })) as LoaderData;
    return data<LoaderData>(res);
  } catch (e) {
    console.error(e);
    throw data(e, { status: httpStatus.INTERNAL_SERVER_ERROR });
  }
};

export default function PaymentPolicy() {
  const post = useLoaderData<LoaderData>();
  const rootData = useRouteLoaderData('root') as RootLoaderData | undefined;
  const categories = rootData?.categories ?? [];
  const navBarCategories = rootData?.navBarCategories ?? [];

  const breadcrumbs = useMemo(
    () => [{ label: 'Home', href: '/' }, { label: 'Payment Policy' }],
    []
  );

  return (
    <V2Layout categories={categories} navBarCategories={navBarCategories}>
      <div className="v2 max-w-[var(--container-max)] mx-auto px-4 redesign-sm:px-6 redesign-md:px-12 py-6">
        <Breadcrumbs items={breadcrumbs} className="mb-4" />
        <PageTitle
          title={post?.postName || FALLBACK_TITLE}
          subtitle={post?.seoReference?.fields?.SEOdescription}
        />
        <div className="max-w-[780px] mx-auto">
          <ContentfulRichText document={post?.body} />
        </div>
      </div>
    </V2Layout>
  );
}
