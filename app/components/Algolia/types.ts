import type { BaseItem } from '@algolia/autocomplete-shared/dist/esm/core';

export type AlgoliaIndexItem = BaseItem & {
  title: string;
  uuid: string;
  description: string;
  image: string;
  variations: string[];
  categories: string[];
  objectID: string;
};