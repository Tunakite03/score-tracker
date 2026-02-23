import { db, type Player } from '../schema';

export const playerService = {
   // Create a new player
   async create(sessionId: number, name: string): Promise<number> {
      const playerId = await db.transaction('rw', [db.players, db.totals], async () => {
         const id = (await db.players.add({
            sessionId,
            name,
            createdAt: new Date(),
            active: true,
         })) as number;

         // Initialize total for this player
         await db.totals.put({
            id: `${sessionId}_${id}`,
            sessionId,
            playerId: id,
            total: 0,
            updatedAt: new Date(),
         });

         return id;
      });

      return playerId as number;
   },

   // Get all players for a session
   async getBySession(sessionId: number): Promise<Player[]> {
      return await db.players.where('sessionId').equals(sessionId).toArray();
   },

   // Get active players for a session
   async getActiveBySession(sessionId: number): Promise<Player[]> {
      return await db.players
         .where('sessionId')
         .equals(sessionId)
         .filter((p) => p.active)
         .toArray();
   },

   // Toggle player active status
   async toggleActive(playerId: number): Promise<void> {
      const player = await db.players.get(playerId);
      if (player) {
         await db.players.update(playerId, { active: !player.active });
      }
   },

   // Rename a player
   async rename(playerId: number, newName: string): Promise<void> {
      await db.players.update(playerId, { name: newName });
   },

   // Create multiple default players
   async createDefaultPlayers(sessionId: number, count: number = 4): Promise<void> {
      const promises = [];
      for (let i = 1; i <= count; i++) {
         promises.push(this.create(sessionId, `Player ${i}`));
      }
      await Promise.all(promises);
   },

   // Delete a player and all related data
   async delete(playerId: number): Promise<void> {
      const player = await db.players.get(playerId);
      if (!player) return;

      await db.transaction('rw', [db.players, db.totals, db.entries], async () => {
         // Delete related entries
         await db.entries.where('playerId').equals(playerId).delete();

         // Delete total
         const totalId = `${player.sessionId}_${playerId}`;
         await db.totals.delete(totalId);

         // Delete player
         await db.players.delete(playerId);
      });
   },
};
