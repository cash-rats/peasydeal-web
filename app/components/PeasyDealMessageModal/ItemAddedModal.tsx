
import { HiArrowRight, HiCheckCircle, HiShoppingBag, HiXMark } from 'react-icons/hi2';
import { Link } from 'react-router';
import type { ShoppingCart, ShoppingCartItem } from '~/sessions/types';
import { useOptionalCartContext } from '~/routes/hooks/cartContext';

import SimpleModal from '~/components/SimpleModal';

interface ItemAddedModalProps {
  open?: boolean;
  onClose?: () => void;
  onContinueShopping?: () => void;
  onViewCart?: () => void;
  item?: ShoppingCartItem;
  cartCount?: number;
  color?: string;
  freeShippingNote?: string;
}

const formatPrice = (raw: string) => {
  const trimmed = raw.trim();
  if (!trimmed) return '';

  const normalized = trimmed.replace(/[^0-9.]/g, '');
  const numeric = Number.parseFloat(normalized);
  if (Number.isFinite(numeric)) return `$${numeric.toFixed(2)}`;

  return trimmed;
};

const getMostRecentlyAddedItem = (cart: ShoppingCart): ShoppingCartItem | undefined => {
  const items = Object.values(cart);
  if (items.length === 0) return undefined;

  return items.reduce<ShoppingCartItem>((latest, candidate) => {
    const latestTime = Number.parseInt(latest.added_time ?? '0', 10);
    const candidateTime = Number.parseInt(candidate.added_time ?? '0', 10);
    return candidateTime > latestTime ? candidate : latest;
  }, items[0]);
};

const ItemAddedModal = ({
  open = false,
  onClose,
  onContinueShopping,
  onViewCart,
  item,
  cartCount,
  color,
  freeShippingNote = 'Free shipping on orders over £19.99',
}: ItemAddedModalProps) => {
  const iconColor = color ?? '#10B981';
  const cartContext = useOptionalCartContext();

  const resolvedCartCount = cartCount ?? cartContext?.cartCount;
  const resolvedItem = item ?? (cartContext ? getMostRecentlyAddedItem(cartContext.cart) : undefined);
  const viewCartLabel = typeof resolvedCartCount === 'number'
    ? `View Cart (${resolvedCartCount})`
    : 'View Cart';

  return (
    <SimpleModal
      open={open}
      onClose={onClose}
      showOverlay
      overlayOpacity={40}
      overlayClassName="backdrop-blur-sm"
      size="md"
      showCloseButton={false}
      showCloseIcon={false}
      contentClassName="p-0 overflow-hidden border border-slate-100 shadow-2xl"
    >
      <div role="status" aria-live="polite" className="relative">
        {onClose ? (
          <button
            type="button"
            aria-label="Close modal"
            className="absolute right-4 top-4 z-10 rounded-full p-2 text-slate-400 transition-colors hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            onClick={onClose}
          >
            <HiXMark className="h-5 w-5" />
          </button>
        ) : null}

        <div className="relative flex flex-col items-center overflow-hidden px-8 pb-6 pt-10 text-center">
          <div className="absolute left-1/2 top-0 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-2xl" />

          <div className="relative mb-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 shadow-[0_0_20px_rgba(16,185,129,0.25)] ring-4 ring-white">
              <HiCheckCircle size={36} color={iconColor} className="text-emerald-500" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900">Added to Cart!</h2>
          <p className="mt-1 text-sm text-slate-500">
            The item has been successfully added to your shopping bag.
          </p>
        </div>

        {resolvedItem ? (
          <div className="flex items-start gap-4 border-y border-slate-200 bg-slate-50 px-8 py-6">
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              <img
                alt={resolvedItem.title}
                src={resolvedItem.image}
                className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-110"
                loading="eager"
              />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-base font-semibold text-slate-900">
                {resolvedItem.title}
              </h3>
              <p className="mt-1 text-sm text-slate-500">{resolvedItem.specName}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-900">
                  {formatPrice(resolvedItem.salePrice)}
                </span>
                <div className="flex items-center text-xs text-slate-500">
                  <HiShoppingBag className="mr-1 h-4 w-4" />
                  Qty: {resolvedItem.quantity}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-3 px-8 py-6 sm:flex-row sm:gap-3">
          <button
            type="button"
            className="inline-flex w-full flex-1 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            onClick={() => (onContinueShopping ? onContinueShopping() : onClose?.())}
          >
            Continue Shopping
          </button>

          {onViewCart ? (
            <button
              type="button"
              className="inline-flex w-full flex-1 items-center justify-center rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onClick={onViewCart}
            >
              {viewCartLabel}
              <HiArrowRight className="ml-2 h-4 w-4" />
            </button>
          ) : (
            <Link
              to="/cart"
              className="inline-flex w-full flex-1 items-center justify-center rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {viewCartLabel}
              <HiArrowRight className="ml-2 h-4 w-4" />
            </Link>
          )}
        </div>

        <div className="px-8 pb-4 text-center">
          <p className="text-xs text-slate-500">{freeShippingNote}</p>
        </div>
      </div>
    </SimpleModal>
  );
}

export default ItemAddedModal;
