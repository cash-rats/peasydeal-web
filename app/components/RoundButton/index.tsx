import type { ReactNode, CSSProperties } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { styled } from '@mui/material/styles';

const BasicRoundButton = styled(LoadingButton)({
  padding: '0.875rem 2rem',
  borderRadius: '24px',
  textTransform: 'none',
  lineHeight: '1rem',
});

const AddToCartButton = styled(BasicRoundButton)({
  color: 'white',
  fontSize: '1.2rem',
  fontWeight: '700',
  borderColor: 'white',
  backgroundColor: '#009378',
  '&:hover': {
    backgroundColor: 'rgba(0, 147, 120, 0.8)',
    borderColor: 'white',
  },
}) as typeof LoadingButton;

const BuyNowButton = styled(BasicRoundButton)({
  color: 'white',
  fontSize: '1.2rem',
  fontWeight: '700',
  backgroundColor: '#CF7135',
  '&:hover': {
    backgroundColor: 'rgba(207, 112, 53, 0.8)',
    borderColor: 'white',
  },
}) as typeof LoadingButton;

const ViewButton = styled(BasicRoundButton)({
  backgroundColor: '#4880C8',
  color: 'white',
  fontSize: '1.2rem',
  fontWeight: '700',
  '&:hover': {
    backgroundColor: 'rgba(72, 128, 200, 0.8)',
  },
}) as typeof LoadingButton;

type ColorScheme = 'buynow' | 'addtocart' | 'blue';

interface RoundButtonProps {
  children?: ReactNode;
  text?: ReactNode;
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
  'blue': ViewButton,
};

export default function RoundButton({
  style,
  text = '',
  colorScheme = 'addtocart',
  onClick = () => { },
  isLoading = false,
  children,
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
      {children}
      {text}
    </CustomButton>
  );
};