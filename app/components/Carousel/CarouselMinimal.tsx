import { useEffect, useState, useCallback } from "react";
import Swipe from "react-easy-swipe";
// import { LazyLoadImage } from 'react-lazy-load-image-component';
// import "./styles/index.css";
import { IconButton } from '@chakra-ui/react'
import { BiChevronRight, BiChevronLeft } from 'react-icons/bi';
import { VscZoomIn } from "react-icons/vsc";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";

function Carousel({
  data,
  time,
  width,
  height,
  radius,
  style,
  dots,
  automatic,
  pauseIconColor,
  pauseIconSize,
  slideBackgroundColor,
  slideImageFit,
  thumbnails,
  thumbnailWidth,
}) {
  //Initialize States
  const [openLightBox, setOpenLightBox] = useState(false);
  const [slide, setSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [change, setChange] = useState(false);

  //Function to change slide
  const addSlide = (n: number) => {
    if (slide + n >= data.length) setSlide(0);
    else if (slide + n < 0) setSlide(data.length - 1);
    else setSlide(slide + n);
  };

  // const loadMyModule = useCallback(async () => {
  //   const light = await import('yet-another-react-lightbox');

  //   setLightBox(light);
  // }, [])

  // useEffect(() => {
  //   loadMyModule();
  // }, []);


  //Start the automatic change of slide
  useEffect(() => {
    if (automatic) {
      let index = slide;
      const interval = setInterval(
        () => {
          if (!isPaused) {
            setSlide(index);
            index++;
            if (index >= data.length) index = 0;
            if (index < 0) index = data.length - 1;
          }
        },
        time ? time : 2000
      );
      return () => {
        clearInterval(interval);
      };
    }
  }, [isPaused, change]);

  function scrollTo(el) {
    if (!el) return;

    const elLeft = el.offsetLeft + el.offsetWidth;
    const elParentLeft = el.parentNode.offsetLeft + el.parentNode.offsetWidth;

    // check if element not in view
    if (elLeft >= elParentLeft + el.parentNode.scrollLeft) {
      el.parentNode.scroll({ left: elLeft - elParentLeft, behavior: "smooth" });
    } else if (elLeft <= el.parentNode.offsetLeft + el.parentNode.scrollLeft) {
      el.parentNode.scroll({
        left: el.offsetLeft - el.parentNode.offsetLeft,
        behavior: "smooth",
      });
    }
  }

  //Listens to slide state changes
  useEffect(() => {
    const slides = document.getElementsByClassName("carousel-item");
    const dots = document.getElementsByClassName("dot");

    const slideIndex = slide;
    let i;
    for (i = 0; i < data.length; i++) {
      slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
    //If thumbnails are enabled
    if (thumbnails) {
      const thumbnailsArray = document.getElementsByClassName("thumbnail");
      for (i = 0; i < thumbnailsArray.length; i++) {
        thumbnailsArray[i].className = thumbnailsArray[i].className.replace(
          " active-thumbnail",
          ""
        );
      }
      if (thumbnailsArray[slideIndex] !== undefined)
        thumbnailsArray[slideIndex].className += " active-thumbnail";
      scrollTo(document.getElementById(`thumbnail-${slideIndex}`));
    }

    if (slides[slideIndex] !== undefined)
      slides[slideIndex].style.display = "block";
    if (dots[slideIndex] !== undefined) dots[slideIndex].className += " active";
  }, [slide, isPaused]);


  return (
    <>
      <Lightbox
        open={openLightBox}
        close={() => setOpenLightBox(false)}
        slides={data.map((item: any) => ({ src: item.image }))}
        plugins={[Thumbnails]}
        index={slide}
        controller={{
          closeOnBackdropClick: true,
          touchAction: "pan-y",
        }}
      />

      <div style={style}>
        <div
          style={{
            maxWidth: width ? width : "600px",
            maxHeight: height ? height : "400px",
          }}
          className={`
            overflow-hidden
          `}
        >
          <Swipe
            onSwipeRight={() => {
              addSlide(-1);
              setChange(!change);
            }}
            onSwipeLeft={() => {
              addSlide(1);
              setChange(!change);
            }}
          >
            <div
              className="carousel-container"
              style={{
                maxWidth: width ? width : "600px",
                height: height ? height : "400px",
                backgroundColor: slideBackgroundColor
                  ? slideBackgroundColor
                  : "darkgrey",
                borderRadius: radius,
              }}
            >
              {data.map((item: any, index: number) => {
                return (
                  <div
                    className="carousel-item fade"
                    style={{
                      maxWidth: width ? width : "600px",
                      maxHeight: height ? height : "400px",
                    }}
                    onMouseDown={(e) => {
                      automatic && setIsPaused(true);
                    }}
                    onMouseUp={(e) => {
                      automatic && setIsPaused(false);
                    }}
                    onMouseLeave={(e) => {
                      automatic && setIsPaused(false);
                    }}
                    onTouchStart={(e) => {
                      automatic && setIsPaused(true);
                    }}
                    onTouchEnd={(e) => {
                      automatic && setIsPaused(false);
                    }}
                    key={index}
                  >
                    <img
                      src={item.image}
                      alt={item.caption}
                      className="carousel-image"
                      onClick={(e) => {
                        setOpenLightBox(true);
                      }}
                      style={{
                        borderRadius: radius,
                        objectFit: slideImageFit ? slideImageFit : "cover",
                      }}
                    />
                    {isPaused && (
                      <div
                        className="pause-icon pause"
                        style={{
                          color: pauseIconColor ? pauseIconColor : "white",
                          fontSize: pauseIconSize ? pauseIconSize : "40px",
                        }}
                      >
                        II
                      </div>
                    )}
                  </div>
                );
              })}

              <IconButton
                aria-label="prev slide"
                className="
                  absolute top-1/2 left-0
                  bg-white
                  p-2 mt-[-22px]
                  transition-all duration-300 ease-in-out hover:bg-[rgba(255,255,255,0.7)]
                  rounded-full
                  border-[1px]
                  border-slate-200
                "
                bg="white"
                onClick={(e) => {
                  addSlide(-1);
                  setChange(!change);
                }}
                icon={<BiChevronLeft />}
              />

              <IconButton
                aria-label="next slide"
                className="
                  absolute top-1/2 right-0
                  bg-white
                  p-2 mt-[-22px]
                  transition-all duration-300 ease-in-out hover:bg-[rgba(255,255,255,0.7)]
                  rounded-full
                  border-[1px]
                  border-slate-200
                "
                bg="white"
                onClick={(e) => {
                  addSlide(1);
                  setChange(!change);
                }}
                icon={<BiChevronRight />}
              />
              {dots && (
                <div className="dots">
                  {data.map((item: any, index: number) => {
                    return (
                      <span
                        className="dot"
                        key={index}
                        onClick={(e) => {
                          setSlide(index);
                          setChange(!change);
                        }}
                      ></span>
                    );
                  })}
                </div>
              )}

              <IconButton
                aria-label="zoom photo"
                className="
                  absolute bottom-[10px] right-[10px]
                  bg-white
                  p-2 mt-[-22px]
                  transition-all duration-300 ease-in-out hover:bg-[rgba(255,255,255,0.7)]
                  rounded-full
                  border-[1px]
                  border-slate-200
                  z-5
                "
                bg="white"
                onClick={(e) => {
                  setOpenLightBox(true);
                }}
                icon={<VscZoomIn />}
              />
            </div>
          </Swipe>
        </div>

        <div className='bg-slate-100 my-2 w-full h-[24px] flex justify-center items-center'>
          <small className='font-bold'>{`${slide < 0 ? 1 : slide + 1}/${data.length || 0}`}</small>
        </div>

        <div
          className="thumbnails flex"
          id="thumbnail-div"
          style={{ maxWidth: width }}
        >
          {
            data.map((item: any, index: number) => {
              return (
                <img
                  style={{
                    border: slide === index ? '3px solid #D02E7D' : '0px',
                  }}
                  className="mx-2 rounded-lg bg-slate-100 p-[2px] min-w-[100px] w-auto h-[100px] aspect-sqare"
                  width={"100px"}
                  alt={item.title}
                  src={item.image}
                  id={`thumbnail-${index}`}
                  key={index}
                  onClick={(e) => {
                    setSlide(index);
                    setChange(!change);
                  }}
                />
              );
            })
          }
        </div>
      </div>
    </>
  );

}

export default Carousel;
