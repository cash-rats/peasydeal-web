import LoadMoreButton from '~/components/LoadMoreButton';
import { Progress } from '@chakra-ui/react';

interface ILoadMoreButtonProgressBars {
  current: number;
  total: number;
  onClickLoadMore?: () => void;
  loading?: boolean;
}

function LoadMoreButtonProgressBar({
  current,
  total,
  onClickLoadMore = () => { },
  loading = false,
}: ILoadMoreButtonProgressBars) {
  return (
    <div className="
        p-4 w-[300px]
        flex justify-center items-center
        flex-col gap-4
      ">
      <p className="font-poppins">
        Showing {current} of {total}
      </p>

      <Progress
        className="w-full"
        size='sm'
        value={Math.floor((current / total) * 100)}
        colorScheme='teal'
      />

      {
        current < total
          ? (
            <LoadMoreButton
              loading={loading}
              onClick={onClickLoadMore}
              text='Show More'
            />
          )
          : (
            <p className="font-poppins capitalize font-medium">
              Reaches end of list.
            </p>
          )
      }
    </div>

  );
}

export default LoadMoreButtonProgressBar;