import { useMemo, useState } from 'react';
import type { ChangeEvent, FocusEvent, MouseEvent } from 'react';
import { Link } from 'react-router';
import { BsTrash } from 'react-icons/bs';
import { ImPriceTags } from 'react-icons/im';

import { SUPER_DEAL_OFF } from '~/shared/constants';
import QuantityDropDown from '~/components/QuantityDropDown';
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
    <div className="
			p-4 md:p-4
			mt-4
			mb-12 md:mb-0
			bg-white
			md:grid grid-cols-12 gap-4
			relative
		">

      {/* Item image */}
      <div className="flex items-center col-span-6">
        <div className="grid grid-cols-12">
          <div className="col-span-12 flex flex-row items-center justify-start">
            <div className="flex aspect-square max-w-[120px] mr-4 overflow-hidden">
              <Link to={composeProductDetailURL({ productName: item.title, productUUID: item.productUUID })}>
                <img
                  className='my-auto slef-center'
                  alt={item.title}
                  src={item.image}
                />
              </Link>
            </div>

            <div className="flex flex-col">
              <p className="text-lg font-medium mb-2">
                <Link to={composeProductDetailURL({ productName: item.title, productUUID: item.productUUID })}>
                  {item.title}
                </Link>
              </p>

              <p className="text-sm">
                Variation: {item.description}
              </p>

              {
                item.discountReason
                  ? (
                    <div className="mt-2 hidden md:flex">
                      <span className='flex items-center w-fit mb-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700'>
                        <ImPriceTags className='mr-1 text-blue-500' />
                        <span>{item.discountReason}</span>
                      </span>
                    </div>
                  )
                  : null
              }


              <div className="items-center flex flex-row md:hidden my-4">
                <span className='text-lg font-poppins font-bold mr-2'>£{item.salePrice} </span>
                <div className="relative w-fit">
                  <span className='flex flex-col w-fit'>
                    <span>£{item.retailPrice}</span>
                    <div className="block h-[1px] w-full bg-black absolute top-[10px]"></div>
                  </span>
                </div>
              </div>
              {
                isSuperDeal ? (
                  <div className='w-fit text-sm block md:hidden font-slate-500'>
                    Final charge will be: <span className='font-bold'>£{round10(item.salePrice * SUPER_DEAL_OFF, -2)}</span>
                  </div>
                ) : null
              }
            </div>
          </div>

        </div>
      </div>


      <div className="col-span-2 text-right self-center hidden md:flex flex-row md:flex-col">
        <div className="relative w-fit ml-auto">
          <span className='flex flex-col w-fit'>
            <span>£{item.retailPrice}</span>
            <div className="block h-[1px] w-full bg-black absolute top-[10px]"></div>
          </span>
        </div>
        <span className='text-lg font-poppins font-medium text-[#D02E7D]'>£{item.salePrice}</span>
        {
          isSuperDeal ? (
            <div className='w-fit text-sm font-slate-500'>
              Final charge will be: <span className='font-bold'>£{round10(item.salePrice * SUPER_DEAL_OFF, -2)}</span>
            </div>
          ) : null
        }
      </div>

      {
        item.discountReason
          ? (
            <div className="border-t-[#efefef] border-t md:hidden mt-4 pt-4 pb-1">
              <span className='flex items-center w-fit mb-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700'>
                <ImPriceTags className='mr-1 text-blue-500' />
                <span>{item.discountReason}</span>
              </span>
            </div>
          )
          : null
      }

      <div className="
				col-span-2 text-right self-center
				flex flex-row md:flex-col
				gap-4 md:gap-0
				pt-4 mt-2 md:pt-0 md:mt-0
				border-t-[#efefef] md:border-0
				border-t
			">
        <div className="flex flex-col flex-auto">
          <span className="flex md:hidden font-medium mb-2">Quantity</span>
          <QuantityDropDown
            value={item.quantity}
            onClickNumber={onClickQuantity}
            onChange={handleChangeQuantity}
            onBlur={handleBlurQuantity}
            disabled={calculating}
            purchaseLimit={item.purchaseLimit}
          />
          {
            exceedMaxMsg && (
              <p className="mt-0 w-full mt text-[#757575] font-sm md:absolute top-[-25px]">
                Max {item.purchaseLimit} pieces
              </p>
            )
          }
        </div>
        <div className="flex md:hidden flex-col  ml-auto">
          <span className="flex font-medium mb-2">Subtotal</span>
          <div className='center md:hidden self-center text-[#D02E7D] text-2xl'>
            <SubTotalPriceTag quantity={item.quantity} salePrice={item.salePrice} calculating={calculating} />
          </div>
        </div>
      </div>

      <div className="hidden md:block col-span-2 text-right self-center text-lg">
        <SubTotalPriceTag quantity={item.quantity} salePrice={item.salePrice} calculating={calculating} />
      </div>
      <div className="
				absolute
				bottom-[-38px] right-1 md:bottom-2 md:right-2
			">
        <button
          type="button"
          className="flex items-center rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          onClick={(evt) => onClickRemove(evt, item.variationUUID)}
        >
          <BsTrash fontSize={18} className='text-slate-500' />
          <span className='ml-2 text-sm'>Delete</span>
        </button>
      </div>
    </div>
  );
}

export default CartItem;
