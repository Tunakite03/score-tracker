import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db/schema';
import { Trophy, Medal, Award } from 'lucide-react';

interface ScoreboardProps {
   sessionId: number;
}

export function Scoreboard({ sessionId }: ScoreboardProps) {
   const totals = useLiveQuery(async () => {
      const totalsData = await db.totals.where('sessionId').equals(sessionId).toArray();

      const playerIds = totalsData.map((t) => t.playerId);
      const players = await db.players.bulkGet(playerIds);

      const result = totalsData.map((total, index) => ({
         ...total,
         playerName: players[index]?.name || 'Unknown',
         active: players[index]?.active ?? true,
      }));

      // Sort by total descending
      return result.sort((a, b) => b.total - a.total);
   }, [sessionId]);

   const latestRound = useLiveQuery(
      () => db.rounds.where('sessionId').equals(sessionId).reverse().first(),
      [sessionId],
   );

   const getRankIcon = (rank: number) => {
      if (rank === 1) return <Trophy className='w-5 h-5 text-yellow-500' />;
      if (rank === 2) return <Medal className='w-5 h-5 text-neutral-400' />;
      if (rank === 3) return <Award className='w-5 h-5 text-amber-700' />;
      return null;
   };

   return (
      <div className='bg-white rounded-lg shadow-sm border border-neutral-200'>
         <div className='px-4 py-3 border-b border-neutral-200'>
            <h2 className='font-bold text-lg text-neutral-900'>Scoreboard</h2>
            {latestRound && <p className='text-sm text-neutral-500 mt-0.5'>After Round {latestRound.roundNo}</p>}
         </div>

         {!totals ? (
            <div className='p-8 text-center'>
               <p className='text-neutral-500'>Loading...</p>
            </div>
         ) : totals.length === 0 ? (
            <div className='p-8 text-center'>
               <p className='text-neutral-500'>No players yet</p>
            </div>
         ) : (
            <div className='divide-y divide-neutral-100'>
               {totals.map((total, index) => (
                  <div
                     key={total.id}
                     className={`px-4 py-4 flex items-center gap-3 ${!total.active ? 'opacity-50' : ''}`}
                  >
                     <div className='w-10 flex items-center justify-center'>
                        {getRankIcon(index + 1) || (
                           <span className='text-lg font-bold text-neutral-400'>{index + 1}</span>
                        )}
                     </div>

                     <div className='flex-1 min-w-0'>
                        <div className='font-semibold text-base text-neutral-900 truncate'>{total.playerName}</div>
                        {!total.active && <span className='text-xs text-neutral-500'>Inactive</span>}
                     </div>

                     <div className='text-2xl font-bold text-neutral-900'>{total.total}</div>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
}
