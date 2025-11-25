import LoadMoreButton from '~/components/LoadMoreButton';

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
  const percent = total ? Math.floor((current / total) * 100) : 0;
  return (
    <div className="
      p-4 w-[300px]
      flex justify-center items-center
      flex-col gap-4
    ">
      <p className="font-poppins">
        Showing {current} of {total}
      </p>

      <div
        className="h-2 w-full rounded-full bg-slate-200"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-emerald-500 transition-all"
          style={{ width: `${Math.min(100, percent)}%` }}
        />
      </div>
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
