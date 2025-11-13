import FullStar from './images/full_star.svg';
import HalfStar from './images/half_star.svg';
import NoStar from './images/no_star.svg';
import type { StarType } from '../../types';

const getStarSrc = (starType: StarType) => {
  if (starType === 'full_star') {
    return FullStar;
  }

  if (starType === 'half_star') {
    return HalfStar;
  }

  return NoStar;
}

interface RatingStarParams {
  starType: StarType;
};

export default function RatingStar({ starType }: RatingStarParams) {
  return (
    <img
      className="w-6 h-6"
      alt='product_rating'
      src={getStarSrc(starType)}
    />
  )
}