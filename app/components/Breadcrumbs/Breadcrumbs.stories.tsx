import type { ComponentMeta } from '@storybook/react';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

import Breadcrumbs from './index';

export default {
  title: 'Breadcrumbs',
  component: Breadcrumbs,
} as ComponentMeta<typeof Breadcrumbs>;

const breadcrumbs = [
  <Link underline="hover" key="1" color="inherit" href="/" onClick={() => { console.log('1') }}>
    MUI
  </Link>,
  <Link
    underline="hover"
    key="2"
    color="inherit"
    href="/material-ui/getting-started/installation/"
    onClick={() => console.log('1')}
  >
    Core
  </Link>,
  <Typography key="3" color="text.primary">
    Breadcrumb
  </Typography>,
];

export const basic = () => <Breadcrumbs breadcrumbs={breadcrumbs} />;

