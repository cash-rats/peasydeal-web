import type { ReactNode } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { FiChevronRight } from 'react-icons/fi';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import type { LinksFunction } from '@remix-run/node';

import styles from './styles/Breadcrumbs.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};


interface BreadcrumbsNavProps {
  breadcrumbs: ReactNode | ReactNode[];
  showBack?: boolean;
  onClickBack?: () => void;
}

export default function BreadcrumsNav({
  breadcrumbs,
  showBack = false,
  onClickBack = () => { },
}: BreadcrumbsNavProps) {
  return (
    <div className="breadscrum">
      {
        showBack && (
          <span className="breadscrum-back" >
            <Link
              underline='hover'
              color="inherit"
              onClick={onClickBack}
            >
              <ArrowBackIcon color='action' fontSize="medium" />
              <p className="back-text">Back</p>
            </Link>
          </span>
        )
      }

      <Breadcrumbs separator={<FiChevronRight fontSize={12} />} aria-label="breadcrumb">
        {breadcrumbs}
      </Breadcrumbs>
    </div>
  );
}