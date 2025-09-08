import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pkg;

// Use DATABASE_URL if available (Render), otherwise local
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || undefined,
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT || 5432,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false, // SSL for Render
});

export const db = pool;

// Optional test function
export async function testDB() {
  const res = await pool.query('SELECT NOW()');
  return res.rows[0];
}
