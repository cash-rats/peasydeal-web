import type { ReactNode } from 'react';
// import Breadcrumbs from '@mui/material/Breadcrumbs';
import type { LinksFunction } from 'react-router';

import { Breadcrumb } from '@chakra-ui/react'

import { FiChevronRight } from 'react-icons/fi';

import styles from "./styles/breadcrumbs.css?url";

interface BreadcrumbsNavProps {
  breadcrumbs: ReactNode | ReactNode[];
  showBack?: boolean;
  onClickBack?: () => void;
}

export const links: LinksFunction = () => {
	return [
		{ rel: "stylesheet", href: styles },
	];
};

export default function BreadcrumsNav({
  breadcrumbs,
}: BreadcrumbsNavProps) {
  return (
    <div className="flex flex-row items-center w-full pd-breadcrumb">
      <Breadcrumb
        py="1"
        className='flex flex-row flex-wrap'
        separator={<FiChevronRight className="text-[16px] md:text-[24px] mx-[-1px] md:mx-0" />}
      >
        {breadcrumbs}
      </Breadcrumb>
    </div>
  );
}