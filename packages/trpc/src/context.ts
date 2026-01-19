import type { Database } from '@repo/database';

export interface Context {
  db: Database;
}

export type CreateContextOptions = {
  db: Database;
};

export function createContext(opts: CreateContextOptions): Context {
  return {
    db: opts.db,
  };
}
