import { useEffect, useRef } from 'react';
import FocusLock from "react-focus-lock";
import type { LinksFunction } from 'react-router';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  Button,
  useDisclosure,
} from '@chakra-ui/react'
import { MdOutlineIosShare } from 'react-icons/md';

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
  const script = document.createElement('script')
  script.async = true
  script.id = 'sharethis'
  script.src = 'https://platform-api.sharethis.com/js/sharethis.js#property=635bb7bc9c9fa7001910fbe2&product=sop'
  script.type = 'text/javascript';
  document.body.appendChild(script)
}

const removeShareThisScript = () => {
  const st = document.getElementById('sharethis');
  if (
    st &&
    document &&
    document.body &&
    document.body.contains(st)
  ) {
    document.body.removeChild(st);
  }
}

export default function SocialShare({ prodUUID }: SocialShareProps) {
  const { onOpen, onClose, isOpen } = useDisclosure()
  const firstFieldRef = useRef(null)

  useEffect(() => {
    if (!window) return;

    const st = window.__sharethis__;
    if (!st) {
      loadShareThisScript();
    } else if (typeof st.initialize === 'function') {
      removeShareThisScript();
      loadShareThisScript();
      st.href = window.location.href
      st.initialize()
    }

    return () => {
      removeShareThisScript()
    }
  }, [prodUUID])

  return (
    <div className='flex justify-end'>
      <Popover
        isOpen={isOpen}
        initialFocusRef={firstFieldRef}
        onOpen={onOpen}
        onClose={onClose}
        placement='bottom'
        closeOnBlur={false}
      >
        <PopoverTrigger>
          <Button
            leftIcon={<MdOutlineIosShare />}
            aria-label='share button'
            size='md'
            variant='ghost'
            colorScheme='white'
          >
            Share
          </Button>
        </PopoverTrigger>

        <PopoverContent px={5} py={8}>
          <FocusLock returnFocus persistentFocus={false}>
            <PopoverArrow />
            <PopoverCloseButton />
            <div
              dangerouslySetInnerHTML={{
                __html: `
                <div class="sharethis-inline-share-buttons"></div>
              `
              }}
            />
          </FocusLock>
        </PopoverContent>
      </Popover>
    </div>
  );
}