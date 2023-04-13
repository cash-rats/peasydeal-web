import type { LinksFunction } from '@remix-run/node';
import CountDown, { links as CountDownLinks } from "./components/countdown/CountDown";
// import 4 icons in the images
import iconFree from './images/icon-free.png';
import iconGift from './images/icon-gift.png';
import iconTier from './images/icon-tier.png';
import iconTime from './images/icon-time.png';



import bg from './images/event-bg.jpg';

export const links: LinksFunction = () => {
  return [
    ...CountDownLinks(),
  ];
};

const EventsEasterHunter = () => {
  return (
    <div className="mt-[-7px] md:mt-[-32px] lg:mt-[-15px]">
      <section
        className="
          relative isolate z-0 text-2xl font-custom overflow-hidden justify-between text-slate-800 w-full relative flex flex-col
        "
        style={{
          backgroundImage: `url(${bg})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <section className=" max-w-6xl py-12 sm:py-24 mx-auto">
          <div className="px-5">
            <CountDown countdown="2023-05-15T00:00:00.000Z"/>

            <h1 className="text-4xl text-center md:text-7xl font-custom font-bold max-w-5xl md:leading-tight mx-auto text-white">
              Get a Free Gift with Your Purchase!
            </h1>

            <p className="leading-relaxed mt-4 text-lg sm:text-2xl mt-4 text-center mx-auto max-w-3xl text-white">
              Spend $20 or more and receive a free gift from our tiers!
            </p>
          </div>

          <div className="flex mt-4 flex-col sm:flex-row mx-auto justify-center gap-y-2 sm:gap-y-0 max-w-2xl gap-x-2 items-center px-4">
            <button
              className="rounded-lg py-4 whitespace-nowrap px-6 sm:px-12 text-base font-bold lg:text-lg text-white shadow-lg hover:opacity-90 transition focus-visible:outline focus-visible:outline-2 w-full sm:w-fit focus-visible:outline-offset-2 focus-visible:outline-white"
              style={{ backgroundColor: "#d02e7d" }}
            >
              See what you can get!
            </button>
          </div>
        </section>
      </section>

      <div className="bg-gradient-to-b to-black/90 from-black/100 py-10 sm:py-10">
        <p className="font-bold text-center text-xl md:text-2xl text-white px-4">
          Hurry Up, ending soon! Suprise Gift Hunt (Apr 15 - May 15)
        </p>
      </div>

      <nav>
        <ul className="sticky top-0 z-10 bg-white shadow-lg">
          <li className="flex justify-center">
            <a href="#event" className="py-4 px-6 text-lg font-semibold text-slate-800 hover:text-slate-900 transition">
              Event
            </a>
            <a href="#free-gift" className="py-4 px-6 text-lg font-semibold text-slate-800 hover:text-slate-900 transition">
              Free Gift
            </a>
            <a href="#q-and-a" className="py-4 px-6 text-lg font-semibold text-slate-800 hover:text-slate-900 transition">
              Q & A
            </a>
          </li>
        </ul>
      </nav>

      <div
        className="bg-gradient-to-b from-white/80 to-white py-8 md:py-20"
        style={{ borderColor: 'rgba(217, 70, 239, 0.6)' }}
      >
        <div className='max-w-7xl px-5 md:px-12 mx-auto'>
          <h2 className="text-4xl sm:text-5xl mb-8 font-bold text-center ">How it works</h2>
        </div>

        <p className="leading-relaxed mt-2 mb-8 text-lg sm:text-2xl my-4 text-center mx-auto max-w-3xl">
          The more you spend, the better your surprise gift! And, yes, even shipping is FREE.
        </p>
        <section className="max-w-7xl px-5 md:px-12 mx-auto">
          <div className="flex flex-wrap gap-8">
            <div className="rounded-2xl group lg:flex-[1_1_40%] text-2xl transition hover:bg-white/5 duration-200 hover:-translate-y-4 border border-white/10  bg-gradient-to-r from-[#FCE6F0] to-[#FFBFDC] p-6 sm:px-6 lg:px-8 sm:py-8 w-full">
              <div className="flex">
                <div className='flex flex-col justify-center'>
                  <h3
                    className="text-2xl md:text-4xl sm:mb-4 font-semibold"
                    style={{ color: '#251629' }}>
                    Tiered Gifts
                  </h3>
                  <p className="sm:leading-relaxed mt-2 text-lg sm:text-2xl max-w-2xl">Get a free gift with your purchase of $20, $40, $60, or $80 or more.</p>
                </div>
                <img src={iconTier} alt="Tiered Gifts Icon" className='pl-4 ml-auto max-w-[100px] md:max-w-[150px] max-h-[100px] md:max-h-[150px] self-center' />
              </div>
            </div>

            <div className="rounded-2xl group lg:flex-[1_1_40%] text-2xl transition hover:bg-white/5 duration-200 hover:-translate-y-4 border border-white/10  bg-gradient-to-r from-sky-200 to-[#98DBF1] p-6 sm:px-6 lg:px-8 sm:py-8 w-full">
              <div className="flex">
                <div className='flex flex-col justify-center'>
                  <h3
                    className="text-2xl md:text-4xl sm:mb-4 font-semibold"
                    style={{ color: '#251629' }}>
                    Random Selection
                  </h3>
                  <p className="sm:leading-relaxed mt-2 text-lg sm:text-2xl max-w-2xl">All gifts are randomly selected from a set of 5 items per tier.</p>
                </div>
                <img src={iconGift} alt="Random Selection Icon" className='pl-4 ml-auto max-w-[100px] md:max-w-[150px] max-h-[100px] md:max-h-[150px] self-center' />
              </div>
            </div>

            <div className="rounded-2xl group lg:flex-[1_1_40%] text-2xl transition hover:bg-white/5 duration-200 hover:-translate-y-4 border border-white/10  bg-gradient-to-r from-[#C0F2D1] to-[#94F3B4] p-6 sm:px-6 lg:px-8 sm:py-8 w-full">
              <div className="flex">
                <div className='flex flex-col justify-center'>
                  <h3
                    className="text-2xl md:text-4xl sm:mb-4 font-semibold"
                    style={{ color: '#251629' }}>
                    Limited Time Only
                  </h3>
                  <p className="sm:leading-relaxed mt-2 text-lg sm:text-2xl max-w-2xl">This campaign is only valid for a limited time, so act fast!</p>
                </div>
                <img src={iconTime} alt="Limited Time Only Icon" className='pl-4 ml-auto max-w-[100px] md:max-w-[150px] max-h-[100px] md:max-h-[150px] self-center' />
              </div>
            </div>

            <div className="rounded-2xl group lg:flex-[1_1_40%] text-2xl transition hover:bg-white/5 duration-200 hover:-translate-y-4 border border-white/10  bg-gradient-to-r from-[#F3EBB7] to-[#F2E488] p-6 sm:px-6 lg:px-8 sm:py-8 w-full">
              <div className="flex">
                <div className='flex flex-col justify-center'>
                  <h3
                    className="text-2xl md:text-4xl sm:mb-4 font-semibold"
                    style={{ color: '#251629' }}>
                    Free Shipping
                  </h3>
                  <p className="sm:leading-relaxed mt-2 text-lg sm:text-2xl max-w-2xl">All gifts will be shipped to you free of charge!</p>
                </div>
                <img src={iconFree} alt="Free Shipping Icon" className='pl-4 ml-auto max-w-[100px] md:max-w-[150px] max-h-[100px] md:max-h-[150px] self-center' />
              </div>
            </div>
          </div>
        </section>
      </div>

      <div
        className="bg-gradient-to-b from-white/80 to-white py-8 md:py-20"
        style={{ borderColor: 'rgba(217, 70, 239, 0.6)' }}
      >
        <div className='max-w-7xl px-5 md:px-12 mx-auto'>
          <h2 className="text-4xl sm:text-5xl mb-8 font-bold text-center ">Sneak a Peek at Your Potential Surprise Gifts</h2>
        </div>

        <p className="leading-relaxed mt-2 mb-8 text-lg sm:text-2xl my-4 text-center mx-auto max-w-3xl">
          Discover the exciting items you could receive in each tier!
        </p>
      </div>

      {/* Email lead */}
      <div className="py-20 bg-[#efefef]">
        <section className="relative">
          <h2 className="mb-4 px-5 sm:text-center font-custom text-3xl font-bold max-w-4xl md:leading-tight mx-auto">
            Like this event?
          </h2>
          <p className="leading-relaxed mt-4 text-lg sm:text-2xl my-4 text-center mx-auto max-w-3xl">
            Get notified about when we have new events
          </p>
          <div className="px-5">
            <form
              method="POST"
              action="/subscribe"
              className="flex flex-col sm:flex-row mx-auto justify-center gap-y-2 sm:gap-y-0 max-w-2xl gap-x-2 items-center"
            >
              <input type="hidden" name="iframe_id" value="gift-surprise-campaign" />
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                className="flex-auto rounded-lg border-0 bg-white px-4 py-4 shadow-md ring-1 ring-slate-300/80 focus:ring-2 w-full max-w-xl focus:ring-slate-400/70 sm:text-base lg:text-lg sm:leading-6"
                placeholder="Enter your email"
                style={{ paddingRight: "46px" }}
              />
              <button
                type="submit"
                className="rounded-lg py-4 whitespace-nowrap px-6 sm:px-12 text-base font-bold lg:text-lg text-white shadow-lg hover:opacity-90 transition focus-visible:outline focus-visible:outline-2 w-full sm:w-fit focus-visible:outline-offset-2 focus-visible:outline-white"
                style={{ backgroundColor: "#d02e7d" }}
              >
                Notify me
              </button>
            </form>
          </div>
        </section>
      </div>

      {/* Q & A */}
      <section className="py-16 sm:py-40">
        <div className="grid sm:grid-cols-3 px-5 max-w-6xl mx-auto sm:gap-24">
          <div>
            <h2 className="text-4xl sm:text-5xl max-w-3xl mb-12 font-bold">Frequently Asked Questions</h2>
          </div>
          <div className="col-span-2 space-y-16">
            <div className="">
              <h3 className="text-2xl sm:text-2xl mb-2 font-bold" style={{ color: '#251629' }}>When does the campaign end?</h3>
              <p className="text-lg text-slate-800/80 sm:text-xl">The campaign is valid until the end of this month.</p>
            </div>
            <div className="">
              <h3 className="text-2xl sm:text-2xl mb-2 font-bold" style={{ color: '#251629' }}>Can I choose my gift?</h3>
              <p className="text-lg text-slate-800/80 sm:text-xl">No, all gifts are randomly selected from a set of 5 items per tier.</p>
            </div>
            <div className="">
              <h3 className="text-2xl sm:text-2xl mb-2 font-bold" style={{ color: '#251629' }}>Are there any restrictions on the gifts?</h3>
              <p className="text-lg text-slate-800/80 sm:text-xl">No, there are no restrictions on the gifts. It's a surprise!</p>
            </div>
            <div className="">
              <h3 className="text-2xl sm:text-2xl mb-2 font-bold" style={{ color: '#251629' }}>How many gifts can I get?</h3>
              <p className="text-lg text-slate-800/80 sm:text-xl">You can get one gift per tier you qualify for.</p>
            </div>
            <div className="">
              <h3 className="text-2xl sm:text-2xl mb-2 font-bold" style={{ color: '#251629' }}>How do I know which tier I qualify for?</h3>
              <p className="text-lg text-slate-800/80 sm:text-xl">Your gift will be determined by the total amount of your purchase.</p>
            </div>
            <div className="">
              <h3 className="text-2xl sm:text-2xl mb-2 font-bold" style={{ color: '#251629' }}>Does the purchase include sales tax?</h3>
              <p className="text-lg text-slate-800/80 sm:text-xl">Yes, the purchase amount includes any applicable sales tax.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default EventsEasterHunter;
