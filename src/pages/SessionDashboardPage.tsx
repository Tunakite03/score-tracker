import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db/schema';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { PlayerManagement } from '@/components/session/PlayerManagement';
import { Scoreboard } from '@/components/scoreboard/Scoreboard';
import { NewRoundForm } from '@/components/round/NewRoundForm';
import { HistoryList } from '@/components/history/HistoryList';
import { Trophy, Gamepad2, Users, History } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

type TabType = 'scoreboard' | 'round' | 'players' | 'history';

export function SessionDashboardPage() {
   const { sessionId } = useParams<{ sessionId: string }>();
   const id = parseInt(sessionId || '0', 10);
   const [activeTab, setActiveTab] = useState<TabType>('scoreboard');
   const { t } = useLanguage();

   const session = useLiveQuery(() => db.sessions.get(id), [id]);

   if (!session) {
      return (
         <MobileLayout
            title={t('loading')}
            showBackButton
         >
            <div className='flex items-center justify-center py-20'>
               <p className='text-neutral-500'>{t('loadingSession')}</p>
            </div>
         </MobileLayout>
      );
   }

   const tabs = [
      { id: 'scoreboard' as TabType, label: t('total'), icon: Trophy },
      { id: 'round' as TabType, label: t('newRound'), icon: Gamepad2 },
      { id: 'players' as TabType, label: t('addPlayer'), icon: Users },
      { id: 'history' as TabType, label: t('history'), icon: History },
   ];

   return (
      <MobileLayout
         title={session.name}
         showBackButton
      >
         {/* Tab Navigation */}
         <div className='sticky top-0 z-10 bg-white border-b border-neutral-200'>
            <div className='flex'>
               {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                     <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex flex-col items-center justify-center py-3 border-b-2 transition-colors ${
                           isActive ? 'border-blue-600 text-blue-600' : 'border-transparent text-neutral-500'
                        }`}
                     >
                        <Icon className='w-5 h-5 mb-1' />
                        <span className='text-xs font-medium'>{tab.label}</span>
                     </button>
                  );
               })}
            </div>
         </div>

         {/* Tab Content */}
         <div className='pb-4'>
            {activeTab === 'scoreboard' && (
               <div className='p-4'>
                  <Scoreboard sessionId={id} />
               </div>
            )}

            {activeTab === 'round' && (
               <div className='p-4'>
                  <NewRoundForm sessionId={id} />
               </div>
            )}

            {activeTab === 'players' && (
               <div className='p-4'>
                  <PlayerManagement sessionId={id} />
               </div>
            )}

            {activeTab === 'history' && (
               <div className='p-4'>
                  <HistoryList sessionId={id} />
               </div>
            )}
         </div>
      </MobileLayout>
   );
}
