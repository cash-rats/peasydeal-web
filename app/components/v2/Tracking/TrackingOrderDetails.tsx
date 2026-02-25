import { cn } from "~/lib/utils";
import { Badge } from "~/components/v2/Badge/Badge";
import type { BadgeProps } from "~/components/v2/Badge/Badge";
import type { TrackOrder, TrackOrderProduct } from "~/routes/tracking/types";

/* ------------------------------------------------------------------ */
/*  Status badge mapping                                               */
/* ------------------------------------------------------------------ */

const statusBadgeMap: Record<string, { variant: BadgeProps["variant"]; label: string }> = {
  order_received: { variant: "limited", label: "Order Received" },
  processing: { variant: "hot", label: "Processing" },
  complete: { variant: "discount", label: "Completed" },
  cancelled: { variant: "new", label: "Cancelled" },
  hold: { variant: "hot", label: "On Hold" },
};

const paymentStatusMap: Record<string, string> = {
  paid: "Paid",
  unpaid: "Unpaid",
  review_refund: "Processing refund",
  refunded: "Refunded",
};

/* ------------------------------------------------------------------ */
/*  OrderHeader                                                        */
/* ------------------------------------------------------------------ */

export interface OrderHeaderProps {
  order: TrackOrder;
  className?: string;
}

