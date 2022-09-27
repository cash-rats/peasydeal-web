import { addons } from '@storybook/addons';
import { create } from '@storybook/theming';

const globalTheme = create({
  base: 'light',
  fontBase: '"Roboto", sans-serif',
});

addons.setConfig({
  theme: globalTheme,
});
