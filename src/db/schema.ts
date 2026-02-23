import Dexie, { type EntityTable } from 'dexie';

// Type definitions
export interface Session {
   id?: number;
   name: string;
   createdAt: Date;
}

export interface Player {
   id?: number;
   sessionId: number;
   name: string;
   createdAt: Date;
   active: boolean;
}

export interface Round {
   id?: number;
   sessionId: number;
   roundNo: number;
   note?: string;
   createdAt: Date;
}

export interface Entry {
   id: string; // roundId_playerId
   sessionId: number;
   roundId: number;
   playerId: number;
   delta: number;
}

export interface Total {
   id: string; // sessionId_playerId
   sessionId: number;
   playerId: number;
   total: number;
   updatedAt: Date;
}

// Database instance
export class ScoreTrackerDB extends Dexie {
   sessions!: EntityTable<Session, 'id'>;
   players!: EntityTable<Player, 'id'>;
   rounds!: EntityTable<Round, 'id'>;
   entries!: EntityTable<Entry, 'id'>;
   totals!: EntityTable<Total, 'id'>;

   constructor() {
      super('ScoreTrackerDB');

      this.version(1).stores({
         sessions: '++id, name, createdAt',
         players: '++id, sessionId, name, createdAt, active',
         rounds: '++id, sessionId, roundNo, createdAt',
         entries: 'id, sessionId, roundId, playerId',
         totals: 'id, sessionId, playerId, updatedAt',
      });

      this.version(2).stores({
         sessions: '++id, name, createdAt',
         players: '++id, sessionId, name, createdAt, active, [sessionId+active]',
         rounds: '++id, sessionId, roundNo, createdAt',
         entries: 'id, sessionId, roundId, playerId',
         totals: 'id, sessionId, playerId, updatedAt',
      });
   }
}

export const db = new ScoreTrackerDB();
