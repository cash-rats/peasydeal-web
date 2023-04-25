// create a react component called CategoryPreview

import type { TCategoryPreview } from "~/shared/types";
import { Button } from '@chakra-ui/react';
import type { ScrollPosition } from 'react-lazy-load-image-component';
import { Link } from '@remix-run/react';
import { VscArrowRight } from "react-icons/vsc";

import { CategoryType } from '~/shared/types';
import { ProductRow } from "~/components/ProductRow";

type ICategoryPreview = {
  category: TCategoryPreview;
  onClickProduct?: (title: string, prodID: string) => void;
  scrollPosition?: ScrollPosition;
}

export const CategoryPreview = ({
  category,
  onClickProduct = () => { },
  scrollPosition,
}: ICategoryPreview) => {
  const {
    label,
    name,
    desc,
    items,
    type,
  } = category;

  return (
    <div>
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
          <Link to={
            type === CategoryType.promotion
              ? `/promotion/${name}`
              : `/collection/${name}`
          }>
            <Button
              rightIcon={<VscArrowRight />}
              colorScheme='teal'
              variant='ghost'
              size='lg'
              onClick={() => {
                window.rudderanalytics?.track(`click_preview_top_see_all`, {
                  category: name,
                });
              }}
            >
              See all
            </Button>
          </Link>
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
        scrollPosition={scrollPosition}
        onClickProduct={onClickProduct}
      />

      <div className="flex justify-center w-full mt-8 mb-10">
        <Link to={
          type === CategoryType.promotion
            ? `/promotion/${name}`
            : `/collection/${name}`
        }>
          <Button
            rightIcon={<VscArrowRight />}
            colorScheme='pink'
            variant='outline'
            size='lg'
            onClick={() => {
              window.rudderanalytics?.track(`click_preview_bottom_see_all`, {
                category: name,
              });
            }}
          >
            See all in {label}
          </Button>
        </Link>
      </div>
    </div>
  );
}
