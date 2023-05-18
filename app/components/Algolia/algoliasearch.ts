import algoliasearch from 'algoliasearch';

import {
  ALGOLIA_APP_ID,
  ALGOLIA_APP_WRITE_KEY,
} from '~/utils/get_env_source';

const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_APP_WRITE_KEY);

export default searchClient