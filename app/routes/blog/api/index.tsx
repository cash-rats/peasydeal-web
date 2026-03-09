import type { TContentfulPost, IBlogStaticProps } from '~/shared/types';
import { createClient } from 'contentful';
import { envs } from '~/utils/env.server';

let _contentfulClient: ReturnType<typeof createClient> | null = null;
const getContentfulEnv = () => {
  if (typeof window !== 'undefined') {
    throw new Error('Contentful env must only be read on the server.');
  }
  const space = envs.CONTENTFUL_SPACE_ID;
  const accessToken = envs.CONTENTFUL_ACCESS_TOKEN;
  if (!space || !accessToken) {
    throw new Error('Missing Contentful environment variables.');
  }
  return { space, accessToken };
};

const getContentfulClient = () => {
  if (_contentfulClient) return _contentfulClient;
  const { space, accessToken } = getContentfulEnv();
  _contentfulClient = createClient({ space, accessToken });
  return _contentfulClient;
};

interface IContentfulRes {
  fields?: TContentfulPost,
}

export const contentfulConfig = {
  pagination: {
    pageSize: 9,
  },
};

export class ContentfulGQLApi {
  static async callContentful(query: string) {
    const { space, accessToken } = getContentfulEnv();
    const fetchUrl = `https://graphql.contentful.com/content/v1/spaces/${space}`;

    const fetchOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    };

    try {
      const data = await fetch(fetchUrl, fetchOptions).then((response) =>
        response.json(),
      );
      return data;
    } catch (error) {
      throw new Error("Could not fetch data from Contentful!");
    }
  }

  static async getTotalPostsNumber() {
    // Build the query
    const query = `
      {
        blogPostCollection {
          total
        }
      }
    `;

    // Call out to the API
    const response = await this.callContentful(query);
    const totalPosts = response.data.blogPostCollection.total
      ? response.data.blogPostCollection.total
      : 0;

    return totalPosts;
  }

  static async getPaginatedPostSummaries(page: any, { extraCount = 0 }: { extraCount?: number } = {}) {
    const pageSize = contentfulConfig.pagination.pageSize;
    const skip = page === 1 ? 0 : (pageSize * (page - 1)) + extraCount;
    const limit = page === 1 ? pageSize + extraCount : pageSize;

    const query = `{
			blogsCollection(limit: ${limit}, skip: ${skip}, order: [publishedDate_DESC, sys_firstPublishedAt_DESC]) {
				total
				items {
					sys {
						id
					}
					publishedDate
					featuredImage {
						url
						fileName
					}
					postName
					slug
					excerpt
					tags
				}
			}
		}`;

    // Call out to the API
    const response = await this.callContentful(query);

    const paginatedPostSummaries = response.data.blogsCollection
      ? response.data.blogsCollection
      : { total: 0, items: [] };

    return paginatedPostSummaries;
  }

  static async getAllPostSlugs() {
    const query = `{
			blogsCollection(order: publishedDate_DESC, limit: 1000) {
				items {
					slug
					publishedDate
				}
			}
		}`;

    const response = await this.callContentful(query);

    return response.data.blogsCollection
      ? response.data.blogsCollection.items
      : [];
  }

  static async getLatestPosts(total: Number) {
    const query = `{
			blogsCollection(limit: 6, order: publishedDate_DESC) {
				total
				items {
					sys {
						id
					}
					publishedDate
					featuredImage {
						url
						fileName
					}
					postName
					slug
				}
			}
		}`;

    // Call out to the API
    const response = await this.callContentful(query);

    const paginatedPostSummaries = response.data.blogsCollection
      ? response.data.blogsCollection
      : { total: 0, items: [] };

    return paginatedPostSummaries;
  }
}

// Fetch from Contentful with GraphQL
export const fetchContentfulWithSlug = async ({
  slug,
}: { slug: string }): Promise<any> => {
  try {
    const resp = await getContentfulClient().getEntries<any>({
      content_type: 'blogs',
      'fields.slug[in]': slug,
    });

    return resp?.items[0]?.fields;
  } catch (error: any) {
    console.error(error);

    throw new Error(error?.message);
  }
}

export const fetchContentfulWithEntry = async ({
  entry,
}: { entry: string }): Promise<any> => {
  try {
    const resp = await getContentfulClient().getEntry<IContentfulRes>(entry);
    return resp?.fields;
  } catch (error: any) {
    console.error(error);

    throw new Error(error?.message);
  }
}

export const getStaticProps = async ({
  params,
  extraCount = 0,
}: { params: { page: Number }; extraCount?: number }): Promise<IBlogStaticProps> => {
  const postSummaries = await ContentfulGQLApi.getPaginatedPostSummaries(
    params.page,
    { extraCount },
  );
  const totalPages = Math.ceil(postSummaries.total / contentfulConfig.pagination.pageSize);

  return {
    postSummaries: postSummaries.items,
    totalPages,
    currentPage: params.page,
  };
};

export const fetchContentfulLatestPosts = async ({
  total
}: { total: Number }) => {
  const postSummaries = await ContentfulGQLApi.getLatestPosts(total);

  return postSummaries.items;
};
