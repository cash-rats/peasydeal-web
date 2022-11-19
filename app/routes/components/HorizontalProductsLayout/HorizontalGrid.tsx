import type { MouseEvent } from 'react';
import { Link } from '@remix-run/react';
import Skeleton from '@mui/material/Skeleton';

interface HorizontalGridProps {
  loading?: boolean;
  src?: string;
  title?: string;
  price?: number;
  productUUID?: string;
  onClick: (evt: MouseEvent<HTMLDivElement>, productUUID: string) => void;
}

function HorizontalGridSkeleton() {
  return (

    <div className="HorizontalGrid__image-container">
      <div className='HorizontalGrid__image'>
        <Skeleton
          variant='rectangular'
          height='100%'
        />
      </div>
    </div>
  )

}

export default function HorizontalGrid({
  loading = false,
  src = '',
  title = '',
  productUUID = '',
  onClick = () => { },
}: HorizontalGridProps) {
  return (
    <div className="HorizontalGrid__wrapper">
      {
        loading
          ? (
            <HorizontalGridSkeleton />
          )
          : (
            <>
              <Link to={`/product/${productUUID}`}>
                <div onClick={(evt) => onClick(evt, productUUID)} className="HorizontalGrid__image-container">
                  {
                    !src
                      ? null
                      : (
                        <img
                          alt="some alt"
                          className="HorizontalGrid__image"
                          srcSet={src}
                        />
                      )
                  }
                </div>

                <div className="HorizontalGrid__desc-container">
                  {
                    loading
                      ? null
                      : (
                        <div className="HorizontalGrid__desc" >
                          <p className="HorizontalGrid__text">{title} </p>
                          <span className="HorizontalGrid__price">  </span>
                        </div>
                      )
                  }
                </div>
              </Link>
            </>
          )
      }
    </div>
  );
}