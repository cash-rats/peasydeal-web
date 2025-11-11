import { liteClient as algoliasearch } from 'algoliasearch/lite';
import invariant from 'tiny-invariant';

import { envs } from '~/utils/env';

let searchClient: ReturnType<typeof algoliasearch> | null = null;

export function getSearchClient() {
  console.log('~~ 1', envs.ALGOLIA_APP_ID, envs.ALGOLIA_APP_WRITE_KEY);
  if (!searchClient) {
    invariant(envs.ALGOLIA_APP_ID, `ALGOLIA_APP_ID can not be empty ${envs.ALGOLIA_APP_ID}`);
    invariant(envs.ALGOLIA_APP_WRITE_KEY, `ALGOLIA_APP_WRITE_KEY can not be empty ${envs.ALGOLIA_APP_WRITE_KEY}`);

    searchClient = algoliasearch(envs.ALGOLIA_APP_ID, envs.ALGOLIA_APP_WRITE_KEY);
  }

  return searchClient;
}
