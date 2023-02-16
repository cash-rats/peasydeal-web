import { useEffect, useRef } from 'react';
import  FocusLock from "react-focus-lock";
import type { LinksFunction } from '@remix-run/node';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  Button,
  PopoverAnchor,
  useDisclosure,
} from '@chakra-ui/react'
import { MdOutlineIosShare } from 'react-icons/md';

import styles from './styles/SocialShare.css';

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
  script.id = 'sharethis'
  script.src = 'https://platform-api.sharethis.com/js/sharethis.js#property=635bb7bc9c9fa7001910fbe2&product=sop'
  script.type = 'text/javascript';
  document.body.appendChild(script)
}

export default function SocialShare({ prodUUID }: SocialShareProps) {
  const { onOpen, onClose, isOpen } = useDisclosure()
  const firstFieldRef = useRef(null)

  useEffect(() => {
    // console.log('debug share this', prodUUID);
    const st = window.__sharethis__;
    if (!st) {
      loadShareThisScript();
    } else if (typeof st.initialize === 'function') {
      loadShareThisScript();
      st.href = window.location.href
      st.initialize()
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
            {/* <Form firstFieldRef={firstFieldRef} onCancel={onClose} /> */}
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