import { calcStars } from '../../utils';
import RatingStar from '../RatingStar';

interface ReviewAggregateParams {
  averageRating: number;
  numberOfRaters: number;
};

function ReviewAggregate({ averageRating, numberOfRaters }: ReviewAggregateParams) {
  const starArr = calcStars(averageRating);
  return (
    <div className="flex flex-row pl-4 md:pl-0">
      <div className="flex flex-row justify-cente items-center mr-[0.875rem]">
        {
          starArr
            .map((starType, idx) => {
              return (
                <RatingStar
                  starType={starType}
                  key={idx}
                />
              )
            })
        }
      </div>

      <div className="font-poppins text-sm text-[#04844B]
        flex flex-row items-center mr-[0.875rem]
      ">
        {Math.floor(averageRating * 100) / 100} / 5
      </div>
      <div className="flex flex-row items-center font-poppins">
        {numberOfRaters} reviews
      </div>
    </div>
  );
}

export default ReviewAggregate;