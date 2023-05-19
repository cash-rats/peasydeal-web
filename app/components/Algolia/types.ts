import type { Hit } from '@algolia/client-search';
import type { BaseItem } from '@algolia/autocomplete-shared/dist/esm/core';
import type { AutocompleteQuerySuggestionsHit } from '@algolia/autocomplete-plugin-query-suggestions/dist/esm/types';

export type AlgoliaIndexItem = BaseItem & {
  title: string;
  uuid: string;
  description: string;
  image: string;
  variations: string[];
  categories: string[];
  objectID: string;
};

export type ProductQuerySuggestHit = AutocompleteQuerySuggestionsHit & {
  title: string;
  uuid: string;
  description: string;
  image: string;
  variations: string[];
  categories: string[];
  objectID: string;
};

export type CategoryRecord = {
  label: string;
  count: number;
};

export type AutocompleteItem = Hit<AlgoliaIndexItem>;

export type RecentSearchHit = {
  id: string,
  label: string,
};