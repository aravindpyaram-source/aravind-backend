import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

let pool;

try {
  pool = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT || 5432,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });
} catch (error) {
  console.warn('Database pool creation failed:', error.message);
  pool = null;
}

export { pool };

export async function testDB() {
  if (!pool) {
    throw new Error('Database pool not available');
  }
  
  try {
    const res = await pool.query('SELECT NOW()');
    return res.rows[0];
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}
