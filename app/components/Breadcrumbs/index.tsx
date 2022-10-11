import type { ReactNode } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { useNavigate } from '@remix-run/react';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
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
}

export default function BreadcrumsNav({ breadcrumbs, showBack = false }: BreadcrumbsNavProps) {
  const navigate = useNavigate();

  return (
    <div className="breadscrum">
      {
        showBack && (
          <span className="breadscrum-back" >
            <Link
              underline='hover'
              color="inherit"
              onClick={(evt) => {
                evt.preventDefault();
                navigate(-1);
              }}
            >
              <ArrowBackIcon color='action' fontSize="medium" />
              <p className="back-text">Back</p>
            </Link>
          </span>
        )
      }

      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
        {breadcrumbs}
      </Breadcrumbs>
    </div>
  );
}