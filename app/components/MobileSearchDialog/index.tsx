import {
  useEffect,
  useMemo,
} from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  IconButton,
} from '@chakra-ui/react';
import { VscArrowLeft } from "react-icons/vsc";
import { useNavigation } from '@remix-run/react';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';

import { createCategoriesPlugin } from '~/components/Algolia/plugins/createCategoriesPlugin';
import { searchClient } from '~/components/Algolia';
import type { ProductQuerySuggestHit } from '~/components/Algolia/types';
import { ALGOLIA_INDEX_NAME, DOMAIN } from '~/utils/get_env_source';

import Autocomplete from './Autocomplete';

interface MobileSearchDialogProps {
  onBack?: () => void;

  isOpen: boolean;
}

function MobileSearchDialog({
  isOpen = false,
  onBack = () => { },
}: MobileSearchDialogProps) {
  const navigate = useNavigation();

  const recentSearchPlugin = useMemo(() => {
    return createLocalStorageRecentSearchesPlugin({
      key: 'products-recent-search',
      limit: 3,
      transformSource({ source }) {
        return {
          ...source,
          getItemUrl({ item }) {
            return `${DOMAIN}/search?query=${item.label}`;
          },
        };
      }
    });
  }, []);

  const querySuggestionPlugin = useMemo(() => {
    return createQuerySuggestionsPlugin<ProductQuerySuggestHit>({
      searchClient,
      indexName: ALGOLIA_INDEX_NAME,
      getSearchParams() {
        return recentSearchPlugin.data?.getAlgoliaSearchParams({
          hitsPerPage: 5,
        });
      },
      transformSource({ source }) {
        return {
          ...source,
          getItemUrl({ item }) {
            return `${DOMAIN}/search?query=${item.title}`
          },
        };
      },
    });
  }, []);

  const categoriesPlugin = useMemo(() => {
    return createCategoriesPlugin({ searchClient });
  }, []);

  useEffect(() => {
    if (navigate.state === 'submitting') {
      onBack();
    }

    return () => {
      onBack();
    }
  }, [navigate.state]);

  return (
    <Modal
      scrollBehavior='inside'
      size='full'
      isOpen={isOpen}
      onClose={onBack}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <div>
            <div className="p-2 flex justify-end">

              {/* Back Button */}
              <IconButton
                aria-label='Back'
                onClick={onBack}
                icon={<VscArrowLeft style={{ fontSize: '32px' }} />}
              />

              {/* Autocomplete search bar */}
              <div className="w-full ml-[10px]">
                <Autocomplete
                  placeholder='Search'
                  openOnFocus
                  autoFocus
                  plugins={[
                    recentSearchPlugin,
                    querySuggestionPlugin,
                    categoriesPlugin,
                  ]}
                />
              </div>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default MobileSearchDialog;