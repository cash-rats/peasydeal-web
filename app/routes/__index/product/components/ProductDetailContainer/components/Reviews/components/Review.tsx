import { AiFillStar } from 'react-icons/ai';

import TruncateText from './TruncateText';

interface ReviewParams {
  text: string;
}

function Review({ text }: ReviewParams) {
  return (
    <div className="py-4 pr-4 border-b-[rgba(180,180,180,0.4)] border-b border-solid">
      <div className="flex flex-row items-center">
        <div className="mr-2">
          <div className="flex overflow-hidden justify-center items-center
              shrink-0 w-12 h-12 text-[white]
              font-bold text-2xl capitalize border rounded-[50%]
              border-solid border-[#B4B4B4] bg-[#3ECF8E]"
          >
            h
          </div>
        </div>

        <div className="flex-[1_0_0px] flex-col">
          <div className="mx-0 text-base font-bold">
            Katrina
          </div>
          <div className="flex font-poppins text-sm text-[#595959]">
            july 2023
          </div>
        </div>

        <div className="self-start my-1 mx-0 leading-4 flex flex-row">
          {
            (new Array(5)).fill(0).map((v, idx) => (
              <AiFillStar
                fontSize={24}
                key={idx}
                color='#207A41'
              />
            ))
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