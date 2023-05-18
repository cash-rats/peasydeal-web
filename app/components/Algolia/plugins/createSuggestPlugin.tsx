// import { Fragment } from 'react';
// import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';

// import searchClient from '../algoliasearch';

// const querySuggestionPlugin = createQuerySuggestionsPlugin({
//   searchClient,
//   indexName,
//   getSearchParams() {
//     return recentSearchPlugin.data?.getAlgoliaSearchParams({
//       hitsPerPage: 5,
//     });
//   },
//   transformSource({ source }) {
//     return {
//       ...source,
//       templates: {
//         ...source.templates,
//         item({ item, components }: { item: AlgoliaIndexItem, components: AutocompleteComponents }) {
//           return <ProductItem hit={item} components={components} />;
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

// export default  querySuggestionPlugin