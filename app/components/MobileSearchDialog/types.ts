import type { Hit } from '@algolia/client-search';

import type { AlgoliaIndexItem } from '~/components/Algolia/types';

export type AutocompleteItem = Hit<AlgoliaIndexItem>;

export type RecentSearchHit = {
  id: string,
  label: string,
};