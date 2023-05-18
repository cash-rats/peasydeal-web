import {
  useCallback,
  useReducer,
  useEffect,
  Fragment,
} from 'react';
import { createAutocomplete } from '@algolia/autocomplete-core';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  IconButton,
} from '@chakra-ui/react';
import { VscArrowLeft } from "react-icons/vsc";
import type { GetSources, OnStateChangeProps } from '@algolia/autocomplete-shared';
import { getAlgoliaResults } from '@algolia/autocomplete-js'
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import type { AutocompleteComponents } from '@algolia/autocomplete-shared';

import SearchBar from '~/components/SearchBar';
import { ALGOLIA_INDEX_NAME } from '~/utils/get_env_source';
import type { AlgoliaIndexItem } from '~/components/Algolia/types';
// import { Autocomplete, searchClient, ProductHit } from '~/components/Algolia';

// import reducer, { setAutoCompleteState } from './reducer';
import Autocomplete from './Autocomplete';

interface MobileSearchDialogProps {
  onBack?: () => void;

  isOpen: boolean;
}

function MobileSearchDialog({
  isOpen = false,
  onBack = () => { },
}: MobileSearchDialogProps) {
  // const [state, dispatch] = useReducer(
  //   reducer,
  //   {
  //     autoCompleteState: {
  //       activeItemId: null,
  //       collections: [],
  //       completion: null,
  //       context: {},
  //       isOpen: false,
  //       query: '',
  //       status: 'idle'
  //     },
  //   },
  // );


  // const getSources: GetSources<AlgoliaIndexItem> = useCallback(
  //   () => {
  //     return [
  //       {
  //         sourceId: 'products',
  //         getItems({ query }) {
  //           return getAlgoliaResults({
  //             searchClient,
  //             queries: [
  //               {
  //                 indexName: ALGOLIA_INDEX_NAME,
  //                 query,
  //               }
  //             ],
  //           });
  //         },
  //         templates: {
  //           item({ item }) {
  //             return `${item.title}`
  //           },
  //         },
  //       },
  //     ];
  //   }, [])

  // const onStateChange = ({ state }: OnStateChangeProps<AlgoliaIndexItem>) => {
  //   dispatch(setAutoCompleteState(state))
  // };

  // const onChangeQuery

  // const autocomplete = createAutocomplete({
  //   onStateChange,
  //   getSources,
  // });

  // console.log('debug autocomplete', autocomplete);

  // const querySuggestionPlugin = createQuerySuggestionsPlugin({
  //   searchClient,
  //   indexName: ALGOLIA_INDEX_NAME,
  //   // getSearchParams() {
  //   //   return recentSearchPlugin.data?.getAlgoliaSearchParams({
  //   //     hitsPerPage: 5,
  //   //   });
  //   // },
  //   transformSource({ source }) {
  //     return {
  //       ...source,
  //       templates: {
  //         ...source.templates,
  //         item({ item, components }: { item: AlgoliaIndexItem, components: AutocompleteComponents }) {
  //           return <ProductHit hit={item} components={components} />;
  //         },
  //         header({ state }) {
  //           if (state.query) {
  //             return null;
  //           }

  //           return (
  //             <Fragment>
  //               <span className="aa-SourceHeaderTitle">Popular searches</span>
  //               <div className="aa-SourceHeaderLine" />
  //             </Fragment>
  //           );
  //         },
  //       },
  //     };
  //   },
  // });

  return (
    <Modal
      scrollBehavior='inside'
      size='full'
      // isOpen={isOpen}
      isOpen
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

              {/* Search bar */}
              <div className="w-full ml-[10px]">
                <Autocomplete
                  placeholder='Search'
                  openOnFocus
                />

              </div>
            </div>

            {/* <div>
              {
                state.autoCompleteState.collections.map((collection, cidx) => {
                  const { source, items } = collection;
                  return (
                    <Fragment key={cidx}>
                      {
                        items.map(item => {
                          return `${item.title}`
                        })
                      }
                    </Fragment>
                  )
                })
              }
            </div> */}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default MobileSearchDialog;