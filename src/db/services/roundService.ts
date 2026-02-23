import { db, type Round, type Entry } from '../schema';

export interface RoundDelta {
   playerId: number;
   delta: number;
}

export const roundService = {
   // Create a new round with player deltas
   async createRound(sessionId: number, deltas: RoundDelta[], note?: string): Promise<number> {
      return await db.transaction('rw', [db.rounds, db.entries, db.totals, db.players], async () => {
         // Get active players
         const activePlayers = await db.players
            .where('sessionId')
            .equals(sessionId)
            .filter((p) => p.active)
            .toArray();

         // Validate that we have deltas for all active players
         const activePlayerIds = activePlayers.map((p) => p.id!);
         const deltaPlayerIds = deltas.map((d) => d.playerId);

         const missingPlayers = activePlayerIds.filter((id) => !deltaPlayerIds.includes(id));
         if (missingPlayers.length > 0) {
            throw new Error('Missing deltas for some active players');
         }

         // Get the next round number
         const lastRound = await db.rounds.where('sessionId').equals(sessionId).reverse().first();

         const roundNo = lastRound ? lastRound.roundNo + 1 : 1;

         // Create the round
         const roundId = (await db.rounds.add({
            sessionId,
            roundNo,
            note,
            createdAt: new Date(),
         })) as number;

         // Create entries for each player
         const entries: Entry[] = deltas.map(({ playerId, delta }) => ({
            id: `${roundId}_${playerId}`,
            sessionId,
            roundId,
            playerId,
            delta,
         }));

         await db.entries.bulkAdd(entries);

         // Update totals
         for (const { playerId, delta } of deltas) {
            const totalId = `${sessionId}_${playerId}`;
            const currentTotal = await db.totals.get(totalId);

            if (currentTotal) {
               await db.totals.update(totalId, {
                  total: currentTotal.total + delta,
                  updatedAt: new Date(),
               });
            }
         }

         return roundId;
      });
   },

   // Get all rounds for a session
   async getBySession(sessionId: number): Promise<Round[]> {
      return await db.rounds.where('sessionId').equals(sessionId).reverse().toArray();
   },

   // Get round entries
   async getRoundEntries(roundId: number): Promise<Entry[]> {
      return await db.entries.where('roundId').equals(roundId).toArray();
   },

   // Get the latest round for a session
   async getLatestRound(sessionId: number): Promise<Round | undefined> {
      return await db.rounds.where('sessionId').equals(sessionId).reverse().first();
   },
};
