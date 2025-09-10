import express from 'express';

const router = express.Router();

router.post('/subscribe', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required' });
  }
  // TODO: Add subscriber logic, e.g., insert into DB or send confirmation email
  res.json({ success: true, message: 'Subscribed successfully!' });
});

export default router;
