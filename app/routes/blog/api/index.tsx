import { envs } from '~/utils/get_env_source';

import type { TContentfulPost, IBlogStaticProps } from '~/shared/types';
import * as contentful from 'contentful';

const contenfulClient = contentful.createClient({
	space: envs.CONTENTFUL_SPACE_ID,
	accessToken: envs.CONTENTFUL_ACCESS_TOKEN,
})

interface IContentfulRes {
	fields?: TContentfulPost,
}

export const contentfulConfig = {
	pagination: {
		pageSize: 8,
	},
};

export class ContentfulGQLApi {
	static async callContentful(query: string) {
		const fetchUrl = `https://graphql.contentful.com/content/v1/spaces/${CONTENTFUL_SPACE_ID}`;

		const fetchOptions = {
			method: "POST",
			headers: {
				Authorization: `Bearer ${envs.CONTENTFUL_ACCESS_TOKEN}`,
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

	static async getPaginatedPostSummaries(page: any) {
		const skipMultiplier: any = page === 1 ? 0 : page - 1;
		const skip = skipMultiplier > 0 ? contentfulConfig.pagination.pageSize * skipMultiplier : 0;

		const query = `{
			blogsCollection(limit: ${contentfulConfig.pagination.pageSize}, skip: ${skip}, order: publishedDate_DESC) {
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
		const resp = await contenfulClient.getEntries<any>({
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
		const resp = await contenfulClient.getEntry<IContentfulRes>(entry);
		return resp?.fields;
	} catch (error: any) {
		console.error(error);

		throw new Error(error?.message);
	}
}

export const getStaticProps = async ({
	params
}: { params: { page: Number } }): Promise<IBlogStaticProps> => {
	const postSummaries = await ContentfulGQLApi.getPaginatedPostSummaries(
		params.page,
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
