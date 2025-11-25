import systemCreateThemeModule from '@mui/system/createTheme/createTheme.js';

type SystemCreateTheme = typeof import('@mui/system/createTheme')['default'];

const systemCreateThemeExport = systemCreateThemeModule as { default?: SystemCreateTheme } & Record<string, unknown>;
const systemCreateTheme = (systemCreateThemeExport.default ?? systemCreateThemeExport) as SystemCreateTheme;

export default systemCreateTheme;
