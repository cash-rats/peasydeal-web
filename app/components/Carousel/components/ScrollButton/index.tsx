import type { LinksFunction } from '@remix-run/node';

import styles from './styles/ScrollButton.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

type Direction = 'left' | 'right';

interface ScrollButtonProps {
  direction?: Direction;
  onClick?: () => void;
}

export default function ScrollButton({ direction = 'left', onClick = () => { } }: ScrollButtonProps) {
  return (
    <button
      className={
        direction === 'left'
          ? "carousel__scrollButton__wrapper"
          : "carousel__scrollButton__wrapper-right"
      }
      onClick={onClick}
    >
      <div className="carousel__scrollButton__circle">
        {
          direction === 'left'
            ? <div className="carousel__scrollButton__left-arrow" />
            : <div className="carousel__scrollButton__right-arrow" />
        }
      </div>
    </button>
  );
}