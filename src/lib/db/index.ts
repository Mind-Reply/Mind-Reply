import { neon } from '@neondatabase/serverless';
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from './schema';

type Schema = typeof schema;

let _db: NeonHttpDatabase<Schema> | null = null;

function getDb(): NeonHttpDatabase<Schema> {
  if (_db) return _db;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');
  _db = drizzle(neon(url), { schema });
  return _db;
}

// Proxy so `db.select()` works without calling db() everywhere
export const db = new Proxy({} as NeonHttpDatabase<Schema>, {
  get(_target, prop) {
    return (getDb() as any)[prop];
  },
});

export * from './schema';
