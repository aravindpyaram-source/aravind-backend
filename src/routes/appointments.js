import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

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
  const { service, date, time, name, email, phone, address, message } = req.body;
  if (!service || !date || !time || !name || !email || !phone) {
    return res.status(400).json({ success: false, error: 'Required fields missing' });
  }
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.NOTIFY_EMAIL,
      subject: `New Appointment - ${name}`,
      html: `
        <p><strong>Message:</strong> ${message || 'None'}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Address:</strong> ${address || 'N/A'}</p>
      `
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Appointment Confirmed - Aravind & Co',
      html: `
        <p>Dear ${name},</p>
        <p>Your appointment for <strong>${service}</strong> on <strong>${date}</strong> at <strong>${time}</strong> is confirmed.</p>
        <p>We will contact you 24 hours before to reconfirm.</p>
        <p>Thanks,<br/>Aravind & Co Team</p>
        <p>You will receive our latest blog updates and security tips directly in your inbox.</p>
      `
    });
    res.json({ success: true, message: 'Appointment booked successfully!' });
  } catch (error) {
    console.error('Appointment email error:', error);
    res.status(500).json({ success: false, error: 'Failed to send appointment email' });
  }
});

export default router;
