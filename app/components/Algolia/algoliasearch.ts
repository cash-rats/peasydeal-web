import { liteClient as algoliasearch } from 'algoliasearch/lite';
import invariant from 'tiny-invariant';

import { envs } from '~/utils/env';

let searchClient: ReturnType<typeof algoliasearch> | null = null;

export function getSearchClient() {
  if (!searchClient) {
    invariant(envs.ALGOLIA_APP_ID, 'ALGOLIA_APP_ID can not be empty');
    invariant(envs.ALGOLIA_APP_SEARCH_KEY, 'ALGOLIA_APP_SEARCH_KEY can not be empty');

    searchClient = algoliasearch(envs.ALGOLIA_APP_ID, envs.ALGOLIA_APP_SEARCH_KEY);
  }

  return searchClient;
}
