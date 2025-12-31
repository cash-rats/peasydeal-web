import { useMemo, useState } from 'react';
import type { ChangeEvent, FocusEvent, MouseEvent } from 'react';
import { Link } from 'react-router';
import { BsTrash } from 'react-icons/bs';
import { ImPriceTags } from 'react-icons/im';

import QuantityDropDown from '~/components/QuantityDropDown';
import { SUPER_DEAL_OFF } from '~/shared/constants';
import { round10 } from '~/utils/preciseRound';
import { composeProductDetailURL } from '~/utils';

type ItemProps = {
  productUUID: string;
  variationUUID: string;
  image: string;
  title: string;
  description: string;
  salePrice: number;
  retailPrice: number;
  quantity: number;
  purchaseLimit: number;
  discountReason?: string;
  tagComboTags: string;
}
interface CartItemProps {
  item: ItemProps;
  calculating?: boolean;
  onMinus?: (quantity: number, prodID: string, askRemoval: boolean) => void;
  onPlus?: (quantity: number, prodID: string) => void;
  onClickQuantity?: (evt: MouseEvent<HTMLLIElement>, number: number) => void;
  onChangeQuantity?: (evt: ChangeEvent<HTMLInputElement>, quantity: number) => void;
  onBlurQuantity?: (
    evt: FocusEvent<HTMLInputElement> | MouseEvent<HTMLLIElement>,
    number: number
  ) => void;
  onClickRemove?: (evt: MouseEvent<HTMLButtonElement>, prodID: string) => void;
}

interface ISubTotalPriceTagProps { quantity: number, salePrice: number, calculating: boolean };

const SkeletonBlock = ({ width, height }: { width: number; height: number }) => (
  <div
    className="animate-pulse rounded bg-slate-200"
    style={{ width, height }}
  />
);

const SubTotalPriceTag = ({ quantity, salePrice, calculating }: ISubTotalPriceTagProps) => {
  return (
    <span className='font-poppins font-bold'>
      {
        calculating
          ? (
            <div className='flex items-center'>
              <span className='ml-auto'>£ </span>
              <SkeletonBlock width={40} height={35} />
            </div>
          )
          : `£${(quantity * salePrice).toFixed(2)}`
      }
    </span>
  );
}

function CartItem({
  calculating = false,
  item = {
    productUUID: '',
    variationUUID: '',
    image: '',
    title: '',
    description: '',
    salePrice: 0,
    retailPrice: 0,
    quantity: 1,
    purchaseLimit: 10,
    discountReason: '',
    tagComboTags: '',
  },

  onChangeQuantity = () => { },
  onClickQuantity = () => { },
  onBlurQuantity = (evt: FocusEvent<HTMLInputElement> | MouseEvent<HTMLLIElement>, quantity: number) => { },
  onClickRemove = (evt: MouseEvent<HTMLButtonElement>, prodID: string) => { },
}: CartItemProps) {
  const [exceedMaxMsg, setExceedMaxMsg] = useState('');

  const handleChangeQuantity = (evt: ChangeEvent<HTMLInputElement>, quantity: number) => {
    setExceedMaxMsg('');
    if (quantity > item.purchaseLimit) {
      setExceedMaxMsg(`Max ${item.purchaseLimit} pieces`);
      return;
    }
    onChangeQuantity(evt, quantity);
  };

  const handleBlurQuantity = (evt: FocusEvent<HTMLInputElement> | MouseEvent<HTMLLIElement>, quantity: number) => {
    setExceedMaxMsg('');
    if (quantity > item.purchaseLimit) {
      setExceedMaxMsg(`Max ${item.purchaseLimit} pieces`);
      return;
    };
    onBlurQuantity(evt, quantity);
  };

  const isSuperDeal = useMemo(() => {
    const tags = item.tagComboTags && item.tagComboTags.split(',');

    return (tags || []).includes('super_deal');
  }, [item]);

  return (
    <div className="group bg-white rounded-2xl p-4 shadow-sm border border-slate-200 transition-all hover:shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-6 flex gap-4">
          <div className="w-24 h-24 shrink-0 bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
            <Link
              to={composeProductDetailURL({ productName: item.title, productUUID: item.productUUID })}
              className="block w-full h-full"
            >
              <img
                alt={item.title}
                src={item.image}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Link>
          </div>

          <div className="flex flex-col justify-between py-1 min-w-0">
            <div className="min-w-0">
              <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1">
                <Link to={composeProductDetailURL({ productName: item.title, productUUID: item.productUUID })}>
                  {item.title}
                </Link>
              </h3>
              <p className="text-sm text-slate-500">
                Variation: {item.description}
              </p>
            </div>

            {item.discountReason ? (
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold w-fit">
                <ImPriceTags className="text-sm text-blue-500" />
                <span>{item.discountReason}</span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="md:col-span-2 text-center">
          <div className="flex flex-col items-center">
            <span className="text-slate-400 line-through text-sm">£{item.retailPrice}</span>
            <span className="text-[#D02E7D] font-bold text-lg">£{item.salePrice}</span>
            {isSuperDeal ? (
              <span className="text-xs text-slate-500 mt-1 leading-tight">
                Final charge:
                <br />
                £{round10(item.salePrice * SUPER_DEAL_OFF, -2)}
              </span>
            ) : null}
          </div>
        </div>

        <div className="md:col-span-2 flex justify-center">
          <div className="w-20">
            <QuantityDropDown
              value={item.quantity}
              onClickNumber={onClickQuantity}
              onChange={handleChangeQuantity}
              onBlur={handleBlurQuantity}
              disabled={calculating}
              purchaseLimit={item.purchaseLimit}
            />
          </div>
          {exceedMaxMsg ? (
            <p className="mt-1 text-xs text-slate-500 text-center w-full md:hidden">
              Max {item.purchaseLimit} pieces
            </p>
          ) : null}
        </div>

        <div className="md:col-span-2 flex flex-row md:flex-col justify-between items-center md:items-end gap-2 md:gap-4 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
          <span className="font-bold text-slate-900 text-xl">
            <SubTotalPriceTag quantity={item.quantity} salePrice={item.salePrice} calculating={calculating} />
          </span>
          <button
            type="button"
            aria-label="Remove item"
            className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50 flex items-center gap-1 text-sm"
            onClick={(evt) => onClickRemove(evt, item.variationUUID)}
            disabled={calculating}
          >
            <BsTrash className="text-lg" />
            <span className="md:hidden">Remove</span>
          </button>
        </div>
      </div>

      {exceedMaxMsg ? (
        <p className="hidden md:block mt-2 text-xs text-slate-500">
          Max {item.purchaseLimit} pieces
        </p>
      ) : null}
    </div>
  );
}

export default CartItem;
