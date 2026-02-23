import { useState, useRef, type KeyboardEvent } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db/schema';
import { roundService } from '@/db/services/roundService';
import { undoService } from '@/db/services/undoService';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { toast } from 'sonner';
import { Undo2, Save } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

interface NewRoundFormProps {
   sessionId: number;
}

export function NewRoundForm({ sessionId }: NewRoundFormProps) {
   const [deltas, setDeltas] = useState<Record<number, string>>({});
   const [signs, setSigns] = useState<Record<number, 1 | -1>>({});
   const [isSaving, setIsSaving] = useState(false);
   const [isUndoing, setIsUndoing] = useState(false);
   const [showUndoConfirm, setShowUndoConfirm] = useState(false);
   const [validationMode, setValidationMode] = useState<'zero-sum' | 'free'>('zero-sum');
   const inputRefs = useRef<Record<number, HTMLInputElement | null>>({});
   const { t } = useLanguage();

   const activePlayers = useLiveQuery(
      () =>
         db.players
            .where('sessionId')
            .equals(sessionId)
            .filter((p) => p.active)
            .toArray(),
      [sessionId],
   );

   const latestRound = useLiveQuery(
      () => db.rounds.where('sessionId').equals(sessionId).reverse().first(),
      [sessionId],
   );

   const handleDeltaChange = (playerId: number, value: string) => {
      // Allow empty or positive numbers only
      if (value === '' || /^\d+$/.test(value)) {
         setDeltas((prev) => ({ ...prev, [playerId]: value }));
      }
   };

   const toggleSign = (playerId: number) => {
      setSigns((prev) => ({
         ...prev,
         [playerId]: (prev[playerId] || 1) === 1 ? -1 : 1,
      }));
   };

   const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
      if (e.key === 'Enter') {
         e.preventDefault();
         if (activePlayers && index < activePlayers.length - 1) {
            // Move to next input
            const nextPlayer = activePlayers[index + 1];
            inputRefs.current[nextPlayer.id!]?.focus();
         } else {
            // Last input, try to save
            handleSaveRound();
         }
      }
   };

   const handleSaveRound = async () => {
      if (!activePlayers || activePlayers.length === 0) {
         toast.error(t('noActivePlayersError'));
         return;
      }

      if (isSaving) return;

      // Prepare deltas
      const roundDeltas = activePlayers.map((player) => {
         const deltaStr = deltas[player.id!] || '0';
         const sign = signs[player.id!] || 1;
         const delta = (parseInt(deltaStr, 10) || 0) * sign;
         return { playerId: player.id!, delta };
      });

      // Validate: total must equal 0 (only in zero-sum mode)
      if (validationMode === 'zero-sum') {
         const total = roundDeltas.reduce((sum, d) => sum + d.delta, 0);
         if (total !== 0) {
            const totalStr = `${total > 0 ? '+' : ''}${total}`;
            toast.error(t('totalMustBeZero').replace('{total}', totalStr));
            return;
         }
      }

      setIsSaving(true);
      try {
         await roundService.createRound(sessionId, roundDeltas);
         setDeltas({}); // Reset form
         setSigns({}); // Reset signs
         toast.success(t('roundAdded'));

         // Focus first input
         if (activePlayers[0]) {
            inputRefs.current[activePlayers[0].id!]?.focus();
         }
      } catch (error) {
         console.error('Failed to create round:', error);
         toast.error(t('errorAddingRound'));
      } finally {
         setIsSaving(false);
      }
   };

   const handleUndoClick = () => {
      if (isUndoing) return;
      setShowUndoConfirm(true);
   };

   const handleUndoConfirm = async () => {
      setIsUndoing(true);
      try {
         const success = await undoService.undoLastRound(sessionId);
         if (success) {
            toast.success(t('undoSuccess'));
         } else {
            toast.error(t('noHistory'));
         }
      } catch (error) {
         console.error('Failed to undo round:', error);
         toast.error('Failed to undo round');
      } finally {
         setIsUndoing(false);
      }
   };

   if (!activePlayers) {
      return (
         <div className='p-8 text-center'>
            <p className='text-neutral-500'>{t('loading')}</p>
         </div>
      );
   }

   if (activePlayers.length === 0) {
      return (
         <div className='p-8 text-center'>
            <p className='text-neutral-600 font-medium mb-2'>{t('noActivePlayers')}</p>
            <p className='text-sm text-neutral-500'>{t('addPlayersToStart')}</p>
         </div>
      );
   }

   // Calculate current total
   const currentTotal = activePlayers.reduce((sum, player) => {
      const deltaStr = deltas[player.id!] || '0';
      const sign = signs[player.id!] || 1;
      const delta = (parseInt(deltaStr, 10) || 0) * sign;
      return sum + delta;
   }, 0);

   const isValidTotal = validationMode === 'free' || currentTotal === 0;
   const nextRoundNo = latestRound ? latestRound.roundNo + 1 : 1;

   return (
      <div className='space-y-4'>
         {/* Score Entry */}
         <div className='bg-white rounded-lg shadow-sm border border-neutral-200'>
            <div className='px-4 py-3 border-b border-neutral-200'>
               <div className='flex items-center justify-between mb-2'>
                  <h2 className='font-bold text-lg text-neutral-900'>
                     {t('round')} {nextRoundNo}
                  </h2>

                  {/* Validation Mode Toggle */}
                  <div className='flex gap-1 bg-neutral-100 rounded-lg p-1'>
                     <button
                        type='button'
                        onClick={() => setValidationMode('zero-sum')}
                        className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                           validationMode === 'zero-sum'
                              ? 'bg-white text-neutral-900 shadow-sm'
                              : 'text-neutral-600 hover:text-neutral-900'
                        }`}
                     >
                        {t('zeroSum')}
                     </button>
                     <button
                        type='button'
                        onClick={() => setValidationMode('free')}
                        className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                           validationMode === 'free'
                              ? 'bg-white text-neutral-900 shadow-sm'
                              : 'text-neutral-600 hover:text-neutral-900'
                        }`}
                     >
                        {t('free')}
                     </button>
                  </div>
               </div>
               <p className='text-sm text-neutral-500'>
                  {validationMode === 'zero-sum' ? t('tapToChangeSign') : t('tapToChangeSignFree')}
               </p>
            </div>

            <div className='divide-y divide-neutral-100'>
               {activePlayers.map((player, index) => (
                  <div
                     key={player.id}
                     className='px-4 py-3 flex items-center justify-between gap-4'
                  >
                     <div className='flex-1 min-w-0'>
                        <div className='font-medium text-base text-neutral-900 truncate'>{player.name}</div>
                     </div>

                     <div className='flex items-center gap-2'>
                        <button
                           type='button'
                           onClick={() => toggleSign(player.id!)}
                           className={`w-10 h-12 flex items-center justify-center rounded-md font-bold text-lg transition-colors ${
                              (signs[player.id!] || 1) === 1
                                 ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                 : 'bg-red-100 text-red-700 hover:bg-red-200'
                           }`}
                        >
                           {(signs[player.id!] || 1) === 1 ? '+' : '−'}
                        </button>

                        <Input
                           ref={(el) => {
                              if (player.id) inputRefs.current[player.id] = el;
                           }}
                           type='text'
                           inputMode='numeric'
                           placeholder='0'
                           value={deltas[player.id!] || ''}
                           onChange={(e) => handleDeltaChange(player.id!, e.target.value)}
                           onKeyDown={(e) => handleKeyDown(e, index)}
                           className='w-20 text-center text-lg font-semibold h-12'
                        />
                     </div>
                  </div>
               ))}
            </div>

            {/* Total Indicator */}
            <div className='px-4 py-3 border-t-2 border-neutral-200 bg-neutral-50'>
               <div className='flex items-center justify-between'>
                  <span className='font-semibold text-neutral-900'>{t('totalLabel')}</span>
                  <span
                     className={`text-xl font-bold ${
                        validationMode === 'free' ? 'text-blue-600' : isValidTotal ? 'text-green-600' : 'text-red-600'
                     }`}
                  >
                     {currentTotal > 0 ? '+' : ''}
                     {currentTotal}
                  </span>
               </div>
               {validationMode === 'zero-sum' && !isValidTotal && (
                  <p className='text-xs text-red-600 mt-1 text-right'>{t('mustEqualZero')}</p>
               )}
            </div>
         </div>

         {/* Action Buttons */}
         <div className='flex gap-3'>
            <Button
               onClick={handleUndoClick}
               disabled={isUndoing || !latestRound}
               variant='outline'
               size='lg'
               className='flex-1'
            >
               <Undo2 className='w-5 h-5 mr-2' />
               {t('undo')}
            </Button>
            <Button
               onClick={handleSaveRound}
               disabled={isSaving || !isValidTotal}
               size='lg'
               className='flex-2'
            >
               <Save className='w-5 h-5 mr-2' />
               {t('submitRound')}
            </Button>
         </div>

         {/* Undo Confirmation Dialog */}
         <ConfirmDialog
            open={showUndoConfirm}
            onOpenChange={setShowUndoConfirm}
            onConfirm={handleUndoConfirm}
            title={t('undoLastRound')}
            description={t('undoLastRoundConfirm').replace('{roundNo}', String(latestRound?.roundNo || ''))}
            confirmText={t('undo')}
            cancelText={t('cancel')}
            variant='warning'
         />
      </div>
   );
}
