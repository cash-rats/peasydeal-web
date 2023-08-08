import algoliasearch from 'algoliasearch';

import { envs } from '~/utils/get_env_source';

const searchClient = algoliasearch(envs.ALGOLIA_APP_ID, envs.ALGOLIA_APP_WRITE_KEY);

export default searchClient