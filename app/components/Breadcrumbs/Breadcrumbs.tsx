import type { ReactNode } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { FiChevronRight } from 'react-icons/fi';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
    <div className="flex flex-row items-center w-full py-2">
      {
        showBack && (
          <span className="mr-7 flex items-center cursor-pointer" >
            <Link
              className="flex items-center"
              underline='hover'
              color="inherit"
              onClick={onClickBack}
            >
              <ArrowBackIcon color='action' fontSize="medium" />
              <p className="m-0 ml-3 font-medium">Back</p>
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