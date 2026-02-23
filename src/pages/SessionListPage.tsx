import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { sessionService } from '@/db/services/sessionService';
import { playerService } from '@/db/services/playerService';
import { db } from '@/db/schema';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Trash2, Plus, ChevronRight, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/i18n/LanguageContext';

export function SessionListPage() {
   const [newSessionName, setNewSessionName] = useState('');
   const [isCreating, setIsCreating] = useState(false);
   const [deletingId, setDeletingId] = useState<number | null>(null);
   const [showCreateDialog, setShowCreateDialog] = useState(false);
   const [confirmDelete, setConfirmDelete] = useState<{ id: number; name: string } | null>(null);
   const navigate = useNavigate();
   const { t } = useLanguage();

   const sessions = useLiveQuery(() => db.sessions.orderBy('createdAt').reverse().toArray());

   const handleCreateSession = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newSessionName.trim() || isCreating) return;

      setIsCreating(true);
      try {
         const sessionId = await sessionService.create(newSessionName.trim());
         // Auto-create 4 default players
         await playerService.createDefaultPlayers(sessionId, 4);
         setShowCreateDialog(false);
         toast.success(t('sessionCreated') || 'Session created!');
         navigate(`/session/${sessionId}`);
      } catch (error) {
         console.error('Failed to create session:', error);
         toast.error(t('errorCreatingSession'));
      } finally {
         setIsCreating(false);
      }
   };

   const handleDeleteClick = (sessionId: number, sessionName: string, e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent navigation when clicking delete
      setConfirmDelete({ id: sessionId, name: sessionName });
   };

   const handleDeleteConfirm = async () => {
      if (!confirmDelete || deletingId) return;

      setDeletingId(confirmDelete.id);
      try {
         await sessionService.delete(confirmDelete.id);
         toast.success(t('sessionEnded'));
         setConfirmDelete(null);
      } catch (error) {
         console.error('Failed to delete session:', error);
         toast.error(t('errorDeletingSession'));
      } finally {
         setDeletingId(null);
      }
   };

   return (
      <MobileLayout
         title={t('scoreTracker')}
         headerAction={
            <button
               onClick={() => setShowCreateDialog(true)}
               className='p-2 text-blue-600 hover:bg-blue-50 rounded-full -mr-2'
            >
               <Plus className='w-6 h-6' />
            </button>
         }
         showSettings={true}
      >
         <div className='pb-4'>
            {!sessions ? (
               <div className='flex items-center justify-center py-20'>
                  <p className='text-neutral-500'>{t('loading')}</p>
               </div>
            ) : sessions.length === 0 ? (
               <div className='flex flex-col items-center justify-center py-20 px-6'>
                  <div className='w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-4'>
                     <Users className='w-10 h-10 text-neutral-400' />
                  </div>
                  <p className='text-neutral-900 font-semibold text-lg mb-2'>{t('noSessions')}</p>
                  <p className='text-neutral-500 text-center mb-6'>{t('createFirstSession')}</p>
                  <Button
                     onClick={() => setShowCreateDialog(true)}
                     size='lg'
                     className='rounded-full'
                  >
                     <Plus className='w-5 h-5 mr-2' />
                     {t('newSession')}
                  </Button>
               </div>
            ) : (
               <div className='divide-y divide-neutral-200'>
                  {sessions.map((session) => (
                     <div
                        key={session.id}
                        onClick={() => navigate(`/session/${session.id}`)}
                        className='bg-white active:bg-neutral-50 transition-colors cursor-pointer'
                     >
                        <div className='px-4 py-4 flex items-center justify-between'>
                           <div className='flex-1 min-w-0'>
                              <h3 className='font-semibold text-base text-neutral-900 mb-1 truncate'>{session.name}</h3>
                              <p className='text-sm text-neutral-500'>
                                 {new Date(session.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                 })}
                              </p>
                           </div>
                           <div className='flex items-center gap-2 ml-3'>
                              <button
                                 onClick={(e) => handleDeleteClick(session.id!, session.name, e)}
                                 disabled={deletingId === session.id}
                                 className='p-2 text-red-600 hover:bg-red-50 rounded-full active:scale-95 transition-transform'
                              >
                                 <Trash2 className='w-5 h-5' />
                              </button>
                              <ChevronRight className='w-5 h-5 text-neutral-400' />
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>

         {/* Create Session Dialog */}
         <Dialog
            open={showCreateDialog}
            onOpenChange={setShowCreateDialog}
         >
            <DialogContent className='sm:max-w-md'>
               <DialogHeader>
                  <DialogTitle>{t('newSession')}</DialogTitle>
                  <DialogDescription>{t('createSessionDescription')}</DialogDescription>
               </DialogHeader>
               <form
                  onSubmit={handleCreateSession}
                  className='space-y-4'
               >
                  <Input
                     placeholder={t('enterSessionName')}
                     value={newSessionName}
                     onChange={(e) => setNewSessionName(e.target.value)}
                     autoFocus
                     className='text-base'
                  />
                  <div className='flex gap-2'>
                     <Button
                        type='button'
                        variant='outline'
                        onClick={() => setShowCreateDialog(false)}
                        className='flex-1'
                     >
                        {t('cancel')}
                     </Button>
                     <Button
                        type='submit'
                        disabled={isCreating || !newSessionName.trim()}
                        className='flex-1'
                     >
                        {isCreating ? t('creating') : t('confirm')}
                     </Button>
                  </div>
               </form>
            </DialogContent>
         </Dialog>

         {/* Delete Confirmation Dialog */}
         <ConfirmDialog
            open={!!confirmDelete}
            onOpenChange={(open) => !open && setConfirmDelete(null)}
            onConfirm={handleDeleteConfirm}
            title={t('deleteSession')}
            description={t('deleteSessionConfirm').replace('{name}', confirmDelete?.name || '')}
            confirmText={t('delete')}
            cancelText={t('cancel')}
            variant='danger'
         />
      </MobileLayout>
   );
}
