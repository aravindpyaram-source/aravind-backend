import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Health check GET route
router.get('/subscribe', (req, res) => {
  res.json({
    message: 'Blog subscribe route is alive'
  });
});

// Blog subscription POST route
router.post('/subscribe', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      error: 'Email is required'
    });
  }

  try {
    // Send confirmation email to subscriber
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Subscription Confirmed - Aravind & Co Blog',
      html: `
        <h3>Thank You for Subscribing!</h3>
        <p>You will receive our latest blog updates and security tips directly in your inbox.</p>
        <p>Best regards,<br>Aravind & Co Team</p>
      `
    });

    // Notify admin about new subscriber
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.NOTIFY_EMAIL,
      subject: 'New Blog Subscriber',
      text: `New subscriber: ${email}`
    });

    res.json({
      success: true,
      message: 'Subscribed successfully!'
    });

  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to subscribe'
    });
  }
});

export default router;