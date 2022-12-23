import Skeleton from '@mui/material/Skeleton';

export default function LoadingSkeleton() {
  return (
    <div className="pt-8 aspect-[3/4] w-[600px]">
      <div className="flex flex-col items-center">
        <div className="text-center">
          <Skeleton variant='circular' width={120} height={120} />
        </div>

        {/* <div className="ResulSkeleton-annotation-title"> */}
        <div className="text-center  mt-4">
          <Skeleton variant='text' width={320} sx={{ fontSize: '1rem' }} />
          <Skeleton variant='text' width={320} sx={{ fontSize: '1rem' }} />
        </div>

        <div className="flex justify-center gap-6 mt-6">
          <Skeleton variant='rectangular' width={85} height={30} />
          <Skeleton variant='rectangular' width={85} height={30} />
        </div>
      </div>

      <div className="w-full h-64 p-3 mt-6 mx-auto mb-0">
        <Skeleton variant='rectangular' height='100%' />
      </div>

      <div className="w-full mt-6 mx-auto mb-8 p-3">
        {
          Array.from([0, 1, 3]).map((_, index) => (
            <div key={index} className="mt-[10px] w-full flex">
              <div className="flex-1">
                <Skeleton variant='text' width={250} />
                <Skeleton variant='text' width={150} />
              </div>

              <div className="flex justify-end flex-1">
                <Skeleton variant='text' width={50} sx={{ fontSize: '1rem' }} />
              </div>
            </div>

          ))
        }
      </div>
    </div>
  );
}
