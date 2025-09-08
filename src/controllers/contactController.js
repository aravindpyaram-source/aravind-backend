import { pool } from '../db.js';

export async function submitContactForm(req, res) {
  const { name, email, subject, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ 
      success: false, 
      error: 'Name, email, and message are required' 
    });
  }

  try {
    const result = await pool.query(
      'INSERT INTO contact_submissions (name, email, subject, message) VALUES ($1,$2,$3,$4) RETURNING *',
      [name, email, subject || 'General Inquiry', message]
    );
    res.json({ success: true, submission: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
}

export async function getContactSubmissions(req, res) {
  try {
    const result = await pool.query('SELECT * FROM contact_submissions ORDER BY created_at DESC');
    res.json({ success: true, submissions: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
}
