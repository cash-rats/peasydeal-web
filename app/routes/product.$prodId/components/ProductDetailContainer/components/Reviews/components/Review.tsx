import { parseISO, format } from 'date-fns';

import RatingStar from './RatingStar';
import TruncateText from './TruncateText';
import { calcStars } from '../utils';

const parseTimestampToHumanReadable = (timestamp: string) => {
  const date = parseISO(timestamp);
  return format(date, 'MMM-yyyy');
}

const getFirstChar = (str: string) => str.slice(0, 1)

interface ReviewParams {
  text: string;
  name: string;
  rating: number;
  timestamp: string;
}

function Review({ text, name, rating, timestamp }: ReviewParams) {
  return (
    <div className="py-4 pr-4 pl-4 md:pl-0 border-b-[rgba(180,180,180,0.4)] border-b border-solid">
      <div className="flex flex-row items-center">
        <div className="mr-2">
          <div className="flex overflow-hidden justify-center items-center
              shrink-0 w-12 h-12 text-[white]
              font-bold text-2xl capitalize border rounded-[50%]
              border-solid border-[#B4B4B4] bg-[#3ECF8E]"
          >
            {getFirstChar(name)}
          </div>
        </div>

        <div className="flex-[1_0_0px] flex-col">
          <div className="mx-0 text-base font-bold">
            {name}
          </div>

          <div className="flex font-poppins text-sm text-[#595959]">
            {parseTimestampToHumanReadable(timestamp)}
          </div>
        </div>

        <div className="self-start my-1 mx-0 leading-4 flex flex-row">
          {
            calcStars(rating)
              .map((st, idx) => {
                return (
                  <RatingStar
                    starType={st}
                    key={idx}
                  />
                );
              })
          }
        </div>
      </div>

      {/* comment */}
      <div className="whitespace-normal text-sm mt-3 mb-0 mx-0">
        <TruncateText
          className="mt-0 mb-2 mx-0"
          text={text}
        />
      </div>
    </div>
  )
}

export default Review;