import { Skeleton } from '~/components/ui/skeleton';

export default function LoadingSkeleton() {
  return (
    <div className="pt-8">

    <div className="aspect-[3/4] w-[600px]">
      <div className="flex flex-col items-center">
        <div className="text-center">
          <Skeleton className="h-[120px] w-[120px] rounded-full" />
        </div>

        <div className="text-center mt-4">
          <Skeleton className="mx-auto h-4 w-[320px]" />
          <Skeleton className="mx-auto mt-2 h-4 w-[320px]" />
        </div>

        <div className="flex justify-center gap-6 mt-6">
          <Skeleton className="h-[30px] w-[85px]" />
          <Skeleton className="h-[30px] w-[85px]" />
        </div>
      </div>

      <div className="w-full h-64 p-3 mt-6 mx-auto mb-0">
        <Skeleton className="h-full w-full rounded" />
      </div>

      <div className="w-full mt-6 mx-auto mb-8 p-3">
        {
          Array.from([0, 1, 3]).map((_, index) => (
            <div key={index} className="mt-[10px] w-full flex">
              <div className="flex-1">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="mt-2 h-4 w-[150px]" />
              </div>

              <div className="flex justify-end flex-1">
                <Skeleton className="h-4 w-[70px]" />
              </div>
            </div>

          ))
        }
      </div>
    </div>
    </div>
  );
}
