import type { ReactNode } from 'react';
// import Breadcrumbs from '@mui/material/Breadcrumbs';

import { Breadcrumb } from '@chakra-ui/react'

import { FiChevronRight } from 'react-icons/fi';

// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import Link from '@mui/material/Link';

interface BreadcrumbsNavProps {
  breadcrumbs: ReactNode | ReactNode[];
  showBack?: boolean;
  onClickBack?: () => void;
}

export default function BreadcrumsNav({
  breadcrumbs,
}: BreadcrumbsNavProps) {
  return (
    <div className="flex flex-row items-center w-full">
      <Breadcrumb
        py="1"
        className='flex flex-row'
        separator={<FiChevronRight fontSize={24} />}
      >
        {breadcrumbs}
      </Breadcrumb>
    </div>
  );
}