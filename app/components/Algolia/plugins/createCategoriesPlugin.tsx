import { getAlgoliaFacets } from '@algolia/autocomplete-js';
import type { AutocompletePlugin } from '@algolia/autocomplete-js';
import type { SearchClient } from 'algoliasearch/lite';

import type { CategoryRecord } from '../types';

type CreateCategoriesPluginProps = {
  searchClient: SearchClient;
};

export function createCategoriesPlugin({
  searchClient,
}: CreateCategoriesPluginProps): AutocompletePlugin<CategoryRecord, undefined> {
  return {
    getSources({ query }) {
      return [
        {
          sourceId: 'categoriesPlugin',
          getItems() {
            return getAlgoliaFacets({
              searchClient,
              queries: [
                {
                  indexName: 'staging_products',
                  facet: 'categories',
                  params: {
                    facetQuery: query,
                    maxFacetHits: query ? 3 : 6,
                  },
                },
              ],
            });
          },
        },
      ];
    },
  };
}
