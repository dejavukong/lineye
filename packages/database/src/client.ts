import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';

import * as schema from './schema';

export function createDatabase(filename: string) {
  const sqlite = new Database(filename);

  return drizzle(sqlite, { schema });
}

export type Database = ReturnType<typeof createDatabase>;
