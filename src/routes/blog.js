import express from 'express';

const router = express.Router();

// Health check GET route
router.get('/subscribe', (req, res) => {
  res.json({ message: 'Blog subscribe route is alive' });
});

// Blog subscription POST route
router.post('/subscribe', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required' });
  }
  // TODO: Add subscriber logic here (e.g., save to DB or send confirmation email)
  res.json({ success: true, message: 'Subscribed successfully!' });
});

export default router;
