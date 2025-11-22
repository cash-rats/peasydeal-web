import { useEffect, useCallback, useRef } from 'react';
import Skeleton from '@mui/material/Skeleton';
interface HorizontalGridProps {
  loading?: boolean;
  src?: string;
  title?: string;
  price?: number;
  productUUID?: string;
  onClick?: (evt: MouseEvent, title: string, productUUID: string) => void;
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
  const gesturezoneRef = useRef<HTMLDivElement | null>(null);

  let touchstartX = 0;
  let touchstartY = 0;
  let touchendX = 0;
  let touchendY = 0;

  const gridRef = useCallback((gestureZoneDom: null | HTMLDivElement) => {
    if (!gestureZoneDom) return;
    gesturezoneRef.current = gestureZoneDom;

    if (productUUID) {
      gestureZoneDom.addEventListener('mousedown', handleMouseDown, false);
      gestureZoneDom.addEventListener('mouseup', handleMouseUp, false);

    }
  }, [productUUID]);

  const handleGesture = useCallback((evt: MouseEvent) => {
    if (touchendY === touchstartY && touchstartX === touchendX) {
      onClick(evt, title, productUUID);
    } else {
      console.log('user opts swipes gesture, ignore');
    }
  }, [productUUID])


  const handleMouseDown = (evt: MouseEvent) => {
    touchstartX = evt.pageX;
    touchstartY = evt.pageY;
  }

  const handleMouseUp = useCallback(
    (evt: MouseEvent) => {
      touchendX = evt.pageX
      touchendY = evt.pageY

      handleGesture(evt);
    }, [productUUID]
  );

  useEffect(() => {
    const gestureZoneDom = gesturezoneRef.current;
    return () => {
      if (gestureZoneDom) {
        gestureZoneDom.removeEventListener('touchstart', handleMouseDown);
        gestureZoneDom.removeEventListener('touchend', handleMouseUp);
      }
    }
  }, []);

  return (
    <div
      ref={gridRef}
      className="HorizontalGrid__wrapper"
    >
      {
        loading
          ? (<HorizontalGridSkeleton />)
          : (
            <>
              <div className="HorizontalGrid__image-container">
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
            </>
          )
      }
    </div>
  );
}