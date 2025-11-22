import { Link } from 'react-router';
import { HiOutlineFire } from 'react-icons/hi';

import { Button } from '~/components/ui/button';

import type { Category } from '~/shared/types';

interface ProductsSectionProps {
  categories?: Category[];
  showTitle?: boolean;
}

function ProductsSection({ categories = [], showTitle = true }: ProductsSectionProps) {
  return (
    <div className="flex flex-col">
      {showTitle ? (
        <span className="text-white font-bold text-lg">Product</span>
      ) : null}

      <div className="mt-[10px]">
        <Button
          asChild
          className="flex items-center gap-2 rounded-md bg-[#d85140] px-4 py-2 text-base font-semibold uppercase text-white hover:bg-[#b94434]"
        >
          <Link to="/promotion/hot_deal">
            <HiOutlineFire aria-hidden className="h-4 w-4" />
            hot deal
          </Link>
        </Button>
      </div>

      <div className="mt-[10px] flex flex-col gap-[10px]">
        {categories.map((category, idx) => (
          <Link key={idx} to={`/collection/${category.name}`}>
            <span className="text-base text-white font-normal capitalize">{category.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ProductsSection;
