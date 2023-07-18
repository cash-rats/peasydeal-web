import FullStar from './images/full_star.svg';
import HalfStar from './images/half_star.svg';
import NoStar from './images/no_star.svg';

/*
> 4.5 && <= 5 ---> 5 stars
r >= 4.3 && r <= 4.5 ---> 4.5 stars
>= 4 && < 4.3 ---> 4 stars

- When modulo > 0.5 ---> + 1 star
- When modulo >= 0.3 && <= 0.5 ---> + 0.5 star
- When modulo >= 0 && < 0.3 ---> + 0 star
*/

type StarType = 'no_start' | 'half_star' | 'full_star';

function calcStars(num: number): StarType[] {
  // take number to the 2th decimal places
  num = Math.floor(num * 100)
  const mod = num % 100;
  const fullstarcount = Math.floor(num / 100);
  let trailingstar = 'no_star';

  if (mod > 50) {
    trailingstar = 'full_star';
  } else if (mod >= 30 && mod <= 50) {
    trailingstar = 'half_star';
  } else if (mod >= 0 && mod < 30) {
    trailingstar = 'no_star';
  }

  const stararr = new Array(5).fill('no_star');
  let placeCount = 0
  for (let i = 0; i < fullstarcount; i++) {
    stararr[i] = 'full_star';
    placeCount++;
  }
  console.log('debug placeCount', placeCount);
  stararr[placeCount] = trailingstar;
  for (let j = placeCount + 1; j < stararr.length; j++) {
    stararr[j] = 'no_star';
  }
  return stararr;
}


function renderStar(starType: StarType) {
  if (starType === 'full_star') {
    return FullStar;
  }

  if (starType === 'half_star') {
    return HalfStar;
  }

  return NoStar;
}

interface ReviewAggregateParams {
  averageRating: number;
  numberOfRaters: number;
};

function ReviewAggregate({ averageRating, numberOfRaters }: ReviewAggregateParams) {
  const starArr = calcStars(averageRating);
  return (
    <div className="flex flex-row">
      <div className="flex flex-row justify-cente items-center mr-[0.875rem]">
        {
          starArr
            .map((starType, idx) => {
              return (
                <img
                  className="w-6 h-6"
                  alt='product_rating'
                  key={idx}
                  src={renderStar(starType)}
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