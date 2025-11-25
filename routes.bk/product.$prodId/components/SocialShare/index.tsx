import { useEffect, useRef, useState, useCallback } from 'react';
import FocusLock from 'react-focus-lock';
import type { LinksFunction } from 'react-router';
import { MdOutlineIosShare } from 'react-icons/md';

import { Button } from '~/components/ui/button';

import styles from './styles/SocialShare.css?url';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

interface SocialShareProps {
  prodUUID: string;
}

const loadShareThisScript = () => {
  const script = document.createElement('script');
  script.async = true;
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
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const closePopover = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const st = (window as typeof window & { __sharethis__?: any }).__sharethis__;
    if (!st) {
      loadShareThisScript();
    } else if (typeof st.initialize === 'function') {
      removeShareThisScript();
      loadShareThisScript();
      st.href = window.location.href;
      st.initialize();
    }

    return () => {
      removeShareThisScript();
    };
  }, [prodUUID]);

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
        variant="ghost"
        size="sm"
        className="gap-2 text-white"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(prev => !prev)}
      >
        <MdOutlineIosShare aria-hidden />
        Share
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
              bg-black
              p-5
              shadow-xl
              text-white
            "
          >
            <button
              type="button"
              className="absolute right-2 top-2 text-sm"
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
