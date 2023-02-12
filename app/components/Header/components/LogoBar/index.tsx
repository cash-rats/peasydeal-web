import { useState, useEffect, useRef } from 'react';
import { Link, } from '@remix-run/react';
import { useLocation } from '@remix-run/react';
import { FiMenu } from 'react-icons/fi';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  IconButton,
} from '@chakra-ui/react';

import type { Category } from '~/shared/types';

import PeasyDeal from './images/peasydeal_logo.svg';

interface LogoBarProps {
  categories?: Category[];
}

function LogoBar({ categories = [] }: LogoBarProps) {
  const [openMenu, setOpenMenu] = useState(false);
  const btnRef = useRef(null);
  const location = useLocation();

  const handleOpenMenu = () => {
    setOpenMenu(true);
  }
  const handleCloseMenu = () => {
    setOpenMenu(false);
  }

  useEffect(() => {
    return () => setOpenMenu(false)
  }, [])

  useEffect(() => {
    setOpenMenu(false);
  }, [location])

  return (
    <div className="flex items-center mr-4 my-auto relative">
      <div className="">
        <div className="block md:hidden">
          <IconButton
            aria-label='Open Category Menu'
            icon={<FiMenu className="text-2xl" color='#e6007e' />}
            onClick={handleOpenMenu}
            bg="white"
          />

          <Modal
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
          </Modal>
        </div>
      </div>

      <Link to='/' className="
        leading-[20px]
        left-10 top-[10px]
        flex items-center
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