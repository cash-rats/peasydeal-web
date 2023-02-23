import { useState, useEffect, useRef } from 'react';
import { Link, } from '@remix-run/react';
import { useLocation } from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';
import { FiMenu } from 'react-icons/fi';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  IconButton,

  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Box,
} from '@chakra-ui/react';

import type { Category } from '~/shared/types';

import PeasyDeal from './images/peasydeal_logo.svg';
import MegaMenuContent, { links as MegaMenuContentLink } from '../MegaMenuContent';

interface LogoBarProps {
  categories?: Category[];
}

export const links: LinksFunction = () => {
  return [
    ...MegaMenuContentLink(),
  ];
}

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
                <MegaMenuContent
                  categories={categories}
                  onClose={onClose}
                  ItemNode={Box}
                />
              </DrawerBody>
            </DrawerContent>
          </Drawer>

          {/* <Modal
            onClose={handleCloseMenu}
            finalFocusRef={btnRef}
            isOpen={openMenu}
            scrollBehavior="inside"
            size="full"
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Shop By Category</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <div>
                  <ul>
                    {
                      categories.map((category) => {
                        return (
                          <Link
                            // prefetch='intent'
                            key={category.catId}
                            to={`/${category.name}`}
                          >
                            <li className="py-3 px-4 cursor-pointer hover:bg-gray-hover-bg">
                              {category.title}
                            </li>
                          </Link>
                        )
                      })
                    }
                  </ul>
                </div>
              </ModalBody>
            </ModalContent>
          </Modal> */}
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