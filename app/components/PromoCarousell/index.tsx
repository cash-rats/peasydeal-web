import { Link } from '@remix-run/react';
import { Button } from '@chakra-ui/react'
import bg from './images/group-prizes.png';

const getEvent = () => {
  return (
    <Link
      to='/events/win-a-free-surprise-gift'
      onClick={() => {
        window.rudderanalytics?.track('click_event_carousell', {
          event: 'win_a_free_surprise_gift',
        });
      }}
    >
      <div className="rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 text-white h-[200px] flex justify-between p-4 self-center mx-2 gap-2">
        <div className="flex self-center flex-col flex-1">
          <h3 className="font-poppin font-medium  text-xl md:text-2xl lg:text-3xl">Win a surprise gift for your next purchase</h3>
          <Button
            colorScheme='whiteAlpha'
            size="lg"
            variant='solid'
            className='capitalize text-lg md:text-xl mt-3 md:mt-4 bg-white text-orange-800 inline-flex w-[180px] md:w-[200px]'
          >
            I want free gifts
          </Button>
        </div>
        <span className="flex-1 overflow-hidden">
          <div
            className='animate-scrollgrid'
            style={{
              height: "200px",
              marginTop: "-12px",
              backgroundSize: "1600px",
              backgroundRepeat: "repeat-x",
              backgroundPosition: "center",
              width: "1775px",
              backgroundImage: `url(${bg})`,
            }} />
        </span>
      </div>
    </Link>
  )
}

function PromoCarousell() {
  return (
    <>
      { getEvent() }
      {/* <Carousel
        data={item}
        time={2000}
        width="100%"
        height="100%"
        radius="10px"
        automatic={true}
        dots={true}
        pauseIconColor="white"
        pauseIconSize="40px"
        slideBackgroundColor="white"
        style={{
          textAlign: "center",
          position: "relative",
        }}
      />  */}
    </>
  );
}

export default PromoCarousell;
