import { useState } from "react";
import { cn } from "~/lib/utils";
import { CheckoutInput } from "~/components/v2/CheckoutInput/CheckoutInput";
import { Button } from "~/components/v2/Button/Button";


/* ------------------------------------------------------------------ */
/*  Illustration                                                       */
/* ------------------------------------------------------------------ */

function ShippingBoxIcon() {
  return (
    <img src="/empty-box.png" alt="Empty Box" className="mx-auto mt-12 opacity-30 w-[160px]" />
  );
}
export function TrackingSearch({
  initialQuery = "",
  onSearch,
  isLoading = false,
  className,
}: TrackingSearchProps) {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <div
      className={cn(
        "max-w-[var(--container-max)] mx-auto px-[var(--container-padding)]",
        "py-20 text-center",
        className
      )}
    >
      <h1 className="font-heading text-4xl font-bold text-black mb-3 max-redesign-sm:text-[28px]">
        Track Your Order
      </h1>
      <p className="font-body text-[15px] text-rd-text-body mb-10">
        Enter your order ID to check the status
      </p>

      <form
        onSubmit={handleSubmit}
        className="max-w-[560px] mx-auto flex gap-3 max-redesign-sm:flex-col"
      >
        <CheckoutInput
          label="Order ID (e.g., ORD-12345)"
          value={query}
          onChange={setQuery}
          className="flex-1"
        />
        <Button
          variant="primary"
          type="submit"
          isLoading={isLoading}
          className="max-redesign-sm:w-full h-12"
        >
          Track Order
        </Button>
      </form>

      {!initialQuery && <ShippingBoxIcon />}
    </div>
  );
}
