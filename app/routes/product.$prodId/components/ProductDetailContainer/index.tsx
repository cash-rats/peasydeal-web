import { useState } from 'react';
import type { ChangeEvent } from 'react';
import type { LinksFunction } from 'react-router';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';

import type {
  ProductImg,
  ProductVariation,
  ProductDetail,
} from '../../types';
import type { ShoppingCartItem } from '~/sessions/types';

export const links: LinksFunction = () => {
  return [];
};

interface ProductDetailContainerParams {
  sharedImages: ProductImg[];
  variationImages: ProductImg[];
  productDetail: ProductDetail;
  variation: ProductVariation | undefined;
  variationErr: string;
  quantity: number;
  sessionStorableCartItem: ShoppingCartItem;
  isAddingToCart?: boolean;
  tags?: string[];

  onChangeVariation?: (v: any) => void;
  onChangeQuantity?: (evt: ChangeEvent<HTMLInputElement>) => void;
  onIncreaseQuantity?: () => void;
  onDecreaseQuantity?: () => void;
  addToCart?: () => void;
}

/**
 * Temporary extreme simplification to isolate dialog centering issues.
 */
function ProductDetailContainer(_: ProductDetailContainerParams) {
  const [open, setOpen] = useState(false);

  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-6 p-8'>
      <p className='text-center text-sm text-slate-500'>
        Product detail UI temporarily replaced with a barebones dialog test.
      </p>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            type='button'
            className='rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50'
          >
            Open test dialog
          </button>
        </DialogTrigger>

        <DialogContent className='max-w-sm'>
          <DialogHeader>
            <DialogTitle>Shadcn dialog sanity check</DialogTitle>
            <DialogDescription>
              If this dialog is not centered, the issue lives in the shared dialog styles.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProductDetailContainer;
