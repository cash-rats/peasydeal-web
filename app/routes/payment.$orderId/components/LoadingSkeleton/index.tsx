import { Skeleton } from '~/components/ui/skeleton';

export default function LoadingSkeleton() {
  return (
    <div className="py-8">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <Skeleton className="h-20 w-20 rounded-full" />

        <div className="mt-6 space-y-2">
          <Skeleton className="mx-auto h-5 w-[320px]" />
          <Skeleton className="mx-auto h-4 w-[420px]" />
        </div>

        <div className="mt-6 flex w-full flex-col justify-center gap-3 sm:flex-row sm:gap-4">
          <Skeleton className="h-10 w-full sm:w-48" />
          <Skeleton className="h-10 w-full sm:w-48" />
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Skeleton className="h-[560px] w-full rounded-xl" />
        </div>

        <div className="space-y-6 lg:col-span-1">
          <Skeleton className="h-[420px] w-full rounded-xl" />
          <Skeleton className="h-[160px] w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
