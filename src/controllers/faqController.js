import { pool } from '../db.js';

export async function getFAQs(req, res) {
  try {
    const result = await pool.query('SELECT * FROM faqs ORDER BY display_order ASC, created_at ASC');
    res.json({ success: true, faqs: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
}

export async function createFAQ(req, res) {
  const { question, answer, category, display_order } = req.body;
  
  if (!question || !answer) {
    return res.status(400).json({ 
      success: false, 
      error: 'Question and answer are required' 
    });
  }

  try {
    const result = await pool.query(
      'INSERT INTO faqs (question, answer, category, display_order) VALUES ($1,$2,$3,$4) RETURNING *',
      [question, answer, category || 'general', display_order || 1]
    );
    res.json({ success: true, faq: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
}
