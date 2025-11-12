import { useState } from 'react';
import type { LinksFunction, LoaderFunctionArgs } from "react-router";
import {
  Outlet,
  useLoaderData,
  useOutletContext,
  useRouteLoaderData,
} from "react-router";
import httpStatus from 'http-status-codes';

import SearchBar from '~/components/SearchBar';
import CategoriesNav, { links as CategoriesNavLinks } from '~/components/Header/components/CategoriesNav';
// import MobileSearchDialog from '~/components/MobileSearchDialog';
// import type { Category } from '~/shared/types';
// import Footer, { links as FooterLinks } from '~/components/Footer';
// import Header, { links as HeaderLinks } from '~/components/Header';
// import DropDownSearchBar, { links as DropDownSearchBarLinks } from '~/components/DropDownSearchBar';
// import { fetchCategoriesWithSplitAndHotDealInPlaced } from '~/api/categories.server';

// @TODOs: deprecate followings infavor of algolia
// import DropDownSearchBar, { links as DropDownSearchBarLinks } from '~/components/_DropDownSearchBar';
// import { useSearchSuggests } from '~/routes/hooks/auto-complete-search';
// import useFetcherWithPromise from '~/routes/hooks/useFetcherWithPromise';
// import type { SuggestItem } from '~/shared/types';

// type LoaderType = {
//   categories: Category[];
//   navBarCategories: Category[];
// };

// export const links: LinksFunction = () => {
//   return [
//     ...FooterLinks(),
//     ...HeaderLinks(),
//     ...CategoriesNavLinks(),
//     ...DropDownSearchBarLinks(),
//   ];
// };

// type ContextType = {
//   categories: Category[],
//   navBarCategories: Category[]
// };


// export const loader = async ({ request }: LoaderFunctionArgs) => {
//   try {
//     const [navBarCategories, categories] = await fetchCategoriesWithSplitAndHotDealInPlaced();
//     return Response.json({
//       categories,
//       navBarCategories,
//     });
//   } catch (e) {
//     throw Response.json(e, {
//       status: httpStatus.INTERNAL_SERVER_ERROR,
//     });
//   }
// };

export default function LandingPage() {
  console.log('** aaa');
  // const { categories, navBarCategories } = useLoaderData<LoaderType>() || {};
  // const rootData = useRouteLoaderData("root") as any;
  // const cartCount = rootData?.cartCount || 0;
  // const [openSearchDialog, setOpenSearchDialog] = useState<boolean>(false);
  //
  // const handleOpen = () => setOpenSearchDialog(true);
  // const handleClose = () => setOpenSearchDialog(false);

  return (
    <>
      {/* sharethis popup for news letter subscription */}
      {/* <div className="powr-popup" id="sharethis-popup-635bb7bc9c9fa7001910fbe2"></div> */}
      <div>
        index page
      </div>
    </>
  );
}

// export function useContext() {
//   return useOutletContext<ContextType>();
// };
