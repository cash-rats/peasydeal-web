import { Link } from '@remix-run/react';
import Button from '@mui/material/Button';
import { HiOutlineFire } from 'react-icons/hi';

import type { Category } from '~/shared/types';

interface ProductsSectionProps {
  categories?: Category[];
  showTitle?: boolean;
}

function ProductsSection({ categories = [], showTitle = true }: ProductsSectionProps) {
  return (
    <div className="flex flex-col">
      {
        showTitle
          ? (
            <span className="text-white font-bold text-lg">
              Product
            </span>
          )
          : null
      }

      <div className="mt-[10px]">
        <Link to={'/promotion/hot_deal'}>
          <Button
            style={{
              backgroundColor: '#d85140',
              fontSize: '1rem',
            }}
            size='small'
            variant='contained'
            startIcon={<HiOutlineFire />}
          >
            hot deal
          </Button >
        </Link>
      </div>

      <div className="flex flex-col gap-[10px] mt-[10px]">
        {
          categories.map((category, idx) => (
            <Link key={idx} to={`/${category.name}`}>
              <span
                className="text-base text-white font-normal capitalize"
              >
                {category.title}
              </span>
            </Link>
          ))
        }
      </div>
    </div >
  );
}

export default ProductsSection;
