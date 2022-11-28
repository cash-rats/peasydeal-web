import type { ComponentMeta } from '@storybook/react';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

import Breadcrumbs from './Breadcrumbs';

export default {
  title: 'Breadcrumbs',
  component: Breadcrumbs,
} as ComponentMeta<typeof Breadcrumbs>;

const breadcrumbs = [
  <Link
    className="breadcrumbs-link"
    underline="hover"
    key="1"
    color="inherit"
    href="/"
    onClick={() => { console.log('1') }}
  >
    MUI
  </Link>,
  <Link
    className="breadcrumbs-link"
    underline="hover"
    key="2"
    color="inherit"
    href="/material-ui/getting-started/installation/"
    onClick={() => console.log('1')}
  >
    Core
  </Link>,
  <p className="breadcrumbs-link-active" key="3" color="text.primary">
    Breadcrumb
  </p>,
];

export const basic = () => <Breadcrumbs breadcrumbs={breadcrumbs} />;

