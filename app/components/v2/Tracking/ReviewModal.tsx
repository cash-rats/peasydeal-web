import { useState, useCallback } from "react";
import { cn } from "~/lib/utils";
import { Modal } from "~/components/v2/Modal";
import { CheckoutInput } from "~/components/v2/CheckoutInput/CheckoutInput";
import { Button } from "~/components/v2/Button/Button";
import type { TrackOrderProduct } from "~/routes/tracking/types";

/* ------------------------------------------------------------------ */
/*  Star Rating                                                        */
/* ------------------------------------------------------------------ */

function Star({ filled, onClick, onHover }: {
  filled: boolean;
  onClick: () => void;
  onHover: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onHover}
      className="cursor-pointer transition-transform duration-fast hover:scale-[1.15]"
      aria-label="Rate"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
          fill={filled ? "#000000" : "none"}
          stroke={filled ? "#000000" : "#CCCCCC"}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Animated Checkmark (Success)                                       */
/* ------------------------------------------------------------------ */

function AnimatedCheckmark() {
  return (
    <svg width="56" height="56" viewBox="0 0 64 64" fill="none" className="mx-auto mb-4" aria-hidden="true">
      <circle cx="32" cy="32" r="30" stroke="#4A7C59" strokeWidth="2" fill="none"
        style={{ strokeDasharray: 188, strokeDashoffset: 188, animation: "checkmark-circle 400ms ease forwards" }} />
      <path d="M20 33L28 41L44 25" stroke="#4A7C59" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
        style={{ strokeDasharray: 36, strokeDashoffset: 36, animation: "checkmark-check 300ms ease forwards 250ms" }} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  ReviewModal                                                        */
/* ------------------------------------------------------------------ */

export interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  product: TrackOrderProduct | null;
  orderUUID: string;
  onSubmit: (data: {
    name: string;
    rating: number;
    review: string;
    images: File[];
    productUUID: string;
    orderUUID: string;
  }) => Promise<void>;
}

export function ReviewModal({
  open,
  onClose,
  product,
  orderUUID,
  onSubmit,
}: ReviewModalProps) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(3);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []).slice(0, 2 - images.length);
      if (files.length === 0) return;
      setImages((prev) => [...prev, ...files].slice(0, 2));
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          setPreviews((prev) => [...prev, reader.result as string].slice(0, 2));
        };
        reader.readAsDataURL(file);
      });
    },
    [images.length]
  );

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!review.trim()) {
      setError("Please write a review");
      return;
    }
    if (!product) return;

    setIsLoading(true);
    setError("");
    try {
      await onSubmit({
        name,
        rating,
        review: review.trim(),
        images,
        productUUID: product.uuid,
        orderUUID,
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset after animation
    setTimeout(() => {
      setName("");
      setRating(3);
      setReview("");
      setImages([]);
      setPreviews([]);
      setSuccess(false);
      setError("");
    }, 300);
  };

  if (!product) return null;

  return (
    <Modal open={open} onClose={handleClose} maxWidth="520px">
      {success ? (
        /* Success state */
        <div className="text-center py-6">
          <AnimatedCheckmark />
          <p className="font-heading text-xl font-bold text-black mb-2">
            Thank you!
          </p>
          <p className="font-body text-sm text-rd-text-body mb-6">
            Your review helps our community.
          </p>
          <Button variant="primary" onClick={handleClose}>
            Continue Shopping
          </Button>
        </div>
      ) : (
        /* Form state */
        <>
          {/* Product info */}
          <div className="flex gap-3.5 items-center pb-5 border-b border-[#F0F0F0] mb-6">
            {product.url && (
              <img
                src={product.url}
                alt=""
                className="w-16 h-16 rounded-rd-sm object-cover bg-rd-bg-card flex-shrink-0"
              />
            )}
            <p className="font-body text-sm font-medium text-black">
              {product.title}
            </p>
          </div>

          {/* Name input */}
          <CheckoutInput
            label="Your name"
            value={name}
            onChange={setName}
            className="mb-2"
          />
          <p className="font-body text-xs text-rd-text-muted mb-5 flex items-center gap-1">
            We won't display your full name
          </p>

          {/* Star rating */}
          <div className="flex gap-1 mb-5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                filled={star <= (hoverRating || rating)}
                onClick={() => setRating(star)}
                onHover={() => setHoverRating(star)}
              />
            ))}
          </div>

          {/* Review textarea */}
          <div className="mb-4">
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value.slice(0, 100))}
              placeholder="Share your experience..."
              className={cn(
                "w-full h-[120px] p-3.5 border rounded-rd-sm font-body text-sm text-black resize-none outline-none",
                "transition-all duration-fast",
                error
                  ? "border-[#C75050] shadow-[0_0_0_1px_#C75050]"
                  : "border-[#CCC] focus:border-black focus:shadow-[0_0_0_1px_#000]"
              )}
            />
            <div className="flex justify-between mt-1">
              {error && (
                <p className="font-body text-xs text-[#C75050]">{error}</p>
              )}
              <p className="font-body text-[11px] text-rd-text-muted ml-auto">
                {review.length}/100
              </p>
            </div>
          </div>

          {/* Image upload */}
          <div className="mb-6">
            {images.length < 2 && (
              <label
                className={cn(
                  "block border-2 border-dashed border-rd-border-light rounded-rd-sm p-6 text-center",
                  "cursor-pointer transition-all duration-fast",
                  "hover:border-black hover:bg-[#FAFAFA]"
                )}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mx-auto mb-2 text-rd-text-muted" aria-hidden="true">
                  <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M16 10V22M10 16H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <p className="font-body text-[13px] text-rd-text-muted">
                  Upload up to 2 images
                </p>
              </label>
            )}

            {/* Preview thumbnails */}
            {previews.length > 0 && (
              <div className="flex gap-2 mt-3">
                {previews.map((src, i) => (
                  <div key={i} className="relative">
                    <img
                      src={src}
                      alt=""
                      className="w-[72px] h-[72px] rounded-rd-sm object-cover"
                    />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-black text-white rounded-full text-[10px] flex items-center justify-center cursor-pointer"
                      aria-label="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit} isLoading={isLoading}>
              Submit Review
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}
