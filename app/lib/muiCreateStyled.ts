import createStyledModule from '@mui/system/createStyled.js';

type CreateStyled = typeof import('@mui/system/createStyled')['default'];

const createStyledExport = createStyledModule as { default?: CreateStyled } & Record<string, unknown>;
const createStyled = (createStyledExport.default ?? createStyledExport) as CreateStyled;

export default createStyled;
