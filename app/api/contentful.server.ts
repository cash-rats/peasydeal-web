import * as contentful from 'contentful';

import type { TContentfulPost } from '~/shared/types';
import { envs } from '~/utils/env.server';

interface IContentfulRes {
  fields?: TContentfulPost;
}

let _contentfulClient: contentful.ContentfulClientApi<undefined> | null = null;

const getContentfulClient = () => {
  if (_contentfulClient) return _contentfulClient;

  const space = envs.CONTENTFUL_SPACE_ID;
  const accessToken = envs.CONTENTFUL_ACCESS_TOKEN;

  if (!space || !accessToken) {
    throw new Error('Missing Contentful environment variables.');
  }

  _contentfulClient = contentful.createClient({ space, accessToken });
  return _contentfulClient;
};

export const fetchContentfulPostWithId = async ({ entryId }: { entryId: string }) => {
  try {
    const resp = await getContentfulClient().getEntry<IContentfulRes>(entryId);
    return resp?.fields;
  } catch (error: any) {
    console.error(error);
    throw new Error(error?.message);
  }
};
