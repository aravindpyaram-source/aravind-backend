import { pool } from '../db.js';

export async function getServices(req, res) {
  try {
    const result = await pool.query('SELECT * FROM services ORDER BY created_at DESC');
    res.json({ success: true, services: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
}

export async function createService(req, res) {
  const { title, description, price, category } = req.body;
  
  if (!title || !description) {
    return res.status(400).json({ success: false, error: 'Title and description required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO services (title, description, price, category) VALUES ($1,$2,$3,$4) RETURNING *',
      [title, description, price || null, category || 'general']
    );
    res.json({ success: true, service: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
}
