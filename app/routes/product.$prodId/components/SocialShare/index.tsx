import { useEffect, useRef, useState, useCallback } from 'react';
import FocusLock from 'react-focus-lock';
import { MdOutlineIosShare } from 'react-icons/md';

import { Button } from '~/components/ui/button';

interface SocialShareProps {
  prodUUID: string;
}

type ShareThis = {
  initialize?: () => void;
  href?: string;
};

const loadShareThisScript = (onLoad?: () => void) => {
  const script = document.createElement('script');
  script.async = true;
  if (onLoad) {
    script.onload = onLoad;
  }
  script.id = 'sharethis';
  script.src = 'https://platform-api.sharethis.com/js/sharethis.js#property=635bb7bc9c9fa7001910fbe2&product=sop';
  script.type = 'text/javascript';
  document.body.appendChild(script);
};

const removeShareThisScript = () => {
  const st = document.getElementById('sharethis');
  if (st && document.body.contains(st)) {
    document.body.removeChild(st);
  }
};

export default function SocialShare({ prodUUID }: SocialShareProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isShareThisReady, setIsShareThisReady] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const closePopover = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const st = (window as typeof window & { __sharethis__?: ShareThis }).__sharethis__;
    if (!st) {
      loadShareThisScript(() => setIsShareThisReady(true));
    } else {
      setIsShareThisReady(true);
      if (typeof st.initialize === 'function') {
        st.href = window.location.href;
        st.initialize();
      }
    }

    return () => {
      removeShareThisScript();
      setIsShareThisReady(false);
    };
  }, [prodUUID]);

  useEffect(() => {
    if (!isOpen || typeof window === 'undefined' || !isShareThisReady) return;

    const st = (window as typeof window & { __sharethis__?: ShareThis }).__sharethis__;
    if (!st?.initialize) return;

    st.href = window.location.href;
    st.initialize();
  }, [isOpen, isShareThisReady, prodUUID]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        panelRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      ) {
        return;
      }
      closePopover();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePopover();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closePopover]);

  return (
    <div className="relative flex justify-end">
      <Button
        ref={triggerRef}
        type="button"
        variant="outline"
        size="lg"
        className="bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-900 [&_svg]:size-5"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(prev => !prev)}
      >
        <MdOutlineIosShare aria-hidden />
        Share this product
      </Button>

      {isOpen ? (
        <FocusLock returnFocus persistentFocus={false}>
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="false"
            className="
              absolute
              z-20
              mt-2
              w-[280px]
              rounded-md
              border
              border-white/10
              bg-white
              p-5
              shadow-xl
              text-white
            "
          >
            <button
              type="button"
              className="absolute right-2 top-2 text-lg text-gray-400 hover:bg-gray-300 hover:text-gray-500 rounded-full p-1"
              onClick={closePopover}
              aria-label="Close share options"
            >
              ×
            </button>
            <div
              dangerouslySetInnerHTML={{
                __html: '<div class="sharethis-inline-share-buttons"></div>',
              }}
            />
          </div>
        </FocusLock>
      ) : null}
    </div>
  );
}
