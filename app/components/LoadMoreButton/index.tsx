import type { ReactNode, MouseEvent } from 'react';
import type { LinksFunction } from '@remix-run/node';

import styles from './styles/LoadMoreButton.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

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
    <button
      disabled={disabled || loading}
      className="LoadMoreButton"
      onClick={onClick}
    >
      {text}
    </button>
  );
};