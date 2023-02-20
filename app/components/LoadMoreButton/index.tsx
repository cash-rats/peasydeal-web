import type { ReactNode, MouseEvent } from 'react';
import { Button } from '@chakra-ui/react';

interface LoadMoreButtonProps {
  disabled?: boolean;
  loading?: boolean;
  text?: ReactNode;
  onClick?: (evt: MouseEvent<HTMLButtonElement>) => void;
}

export default function LoadMoreButton({
  disabled = false,
  loading = false,
  text,
  onClick = () => { },
}: LoadMoreButtonProps) {
  return (
    <Button
      disabled={disabled || loading}
      isLoading={loading}
      onClick={onClick}
    >
      {text}
    </Button>
  );
};