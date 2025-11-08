import { useRef, memo } from 'react';
import { Link, } from 'react-router';
import type { LinksFunction } from 'react-router';
import { FiMenu } from 'react-icons/fi';
import {
  IconButton,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Box,
} from '@chakra-ui/react';

import type { Category } from '~/shared/types';

import PeasyDeal from './images/peasydeal_logo.svg';
import type { IMegaMenuContent} from '../MegaMenuContent';
import MegaMenuContent, { links as MegaMenuContentLink } from '../MegaMenuContent';

interface LogoBarProps {
  categories?: Category[];
}

export const links: LinksFunction = () => {
  return [
    ...MegaMenuContentLink(),
  ];
}

const MegaMemo = memo(({
  categories,
  onClose,
  ItemNode,
}: IMegaMenuContent) => {
  return (
    <MegaMenuContent
      categories={categories}
      onClose={onClose}
      ItemNode={ItemNode}
    />
  );
});

MegaMemo.displayName = 'MegaMenuContent';

function LogoBar({ categories = [] }: LogoBarProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef(null);

  return (
    <div className="flex items-center mr-4 my-auto relative">
      <div className="">
        <div className="block md:hidden">
          <IconButton
            aria-label='Open Category Menu'
            icon={<FiMenu className="text-[34px] pr-1 md:p-[inherit] md:text-2xl" color='#e6007e' />}
            onClick={onOpen}
            bg="white"
          />

          <Drawer
            isOpen={isOpen}
            onClose={onClose}
            finalFocusRef={btnRef}
            placement="left"
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerBody className='py-6 px-0'>
                <MegaMemo
                  categories={categories}
                  onClose={onClose}
                  ItemNode={Box}
                />
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      <Link to='/' className="
        leading-[20px]
        left-10 top-[10px]
        flex items-center
        scale-110 md:scale-1
        ml-[4px] md:ml-0
      ">
        <picture>
          <source type="image/svg+xml" srcSet={PeasyDeal} />
          <img alt='PeasyDeal Logo' className='h-[42px] md:h-[60px]' src={PeasyDeal} />
        </picture>
      </Link>
    </div>
  );
}

export default LogoBar;