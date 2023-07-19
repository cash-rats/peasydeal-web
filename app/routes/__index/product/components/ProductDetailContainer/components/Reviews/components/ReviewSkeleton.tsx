import { Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react';

function ReviewSkeleton() {
  return (
    <>
      {
        (new Array(3)).fill(0).map((_, idx) => (
          <div key={idx} className="flex flex-col border-b-[rgba(180,180,180,0.4)] border-b border-solid py-4 pr-4">
            <div className="flex flex-row justify-start items-center mb-4">
              <Skeleton className="mr-3" height={4} width={70} />
              <Skeleton className="mr-3" height={4} width={32} />
              <Skeleton className="mr-3" height={4} width={32} />
            </div>

            <div className="flex flex-row">
              <SkeletonCircle width={12} height={12} className="mr-3" />
              <div className="flex flex-row items-center justify-between w-full ">
                <div className="flex flex-col gap-1">
                  <Skeleton height={4} width={32} />
                  <Skeleton height={4} width={32} />
                </div>
                <Skeleton className='self-start' height={4} width={32} />
              </div>
            </div>

            <SkeletonText mt='4' noOfLines={3} spacing='4' skeletonHeight='3' />
          </div>
        ))


      }
    </>
  )
}

export default ReviewSkeleton;