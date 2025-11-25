import styleFunctionSxModule from '@mui/system/styleFunctionSx/styleFunctionSx.js';
import extendSxPropModule from '@mui/system/styleFunctionSx/extendSxProp.js';
import defaultSxConfigModule from '@mui/system/styleFunctionSx/defaultSxConfig.js';

type StyleFunctionSx = typeof import('@mui/system/styleFunctionSx')['default'];
type ExtendSxProp = typeof import('@mui/system/styleFunctionSx')['extendSxProp'];
type DefaultSxConfig = typeof import('@mui/system/styleFunctionSx')['unstable_defaultSxConfig'];

const styleFunctionSxExport = styleFunctionSxModule as { default?: StyleFunctionSx } & Record<string, unknown>;
const extendSxPropExport = extendSxPropModule as { default?: ExtendSxProp } & Record<string, unknown>;
const defaultSxConfigExport = defaultSxConfigModule as { default?: DefaultSxConfig } & Record<string, unknown>;

export const extendSxProp = (extendSxPropExport.default ?? extendSxPropExport) as ExtendSxProp;
export const unstable_defaultSxConfig = (defaultSxConfigExport.default ?? defaultSxConfigExport) as DefaultSxConfig;
const styleFunctionSx = (styleFunctionSxExport.default ?? styleFunctionSxExport) as StyleFunctionSx;

export default styleFunctionSx;
