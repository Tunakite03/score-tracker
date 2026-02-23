import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Round } from '@/db/schema';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChevronRight, Clock } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

interface HistoryListProps {
   sessionId: number;
}

export function HistoryList({ sessionId }: HistoryListProps) {
   const [selectedRound, setSelectedRound] = useState<Round | null>(null);
   const { t } = useLanguage();

   const rounds = useLiveQuery(() => db.rounds.where('sessionId').equals(sessionId).reverse().toArray(), [sessionId]);

   const roundDetails = useLiveQuery(async () => {
      if (!selectedRound?.id) return null;

      const entries = await db.entries.where('roundId').equals(selectedRound.id).toArray();

      const playerIds = entries.map((e) => e.playerId);
      const players = await db.players.bulkGet(playerIds);

      return entries.map((entry, index) => ({
         ...entry,
         playerName: players[index]?.name || 'Unknown',
      }));
   }, [selectedRound]);

   return (
      <>
         <div className='bg-white rounded-lg shadow-sm border border-neutral-200'>
            <div className='px-4 py-3 border-b border-neutral-200'>
               <h2 className='font-bold text-lg text-neutral-900'>{t('history')}</h2>
            </div>

            {!rounds ? (
               <div className='p-8 text-center'>
                  <p className='text-neutral-500'>Loading...</p>
               </div>
            ) : rounds.length === 0 ? (
               <div className='p-8 text-center'>
                  <p className='text-neutral-500'>{t('noHistory')}</p>
               </div>
            ) : (
               <div className='divide-y divide-neutral-100'>
                  {rounds.map((round) => (
                     <div
                        key={round.id}
                        onClick={() => setSelectedRound(round)}
                        className='px-4 py-4 flex items-center justify-between gap-3 active:bg-neutral-50 transition-colors cursor-pointer'
                     >
                        <div className='flex-1 min-w-0'>
                           <div className='font-semibold text-base text-neutral-900 mb-1'>
                              {t('round')} {round.roundNo}
                           </div>
                           <div className='flex items-center gap-1.5 text-sm text-neutral-500'>
                              <Clock className='w-3.5 h-3.5' />
                              {new Date(round.createdAt).toLocaleString('en-US', {
                                 month: 'short',
                                 day: 'numeric',
                                 hour: 'numeric',
                                 minute: '2-digit',
                              })}
                           </div>
                           {round.note && <div className='text-sm text-neutral-600 mt-1 truncate'>{round.note}</div>}
                        </div>
                        <ChevronRight className='w-5 h-5 text-neutral-400' />
                     </div>
                  ))}
               </div>
            )}
         </div>

         {/* Round Detail Modal */}
         <Dialog
            open={!!selectedRound}
            onOpenChange={(open) => !open && setSelectedRound(null)}
         >
            <DialogContent className='sm:max-w-md'>
               <DialogHeader>
                  <DialogTitle>
                     {t('round')} {selectedRound?.roundNo}
                  </DialogTitle>
                  <div className='text-sm text-neutral-500 mt-1'>
                     {selectedRound && new Date(selectedRound.createdAt).toLocaleString()}
                  </div>
               </DialogHeader>

               {roundDetails && (
                  <div className='space-y-3 mt-4'>
                     <div className='divide-y divide-neutral-100 border rounded-lg overflow-hidden'>
                        {roundDetails.map((entry) => (
                           <div
                              key={entry.id}
                              className='px-4 py-3 flex items-center justify-between bg-white'
                           >
                              <span className='font-medium text-neutral-900'>{entry.playerName}</span>
                              <Badge
                                 variant={entry.delta >= 0 ? 'default' : 'destructive'}
                                 className='font-mono text-base px-3 py-1'
                              >
                                 {entry.delta >= 0 ? '+' : ''}
                                 {entry.delta}
                              </Badge>
                           </div>
                        ))}
                     </div>

                     {selectedRound?.note && (
                        <div className='p-3 bg-neutral-50 rounded-lg'>
                           <div className='text-xs font-medium text-neutral-700 mb-1'>{t('note')}</div>
                           <div className='text-sm text-neutral-600'>{selectedRound.note}</div>
                        </div>
                     )}
                  </div>
               )}
            </DialogContent>
         </Dialog>
      </>
   );
}
