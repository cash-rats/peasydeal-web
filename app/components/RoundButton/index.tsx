import type { ReactNode, CSSProperties } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import type { LoadingButtonProps } from '@mui/lab/LoadingButton';
import { styled } from '@mui/material/styles';
import type { LinksFunction } from '@remix-run/node';

import styles from './styles/RoundButton.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

const BasicRoundButton = styled(LoadingButton)({
  padding: '0.875rem 2rem',
  borderRadius: '24px',
  textTransform: 'none',
  lineHeight: '1rem',
});

const AddToCartButton = styled(BasicRoundButton)({
  color: 'white',
  fontSize: '1.1rem',
  fontWeight: '700',
  border: 'solid 1px #009378',
  backgroundColor: '#009378',
  boxShadow: '0px 1px 5px 0px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 3px 1px -2px rgb(0 0 0 / 12%)',
  '&:hover': {
    backgroundColor: 'rgba(0, 147, 120, 0.8)',
    border: 'solid 1px #009378',
  },
}) as typeof LoadingButton;

const BuyNowButton = styled(BasicRoundButton)({
  color: 'white',
  fontSize: '1.1rem',
  fontWeight: '700',
  border: 'solid 1px #CF7135',
  backgroundColor: '#CF7135',
  boxShadow: '0px 1px 5px 0px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 3px 1px -2px rgb(0 0 0 / 12%)',
  '&:hover': {
    backgroundColor: 'rgba(207, 112, 53, 0.8)',
    border: 'solid 1px #CF7135',
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

const CheckoutButton = styled(BasicRoundButton)({
  backgroundColor: '#ffa33a',
  borderColor: '#c60',
  color: 'black',
  boxShadow: '0px 1px 5px 0px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 3px 1px -2px rgb(0 0 0 / 12%)',
  fontSize: '1rem',
  '&:hover': {
    backgroundColor: '#F39834',
    color: '#222',
    borderColor: '#c60',
  },
}) as typeof LoadingButton;

type ColorScheme = 'buynow' | 'addtocart' | 'blue' | 'checkout';

interface RoundButtonProps extends LoadingButtonProps {
  children?: ReactNode;
  style?: CSSProperties;
  colorScheme?: ColorScheme;
  onClick?: () => void;
  isLoading?: boolean;
  leftIcon?: ReactNode;
}

type ColorSchemeButtonMap = {
  [key in ColorScheme]: typeof LoadingButton;
};

const colorSchemeButton: ColorSchemeButtonMap = {
  'addtocart': AddToCartButton,
  'buynow': BuyNowButton,
  'blue': ViewButton,
  'checkout': CheckoutButton,
};

function RoundButton({
  size,
  style,
  colorScheme = 'addtocart',
  onClick = () => { },
  isLoading = false,
  children,
  leftIcon,
}: RoundButtonProps) {
  const CustomButton = colorSchemeButton[colorScheme];
  return (
    <CustomButton
      size={size}
      style={style}
      fullWidth
      variant='outlined'
      onClick={onClick}
      loading={isLoading}
    >
      <div className="RoundButton__Custom">
        {leftIcon && (<span>{leftIcon}</span>)}

        <span>
          {children}
        </span>
      </div>
    </CustomButton>
  );
};

export default RoundButton