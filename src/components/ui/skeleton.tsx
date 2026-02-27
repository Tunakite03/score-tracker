import { cn } from '@/lib/utils';

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
   return (
      <div
         className={cn('animate-pulse rounded-md bg-neutral-200', className)}
         {...props}
      />
   );
}

export function SkeletonCard() {
   return (
      <div className='rounded-lg border border-neutral-200 bg-white p-4 shadow-sm'>
         <div className='space-y-3'>
            <Skeleton className='h-5 w-2/3' />
            <Skeleton className='h-4 w-1/2' />
            <div className='flex justify-between pt-2'>
               <Skeleton className='h-4 w-20' />
               <Skeleton className='h-8 w-8 rounded-full' />
            </div>
         </div>
      </div>
   );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
   return (
      <div className='space-y-3'>
         {Array.from({ length: count }).map((_, i) => (
            <SkeletonCard key={i} />
         ))}
      </div>
   );
}

export function SkeletonTable() {
   return (
      <div className='space-y-2'>
         <Skeleton className='h-10 w-full' />
         {Array.from({ length: 4 }).map((_, i) => (
            <div
               key={i}
               className='flex gap-4'
            >
               <Skeleton className='h-12 flex-1' />
               <Skeleton className='h-12 w-20' />
            </div>
         ))}
      </div>
   );
}
