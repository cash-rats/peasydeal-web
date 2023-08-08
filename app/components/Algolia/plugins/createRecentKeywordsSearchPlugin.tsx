import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';

import { envs } from '~/utils/get_env_source';

export const PluginKey = 'products-recent-search';

const createRecentKeywordsSearchPlugins = () => {
  return createLocalStorageRecentSearchesPlugin({
    key: PluginKey,
    limit: 3,
    transformSource({ source }) {
      return {
        ...source,
        getItemUrl({ item }) {
          return `${envs.DOMAIN}/search?query=${item.label}`;
        },
      };
    }
  });
}

export default createRecentKeywordsSearchPlugins;