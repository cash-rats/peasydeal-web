import { algoliasearch } from 'algoliasearch';

import { envs } from '~/utils/env';

const searchClient = algoliasearch(envs.ALGOLIA_APP_ID, envs.ALGOLIA_APP_WRITE_KEY);

export default searchClient