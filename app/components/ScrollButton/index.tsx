import type { CSSProperties } from 'react';
import type { LinksFunction } from 'react-router';

import styles from './styles/ScrollButton.css?url';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

type Direction = 'left' | 'right';

interface ScrollButtonProps {
  direction?: Direction;
  onClick?: () => void;
  buttonStyle?: CSSProperties;
  arrowWrapperStyle?: CSSProperties;
  arrowStyle?: CSSProperties;
}

export default function ScrollButton({
  direction = 'left',
  onClick = () => { },
  buttonStyle,
  arrowWrapperStyle,
  arrowStyle,
}: ScrollButtonProps) {
  return (
    <button
      className={
        direction === 'left'
          ? "carousel__scrollButton__wrapper"
          : "carousel__scrollButton__wrapper-right"
      }
      onClick={onClick}
      style={buttonStyle}
    >
      <div className="carousel__scrollButton__circle" style={arrowWrapperStyle}>
        {
          <div
            style={arrowStyle}
            className={
              direction === 'left'
                ? "carousel__scrollButton__left-arrow"
                : "carousel__scrollButton__right-arrow"
            }
          />
        }
      </div>
    </button>
  );
}