import { useState } from 'react';
import { playerService } from '@/db/services/playerService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface AddPlayerProps {
   sessionId: number;
}

export function AddPlayer({ sessionId }: AddPlayerProps) {
   const [playerName, setPlayerName] = useState('');
   const [isAdding, setIsAdding] = useState(false);

   const handleAddPlayer = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!playerName.trim() || isAdding) return;

      setIsAdding(true);
      try {
         await playerService.create(sessionId, playerName.trim());
         setPlayerName('');
      } catch (error) {
         console.error('Failed to add player:', error);
      } finally {
         setIsAdding(false);
      }
   };

   return (
      <Card>
         <CardHeader>
            <CardTitle>Add Player</CardTitle>
            <CardDescription>Add a new player to this session</CardDescription>
         </CardHeader>
         <CardContent>
            <form
               onSubmit={handleAddPlayer}
               className='flex gap-2'
            >
               <Input
                  placeholder='Enter player name...'
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className='flex-1'
               />
               <Button
                  type='submit'
                  disabled={isAdding || !playerName.trim()}
               >
                  Add
               </Button>
            </form>
         </CardContent>
      </Card>
   );
}
