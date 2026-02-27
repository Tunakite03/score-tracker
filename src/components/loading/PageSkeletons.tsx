import { MobileLayout } from '../layout/MobileLayout';
import { SkeletonList, SkeletonTable } from '../ui/skeleton';

export function SessionListSkeleton() {
   return (
      <MobileLayout title='Score Tracker'>
         <div className='p-4'>
            <div className='mb-4 space-y-3'>
               <div className='h-10 w-full animate-pulse rounded-lg bg-neutral-200' />
            </div>
            <SkeletonList count={4} />
         </div>
      </MobileLayout>
   );
}

export function SessionDashboardSkeleton() {
   return (
      <MobileLayout
         title='Loading...'
         showBackButton
      >
         <div className='p-4'>
            <div className='mb-6'>
               <div className='flex gap-2 border-b border-neutral-200'>
                  {[1, 2, 3, 4].map((i) => (
                     <div
                        key={i}
                        className='h-12 flex-1 animate-pulse rounded-t-lg bg-neutral-100'
                     />
                  ))}
               </div>
            </div>
            <SkeletonTable />
         </div>
      </MobileLayout>
   );
}
