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

const HIDDEN_PHRASES = ['company no', 'landline'];

const collectNodeText = (node: any): string => {
  if (!node) return '';
  if (typeof node.value === 'string') return node.value;
  if (Array.isArray(node.content)) {
    return node.content.map(collectNodeText).join(' ');
  }
  return '';
};

export const meta: MetaFunction = ({ data: loaderData }) => {
  const post = loaderData as LoaderData | undefined;
  return getRootFBSEO_V2().map((tag) => {
    if (!('property' in tag)) return tag;
    if (tag.property === 'og:title') {
      tag.content = post?.seoReference?.fields?.SEOtitle;
    }
    if (tag.property === 'og:description') {
      tag.content = post?.seoReference?.fields?.SEOdescription;
    }
    if (tag.property === 'og:image') {
      tag.content = post?.seoReference?.fields?.ogImage?.fields?.file?.url;
    }
    return tag;
  });
};

export const loader = async () => {
  try {
    const entryId = '2ihmYXUn9a3TVZB0AJLL1Z';
    const res = (await fetchContentfulPostWithId({ entryId })) as LoaderData;

    // Filter out paragraphs containing hidden phrases
    if (res?.body?.content) {
      res.body.content = res.body.content.filter((node: any) => {
        const text = collectNodeText(node).toLowerCase();
        return !HIDDEN_PHRASES.some((phrase) => text.includes(phrase));
      });
    }

    return data<LoaderData>(res);
  } catch (e) {
    console.error(e);
    throw data(e, { status: httpStatus.INTERNAL_SERVER_ERROR });
  }
};

export default function AboutUs() {
  const post = useLoaderData<LoaderData>();
  const rootData = useRouteLoaderData('root') as RootLoaderData | undefined;
  const categories = rootData?.categories ?? [];
  const navBarCategories = rootData?.navBarCategories ?? [];

  const breadcrumbs = useMemo(
    () => [{ label: 'Home', href: '/' }, { label: 'About Us' }],
    []
  );

  const featuredImageUrl = post?.featuredImage?.fields?.file?.url as string | undefined;

  return (
    <V2Layout categories={categories} navBarCategories={navBarCategories}>
      <div className="v2 max-w-[var(--container-max)] mx-auto px-4 redesign-sm:px-6 redesign-md:px-12 py-6">
        <Breadcrumbs items={breadcrumbs} className="mb-4" />
        <PageTitle title={post?.postName || 'About Us'} />

        {featuredImageUrl && (
          <img
            className="w-full rounded-rd-lg object-cover mb-10 max-h-[400px]"
            src={featuredImageUrl}
            alt={post?.postName || 'About PeasyDeal'}
            loading="lazy"
          />
        )}

        <div className="max-w-[780px] mx-auto">
          <ContentfulRichText document={post?.body} />
        </div>
      </div>
    </V2Layout>
  );
}
