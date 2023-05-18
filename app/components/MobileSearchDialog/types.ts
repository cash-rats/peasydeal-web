import type { Hit } from '@algolia/client-search';

import type { AlgoliaIndexItem } from '~/components/Algolia/types';

export type AutocompleteItem = Hit<AlgoliaIndexItem>;