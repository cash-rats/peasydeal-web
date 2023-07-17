import { AiFillStar } from 'react-icons/ai';

interface ReviewAggregateParams {
  averageRating: number;
};

function ReviewAggregate({ averageRating }: ReviewAggregateParams) {
  return (
    <div className="flex flex-row">
      {
        new Array(5)
          .fill(0)
          .map((_, idx) => {
            return (
              <AiFillStar key={idx} />
            )
          })
      }
    </div>
  );
}

export default ReviewAggregate;