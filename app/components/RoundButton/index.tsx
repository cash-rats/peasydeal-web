import type { ReactNode, CSSProperties } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { styled } from '@mui/material/styles';

const AddToCartButton = styled(LoadingButton)({
  color: 'white',
  padding: '0.875rem 2rem',
  fontSize: '1.2rem',
  fontWeight: '700',
  lineHeight: '1rem',
  borderColor: 'white',
  borderRadius: '24px',
  textTransform: 'none',
  backgroundColor: '#009378',
  '&:hover': {
    backgroundColor: 'rgba(0, 147, 120, 0.8)',
    borderColor: 'white',
  },
}) as typeof LoadingButton;

const BuyNowButton = styled(AddToCartButton)({
  backgroundColor: '#CF7135',
  '&:hover': {
    backgroundColor: 'rgba(207, 112, 53, 0.8)',
    borderColor: 'white',
  },
}) as typeof LoadingButton;

type ColorScheme = 'buynow' | 'addtocart';

interface RoundButtonProps {
  text: ReactNode;
  style?: CSSProperties;
  colorScheme?: ColorScheme;
  onClick?: () => void;
  isLoading?: boolean;
}

type ColorSchemeButtonMap = {
  [key in ColorScheme]: typeof LoadingButton;
};

const colorSchemeButton: ColorSchemeButtonMap = {
  'addtocart': AddToCartButton,
  'buynow': BuyNowButton,
};

export default function RoundButton({
  style,
  text,
  colorScheme = 'addtocart',
  onClick = () => { },
  isLoading = false,
}: RoundButtonProps) {
  const CustomButton = colorSchemeButton[colorScheme];
  return (
    <CustomButton
      style={style}
      fullWidth
      variant='outlined'
      onClick={onClick}
      loading={isLoading}
    >
      {text}
    </CustomButton>
  );
};