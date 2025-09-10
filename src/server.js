import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://aravindpyaram-source.github.io' // Your frontend URL here
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
};

app.use(cors(corsOptions));
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Blog subscription endpoint
app.post('/api/blog/subscribe', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, error: 'Email is required' });

  try {
    // Send confirmation email to subscriber
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Subscription Confirmed - Aravind & Co Blog',
      html: `
        <h3>Thank You for Subscribing!</h3>
        <p>You will receive our latest blog updates and security tips directly in your inbox.</p>
        <p>Best regards,<br/>Aravind & Co Team</p>
      `
    });

    // Notify site owner about new subscriber
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.NOTIFY_EMAIL,
      subject: 'New Blog Subscriber',
      text: `New subscriber: ${email}`
    });

    res.json({ success: true, message: 'Subscribed successfully!' });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({ success: false, error: 'Failed to subscribe' });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on ${PORT}`);
});
