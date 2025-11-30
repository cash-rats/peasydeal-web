// create a react component called CategoryPreview
import { Link } from 'react-router';
import { VscArrowRight } from "react-icons/vsc";

import type { TCategoryPreview } from "~/shared/types";
import { ProductRow } from "~/components/ProductRow";
import { Button } from '~/components/ui/button';

type ICategoryPreview = {
  category: TCategoryPreview;
  onClickProduct?: (title: string, prodID: string) => void;
}

export const CategoryPreview = ({
  category,
  onClickProduct = () => { },
}: ICategoryPreview) => {
  const {
    label,
    name,
    desc,
    items,
    type,
  } = category;

  return (
    <>
      <div className="flex flex-col">
        <h3 className="
          font-poppins font-semibold
          text-2xl md:text-3xl
          mt-6 md:mt-8
          mb-2 md:mb-3
          flex
          items-center
        ">
          <span>{label}</span>
          <div className="block w-[1px] h-[25px] bg-[#757575] mr-1 ml-6" />
          <Button
            asChild
            variant='ghost'
            size='lg'
            className='text-teal-600 hover:text-teal-700 px-2 font-medium'
            onClick={() => {
              window.rudderanalytics?.track(`click_preview_top_see_all`, {
                category: name,
              });
            }}
          >
            <Link to={
              type === 'promotion'
                ? `/promotion/${name}`
                : `/collection/${name}`
            } className="flex items-center gap-2">
              <span>See all</span>
              <VscArrowRight className="h-5 w-5" aria-hidden />
            </Link>
          </Button>
        </h3>
        <h4 className="
          font-poppins font-normal
          text-md md:text-lg
          mb-4 md:mb-6
        ">
          {desc}
        </h4>
      </div>

      <ProductRow
        products={items}
        onClickProduct={onClickProduct}
      />

      <div className="flex justify-center w-full mt-8 mb-10">
        <Button
          asChild
          variant='outline'
          size='lg'
          className='border-pink-400 text-pink-600 hover:bg-pink-50'
          onClick={() => {
            window.rudderanalytics?.track(`click_preview_bottom_see_all`, {
              category: name,
            });
          }}
        >
          <Link to={
            type === 'promotion'
              ? `/promotion/${name}`
              : `/collection/${name}`
          } className="flex items-center gap-2">
            <span>See all in {label}</span>
            <VscArrowRight className="h-5 w-5" aria-hidden />
          </Link>
        </Button>
      </div>
    </>
  );
}
