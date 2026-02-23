import { db } from '../schema';

export const undoService = {
   // Undo the last round
   async undoLastRound(sessionId: number): Promise<boolean> {
      return await db.transaction('rw', [db.rounds, db.entries, db.totals], async () => {
         // Find the latest round
         const lastRound = await db.rounds.where('sessionId').equals(sessionId).reverse().first();

         if (!lastRound || !lastRound.id) {
            return false; // No round to undo
         }

         // Get all entries for this round
         const entries = await db.entries.where('roundId').equals(lastRound.id).toArray();

         // Reverse the deltas from totals
         for (const entry of entries) {
            const totalId = `${sessionId}_${entry.playerId}`;
            const currentTotal = await db.totals.get(totalId);

            if (currentTotal) {
               await db.totals.update(totalId, {
                  total: currentTotal.total - entry.delta,
                  updatedAt: new Date(),
               });
            }
         }

         // Delete entries
         await db.entries.where('roundId').equals(lastRound.id).delete();

         // Delete round
         await db.rounds.delete(lastRound.id);

         return true;
      });
   },
};
