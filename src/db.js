import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

// Use connection string if individual vars don't work
const connectionString = process.env.DATABASE_URL || 
  `postgresql://aravind_db_user:yN0K0dPA1VxXZhhqaNdcSykUfHrJauMy@dpg-d2vcfpp5pdvs73b9il8g-a.oregon-postgres.render.com/aravind_db;

export const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export async function testDB() {
  try {
    const res = await pool.query('SELECT NOW()');
    return res.rows[0];
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}
