import { Fragment } from 'react';
import { BsStarFill, BsStarHalf, BsStar } from 'react-icons/bs';

interface ProductRatingProps {
  value?: number | null;
  max?: number;
  className?: string;
}

export default function ProductRating({
  value = 0,
  max = 5,
  className = '',
}: ProductRatingProps) {
  const safeValue = Math.max(0, Math.min(value ?? 0, max));
  const fullCount = Math.floor(safeValue);
  const hasHalf = safeValue - fullCount >= 0.5;
  const emptyCount = Math.max(0, max - fullCount - (hasHalf ? 1 : 0));

  return (
    <span className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: fullCount }).map((_, index) => (
        <Fragment key={`full-${index}`}>
          <BsStarFill className="text-yellow-400" aria-hidden />
        </Fragment>
      ))}

      {hasHalf ? <BsStarHalf className="text-yellow-400" aria-hidden /> : null}

      {Array.from({ length: emptyCount }).map((_, index) => (
        <Fragment key={`empty-${index}`}>
          <BsStar className="text-gray-300" aria-hidden />
        </Fragment>
      ))}
    </span>
  );
}
