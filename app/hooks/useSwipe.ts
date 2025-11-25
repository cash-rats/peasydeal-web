import { useRef } from 'react';
import type { TouchEvent, MouseEvent } from 'react';

type UseSwipeOptions = {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
};

type SwipeEventHandlers = {
  onTouchStart: (event: TouchEvent) => void;
  onTouchEnd: (event: TouchEvent) => void;
  onMouseDown: (event: MouseEvent) => void;
  onMouseUp: (event: MouseEvent) => void;
};

const SWIPE_THRESHOLD = 40;

export function useSwipe({
  onSwipeLeft,
  onSwipeRight,
  threshold = SWIPE_THRESHOLD,
}: UseSwipeOptions): SwipeEventHandlers {
  const startXRef = useRef<number | null>(null);
  const startYRef = useRef<number | null>(null);
  const mouseDownRef = useRef(false);

  const handleSwipe = (endX: number, endY: number) => {
    if (startXRef.current === null || startYRef.current === null) {
      return;
    }

    const deltaX = endX - startXRef.current;
    const deltaY = Math.abs(endY - startYRef.current);

    if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        onSwipeRight?.();
      } else {
        onSwipeLeft?.();
      }
    }

    startXRef.current = null;
    startYRef.current = null;
  };

  const handleTouchStart = (event: TouchEvent) => {
    const touch = event.touches[0];
    startXRef.current = touch.clientX;
    startYRef.current = touch.clientY;
  };

  const handleTouchEnd = (event: TouchEvent) => {
    const touch = event.changedTouches[0];
    handleSwipe(touch.clientX, touch.clientY);
  };

  const handleMouseDown = (event: MouseEvent) => {
    mouseDownRef.current = true;
    startXRef.current = event.clientX;
    startYRef.current = event.clientY;
  };

  const handleMouseUp = (event: MouseEvent) => {
    if (!mouseDownRef.current) {
      return;
    }

    mouseDownRef.current = false;
    handleSwipe(event.clientX, event.clientY);
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
  };
}
