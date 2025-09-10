import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { submitContactForm, getContactSubmissions } from '../controllers/contactController.js';

dotenv.config();

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Name, email, and message are required' });
  }
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.NOTIFY_EMAIL,
      subject: `New Contact Inquiry: ${subject || 'General'}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Subject:</strong> ${subject || '(none)'}</p><p>${message}</p>`,
    });
    // Save to database
    await submitContactForm(req, res);
  } catch (error) {
    console.error('Contact email error:', error);
    res.status(500).json({ success: false, error: 'Failed to send inquiry' });
  }
});

router.get('/', getContactSubmissions);

export default router;
