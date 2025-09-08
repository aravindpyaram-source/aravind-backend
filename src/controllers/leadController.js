import { pool } from '../db.js';

export async function createLead(req, res) {
  const { name, email, phone, message } = req.body;
  
  if (!name || !phone) {
    return res.status(400).json({ success: false, error: 'Name and phone required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO leads (name, email, phone, message) VALUES ($1,$2,$3,$4) RETURNING *',
      [name, email || null, phone, message || null]
    );
    res.json({ success: true, lead: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'DB error' });
  }
}

export async function listLeads(req, res) {
  try {
    const result = await pool.query('SELECT * FROM leads ORDER BY created_at DESC');
    res.json({ success: true, leads: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'DB error' });
  }
}
