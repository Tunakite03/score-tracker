import { db, type Total } from '../schema';

export interface PlayerTotal extends Total {
   playerName: string;
}

export const totalService = {
   // Get totals for a session with player names
   async getTotalsForSession(sessionId: number): Promise<PlayerTotal[]> {
      const totals = await db.totals.where('sessionId').equals(sessionId).toArray();

      const playerIds = totals.map((t) => t.playerId);
      const players = await db.players.bulkGet(playerIds);

      const result: PlayerTotal[] = totals.map((total, index) => ({
         ...total,
         playerName: players[index]?.name || 'Unknown',
      }));

      // Sort by total descending
      return result.sort((a, b) => b.total - a.total);
   },

   // Get total for a specific player
   async getPlayerTotal(sessionId: number, playerId: number): Promise<Total | undefined> {
      const totalId = `${sessionId}_${playerId}`;
      return await db.totals.get(totalId);
   },
};
