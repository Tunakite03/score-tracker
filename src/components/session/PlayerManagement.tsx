import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db/schema';
import { playerService } from '@/db/services/playerService';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Trash2, UserPlus, Pencil, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/i18n/LanguageContext';

interface PlayerManagementProps {
   sessionId: number;
}

export function PlayerManagement({ sessionId }: PlayerManagementProps) {
   const [playerName, setPlayerName] = useState('');
   const [isAdding, setIsAdding] = useState(false);
   const [deletingId, setDeletingId] = useState<number | null>(null);
   const [editingId, setEditingId] = useState<number | null>(null);
   const [editingName, setEditingName] = useState('');
   const [confirmDelete, setConfirmDelete] = useState<{ id: number; name: string } | null>(null);
   const { t } = useLanguage();

   const players = useLiveQuery(() => db.players.where('sessionId').equals(sessionId).toArray(), [sessionId]);

   const handleAddPlayer = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!playerName.trim() || isAdding) return;

      setIsAdding(true);
      try {
         await playerService.create(sessionId, playerName.trim());
         setPlayerName('');
         toast.success(t('playerAdded'));
      } catch (error) {
         console.error('Failed to add player:', error);
         toast.error(t('errorAddingPlayer'));
      } finally {
         setIsAdding(false);
      }
   };

   const handleDeleteClick = (playerId: number, playerName: string) => {
      setConfirmDelete({ id: playerId, name: playerName });
   };

   const handleDeleteConfirm = async () => {
      if (!confirmDelete || deletingId) return;

      setDeletingId(confirmDelete.id);
      try {
         await playerService.delete(confirmDelete.id);
         toast.success(t('playerRemoved'));
         setConfirmDelete(null);
      } catch (error) {
         console.error('Failed to delete player:', error);
         toast.error(t('errorRemovingPlayer'));
      } finally {
         setDeletingId(null);
      }
   };

   const startEditing = (playerId: number, currentName: string) => {
      setEditingId(playerId);
      setEditingName(currentName);
   };

   const cancelEditing = () => {
      setEditingId(null);
      setEditingName('');
   };

   const savePlayerName = async (playerId: number) => {
      if (!editingName.trim()) {
         toast.error(t('playerNameEmpty'));
         return;
      }

      try {
         await playerService.rename(playerId, editingName.trim());
         toast.success(t('playerRenamed'));
         setEditingId(null);
         setEditingName('');
      } catch (error) {
         console.error('Failed to rename player:', error);
         toast.error(t('errorRenamingPlayer'));
      }
   };

   return (
      <div className='space-y-4'>
         {/* Add Player Form */}
         <div className='bg-white rounded-lg shadow-sm border border-neutral-200 p-4'>
            <h3 className='font-bold text-base text-neutral-900 mb-3'>{t('addPlayer')}</h3>
            <form
               onSubmit={handleAddPlayer}
               className='flex gap-2'
            >
               <Input
                  placeholder={t('playerNamePlaceholder')}
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className='flex-1 h-12 text-base'
               />
               <Button
                  type='submit'
                  disabled={isAdding || !playerName.trim()}
                  size='lg'
               >
                  <UserPlus className='w-5 h-5' />
               </Button>
            </form>
         </div>

         {/* Players List */}
         <div className='bg-white rounded-lg shadow-sm border border-neutral-200'>
            <div className='px-4 py-3 border-b border-neutral-200'>
               <h3 className='font-bold text-base text-neutral-900'>
                  {t('players')} ({players?.length || 0})
               </h3>
            </div>

            {!players ? (
               <div className='p-8 text-center'>
                  <p className='text-neutral-500'>{t('loading')}</p>
               </div>
            ) : players.length === 0 ? (
               <div className='p-8 text-center'>
                  <p className='text-neutral-500'>{t('noActivePlayers')}</p>
               </div>
            ) : (
               <div className='divide-y divide-neutral-100'>
                  {players.map((player) => (
                     <div
                        key={player.id}
                        className='px-4 py-4 flex items-center justify-between gap-3'
                     >
                        {editingId === player.id ? (
                           // Editing mode
                           <>
                              <div className='flex-1 flex items-center gap-2'>
                                 <Input
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    className='flex-1 h-10 text-base'
                                    autoFocus
                                    onKeyDown={(e) => {
                                       if (e.key === 'Enter') {
                                          savePlayerName(player.id!);
                                       } else if (e.key === 'Escape') {
                                          cancelEditing();
                                       }
                                    }}
                                 />
                              </div>
                              <div className='flex items-center gap-1'>
                                 <button
                                    onClick={() => savePlayerName(player.id!)}
                                    className='p-2 text-green-600 hover:bg-green-50 rounded-full active:scale-95 transition-transform'
                                 >
                                    <Check className='w-5 h-5' />
                                 </button>
                                 <button
                                    onClick={cancelEditing}
                                    className='p-2 text-neutral-600 hover:bg-neutral-100 rounded-full active:scale-95 transition-transform'
                                 >
                                    <X className='w-5 h-5' />
                                 </button>
                              </div>
                           </>
                        ) : (
                           // View mode
                           <>
                              <div className='flex-1 min-w-0'>
                                 <div className='font-semibold text-base text-neutral-900 truncate'>{player.name}</div>
                                 <div className='text-sm text-neutral-500 mt-0.5'>
                                    {player.active ? (
                                       <span className='text-green-600'>● {t('active')}</span>
                                    ) : (
                                       <span className='text-neutral-400'>○ {t('inactive')}</span>
                                    )}
                                 </div>
                              </div>

                              <div className='flex items-center gap-1'>
                                 <button
                                    onClick={() => startEditing(player.id!, player.name)}
                                    className='p-2 text-blue-600 hover:bg-blue-50 rounded-full active:scale-95 transition-transform'
                                 >
                                    <Pencil className='w-5 h-5' />
                                 </button>
                                 <button
                                    onClick={() => handleDeleteClick(player.id!, player.name)}
                                    disabled={deletingId === player.id}
                                    className='p-2 text-red-600 hover:bg-red-50 rounded-full active:scale-95 transition-transform disabled:opacity-50'
                                 >
                                    <Trash2 className='w-5 h-5' />
                                 </button>
                              </div>
                           </>
                        )}
                     </div>
                  ))}
               </div>
            )}
         </div>

         {/* Delete Confirmation Dialog */}
         <ConfirmDialog
            open={!!confirmDelete}
            onOpenChange={(open) => !open && setConfirmDelete(null)}
            onConfirm={handleDeleteConfirm}
            title={t('removePlayer')}
            description={t('removePlayerConfirm')}
            confirmText={t('delete')}
            cancelText={t('cancel')}
            variant='danger'
         />
      </div>
   );
}
