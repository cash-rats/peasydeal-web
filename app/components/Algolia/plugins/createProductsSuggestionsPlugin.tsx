import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import type { SearchClient } from 'algoliasearch/lite';
import type { RecentSearchesPluginData } from '@algolia/autocomplete-plugin-recent-searches';
import type { AutocompletePlugin } from '@algolia/autocomplete-core';

import { ALGOLIA_INDEX_NAME, DOMAIN } from '~/utils/get_env_source';

import type {
  ProductQuerySuggestHit,
  RecentSearchHit
} from '../types';

type ICreateProductsSuggestionsPlugin = {
  searchClient: SearchClient;
  recentSearchPlugin?: AutocompletePlugin<RecentSearchHit, RecentSearchesPluginData<TItem>>
};

const createProductsSuggestionsPlugin = ({
  searchClient,
  recentSearchPlugin,
}: ICreateProductsSuggestionsPlugin) => {

  return createQuerySuggestionsPlugin<ProductQuerySuggestHit>({
    searchClient,
    indexName: ALGOLIA_INDEX_NAME,
    getSearchParams() {
      return recentSearchPlugin?.data?.getAlgoliaSearchParams({
        hitsPerPage: 5,
      });
    },
    transformSource({ source }) {
      return {
        ...source,
        getItemUrl({ item }) {
          return `${DOMAIN}/search?query=${item.title}`
        },
      };
    },
  });
};

export default createProductsSuggestionsPlugin;
