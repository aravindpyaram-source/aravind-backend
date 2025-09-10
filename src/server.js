import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { pool } from './db.js';  // PostgreSQL pool configured in db.js

dotenv.config();

const app = express();

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://aravindpyaram-source.github.io'
  ],
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: false
};

app.use(cors(corsOptions));
app.use(express.json());

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Server is live', timestamp: new Date().toISOString() });
});

// GET leads (from database)
app.get('/api/leads', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM leads ORDER BY created_at DESC');
    res.json({ success: true, leads: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch leads' });
  }
});

// POST lead
app.post('/api/leads', async (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name || !phone) return res.status(400).json({ success: false, error: 'Name and phone are required' });
  try {
    const { rows } = await pool.query(
      'INSERT INTO leads(name,email,phone,message) VALUES($1,$2,$3,$4) RETURNING *',
      [name,email,phone,message]
    );
    res.json({ success: true, lead: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to save lead' });
  }
});

// GET services
app.get('/api/services', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM services ORDER BY id');
    res.json({ success: true, services: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch services' });
  }
});

// POST service
app.post('/api/services', async (req, res) => {
  const { title, description, price, category } = req.body;
  if (!title || !description) return res.status(400).json({ success: false, error: 'Title and description required' });
  try {
    const { rows } = await pool.query(
      'INSERT INTO services(title,description,price,category) VALUES($1,$2,$3,$4) RETURNING *',
      [title,description,price,category]
    );
    res.json({ success: true, service: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to save service' });
  }
});

// GET FAQs
app.get('/api/faq', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM faqs ORDER BY id');
    res.json({ success: true, faqs: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch FAQs' });
  }
});

// POST FAQ
app.post('/api/faq', async (req, res) => {
  const { question, answer, category } = req.body;
  if (!question || !answer) return res.status(400).json({ success: false, error: 'Question and answer required' });
  try {
    const { rows } = await pool.query(
      'INSERT INTO faqs(question,answer,category) VALUES($1,$2,$3) RETURNING *',
      [question,answer,category||'general']
    );
    res.json({ success: true, faq: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to save FAQ' });
  }
});

// POST contact form
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ success: false, error: 'Name, email, and message required' });
  try {
    // save to DB
    await pool.query(
      'INSERT INTO contacts(name,email,subject,message) VALUES($1,$2,$3,$4)',
      [name,email,subject,message]
    );
    // send notification email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.NOTIFY_EMAIL,
      subject: `New Contact Inquiry: ${subject || 'General'}`,
      html: `<h3>New Inquiry</h3>
             <p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Subject:</strong> ${subject || '(none)'}</p>
             <p><strong>Message:</strong><br/>${message}</p>`
    });
    res.json({ success: true, message: 'Contact form submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to process contact form' });
  }
});

// POST appointment
app.post('/api/appointments', async (req, res) => {
  const { service, date, time, name, email, phone, address, message } = req.body;
  if (!service||!date||!time||!name||!email||!phone)
    return res.status(400).json({ success: false, error: 'Required fields missing' });
  try {
    await pool.query(
      'INSERT INTO appointments(service, date, time, name, email, phone, address, message) VALUES($1,$2,$3,$4,$5,$6,$7,$8)',
      [service,date,time,name,email,phone,address,message]
    );
    // notify you
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.NOTIFY_EMAIL,
      subject: `New Appointment - ${name}`,
      html: `<h3>Appointment Details</h3>
             <p><strong>Service:</strong> ${service}</p>
             <p><strong>Date:</strong> ${date}</p>
             <p><strong>Time:</strong> ${time}</p>
             <p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Phone:</strong> ${phone}</p>
             <p><strong>Address:</strong> ${address||'N/A'}</p>
             <p><strong>Message:</strong> ${message||'None'}</p>`
    });
    // confirm to client
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Appointment Confirmed - Aravind & Co',
      html: `<h3>Your Appointment is Confirmed</h3>
             <p>Dear ${name},</p>
             <p>Your appointment for <strong>${service}</strong> on <strong>${date}</strong> at <strong>${time}</strong> is confirmed.</p>
             <p>Thanks,<br/>Aravind & Co Team</p>`
    });
    res.json({ success: true, message: 'Appointment booked successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to book appointment' });
  }
});

// POST newsletter subscription
app.post('/api/blog/subscribe', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, error: 'Email required' });
  try {
    await pool.query('INSERT INTO subscribers(email) VALUES($1)', [email]);
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Subscription Confirmed',
      html: `<p>Thank you for subscribing to our blog updates!</p>`
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.NOTIFY_EMAIL,
      subject: 'New Blog Subscriber',
      text: `New subscriber: ${email}`
    });
    res.json({ success: true, message: 'Subscribed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to subscribe' });
  }
});

const PORT = process.env.PORT||10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on ${PORT}`);
});
