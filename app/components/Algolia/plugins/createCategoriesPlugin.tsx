import { getAlgoliaFacets } from '@algolia/autocomplete-preset-algolia';
import type { AutocompletePlugin } from '@algolia/autocomplete-js';
import type { SearchClient } from '@algolia/autocomplete-preset-algolia';

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
                  type: 'facet',
                  params: {
                    query,
                    maxValuesPerFacet: query ? 3 : 6,
                  },
                },
              ],
            });
          },
          templates: {
            item({ item }) {
              return item.label;
            },
          },
        },
      ];
    },
  };
}