export function OrderHeader({ order, className }: OrderHeaderProps) {
  const badge = statusBadgeMap[order.order_status] || {
    variant: "limited" as const,
    label: order.order_status,
  };
  const orderDate = order.parsed_created_at
    ? new Date(order.parsed_created_at).toLocaleDateString("en-GB", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div
      className={cn(
        "bg-rd-bg-card rounded-rd-md p-8",
        "flex justify-between items-start flex-wrap gap-6",
        "mb-8",
        className
      )}
    >
      <div>
        <p className="font-body text-[13px] font-medium text-rd-text-secondary uppercase tracking-[0.5px]">
          Order
        </p>
        <p className="font-heading text-2xl font-bold text-black mt-1">
          {order.order_uuid}
        </p>
        {orderDate && (
          <p className="font-body text-sm text-rd-text-body mt-2">
            Ordered {orderDate}
          </p>
        )}
      </div>
      <Badge variant={badge.variant}>{badge.label}</Badge>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Alert Banner                                                       */
/* ------------------------------------------------------------------ */

export function AlertBanner({
  children,
  variant = "error",
}: {
  children: React.ReactNode;
  variant?: "error" | "info";
}) {
  const styles =
    variant === "error"
      ? "bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]"
      : "bg-[#EFF6FF] border-[#BFDBFE] text-[#1E40AF]";

  return (
    <div
      className={cn(
        "rounded-rd-sm p-3.5 px-4 flex items-center gap-2.5 mb-6 border",
        styles
      )}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-shrink-0" aria-hidden="true">
        <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.2" />
        <path d="M9 5V10M9 12.5V13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
      <span className="font-body text-sm">{children}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Product List                                                       */
/* ------------------------------------------------------------------ */

export interface ProductListProps {
  products: TrackOrderProduct[];
  onReview?: (product: TrackOrderProduct) => void;
  className?: string;
}

export function ProductList({ products, onReview, className }: ProductListProps) {
  return (
    <div
      className={cn(
        "border border-rd-border-light rounded-rd-md overflow-hidden mb-8",
        className
      )}
    >
      {products.map((product, i) => (
        <div
          key={`${product.uuid}-${i}`}
          className={cn(
            "flex items-center gap-4 px-5 py-4",
            i < products.length - 1 && "border-b border-[#F0F0F0]"
          )}
        >
          {product.url && (
            <img
              src={product.url}
              alt=""
              className="w-16 h-16 rounded-rd-sm object-cover bg-rd-bg-card flex-shrink-0"
              loading="lazy"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-body text-sm font-medium text-black truncate">
              {product.title}
            </p>
            {product.spec_name && (
              <p className="font-body text-[13px] text-rd-text-muted mt-0.5">
                {product.spec_name}
              </p>
            )}
            <p className="font-body text-[13px] text-rd-text-secondary mt-0.5">
              Qty: {product.order_quantity}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-body text-sm font-semibold text-black">
              £{product.sale_price}
            </p>
            {product.can_review && onReview && (
              <button
                onClick={() => onReview(product)}
                className="font-body text-[13px] text-black underline underline-offset-[3px] mt-1 cursor-pointer"
              >
                Review
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Delivery Info                                                      */
/* ------------------------------------------------------------------ */

export interface DeliveryInfoProps {
  order: TrackOrder;
  className?: string;
}

export function DeliveryInfo({ order, className }: DeliveryInfoProps) {
  return (
    <div
      className={cn(
        "border border-rd-border-light rounded-rd-md p-6 mb-8",
        className
      )}
    >
      <h3 className="font-body text-sm font-semibold uppercase tracking-[0.5px] text-black mb-5">
        Delivery Information
      </h3>
      <div className="grid grid-cols-1 redesign-sm:grid-cols-2 gap-5">
        <InfoField
          label="Contact"
          value={order.display_name || order.contact_name}
        />
        <InfoField
          label="Address"
          value={order.display_address || order.address}
        />
        <InfoField
          label="Payment"
          value={paymentStatusMap[order.payment_status] || order.payment_status}
        />
        {order.payment_status === "paid" && order.shipping_status && (
          <InfoField label="Shipping" value={order.shipping_status} />
        )}
      </div>

      {/* Tracking table */}
      {order.tracking_number && (
        <div className="mt-5">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left font-body text-xs font-semibold uppercase tracking-[0.5px] text-rd-text-muted py-2.5 border-b-2 border-black">
                  Tracking Number
                </th>
                <th className="text-left font-body text-xs font-semibold uppercase tracking-[0.5px] text-rd-text-muted py-2.5 border-b-2 border-black">
                  Carrier
                </th>
                <th className="text-left font-body text-xs font-semibold uppercase tracking-[0.5px] text-rd-text-muted py-2.5 border-b-2 border-black">
                  Link
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-body text-sm py-3 border-b border-[#F0F0F0]">
                  {order.tracking_number}
                </td>
                <td className="font-body text-sm py-3 border-b border-[#F0F0F0]">
                  {order.carrier || "—"}
                </td>
                <td className="font-body text-sm py-3 border-b border-[#F0F0F0]">
                  {order.tracking_link ? (
                    <a
                      href={order.tracking_link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-black underline"
                    >
                      Track
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-body text-xs text-rd-text-muted mb-1">{label}</p>
      <p className="font-body text-sm font-medium text-black">{value}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Order Summary                                                      */
/* ------------------------------------------------------------------ */

export interface OrderSummaryProps {
  order: TrackOrder;
  className?: string;
}

export function TrackingOrderSummary({ order, className }: OrderSummaryProps) {
  return (
    <div
      className={cn(
        "border border-rd-border-light rounded-rd-md p-6 mb-8",
        className
      )}
    >
      <SummaryRow label="Subtotal (VAT Incl.)" value={`£${order.subtotal}`} />
      <SummaryRow label="Shipping" value={`£${order.shipping_fee}`} />
      {order.discount_amount > 0 && (
        <SummaryRow
          label="Discount"
          value={`-£${order.discount_amount}`}
        />
      )}
      <div className="border-t border-rd-border-light mt-2 pt-3">
        <SummaryRow
          label="Total"
          value={`£${order.total_amount}`}
          bold
        />
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  bold = false,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex justify-between py-2 font-body text-sm">
      <span className={cn("text-rd-text-body", bold && "font-bold text-black text-base")}>
        {label}
      </span>
      <span className={cn("font-medium text-black", bold && "font-bold text-base")}>
        {value}
      </span>
    </div>
  );
}
