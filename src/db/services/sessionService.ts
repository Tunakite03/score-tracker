import { db, type Session } from '../schema';

export const sessionService = {
   // Create a new session
   async create(name: string): Promise<number> {
      const id = await db.sessions.add({
         name,
         createdAt: new Date(),
      });
      return id as number;
   },

   // Get all sessions
   async getAll(): Promise<Session[]> {
      return await db.sessions.orderBy('createdAt').reverse().toArray();
   },

   // Get a session by id
   async getById(id: number): Promise<Session | undefined> {
      return await db.sessions.get(id);
   },

   // Delete a session and all related data
   async delete(sessionId: number): Promise<void> {
      await db.transaction('rw', [db.sessions, db.players, db.rounds, db.entries, db.totals], async () => {
         await db.entries.where('sessionId').equals(sessionId).delete();
         await db.totals.where('sessionId').equals(sessionId).delete();
         await db.rounds.where('sessionId').equals(sessionId).delete();
         await db.players.where('sessionId').equals(sessionId).delete();
         await db.sessions.delete(sessionId);
      });
   },
};
