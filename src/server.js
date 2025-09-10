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
    'https://aravindpyaram-source.github.io'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
};

app.use(cors(corsOptions));
app.use(express.json());

// Configure Nodemailer for email notifications
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Server is live',
    timestamp: new Date().toISOString()
  });
});

// Mock leads endpoints
app.get('/api/leads', (req, res) => {
  res.json({
    success: true,
    leads: [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+91-9876543210', message: 'Interested in CCTV installation', created_at: '2025-09-10T10:30:00Z' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+91-9876543211', message: 'Need networking setup', created_at: '2025-09-09T14:15:00Z' },
      { id: 3, name: 'Raj Kumar', email: 'raj@example.com', phone: '+91-9876543212', message: 'Biometric system inquiry', created_at: '2025-09-08T09:45:00Z' }
    ]
  });
});

app.post('/api/leads', (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ success: false, error: 'Name and phone are required' });
  }
  res.json({
    success: true,
    lead: { id: Date.now(), name, email, phone, message, created_at: new Date().toISOString() }
  });
});

// Mock services endpoints
app.get('/api/services', (req, res) => {
  res.json({
    success: true,
    services: [
      { id: 1, title: 'CCTV Surveillance', description: 'Professional CCTV installation and monitoring services', price: 'Starting from ₹15,000', category: 'security' },
      { id: 2, title: 'Networking Solutions', description: 'Complete networking infrastructure setup and maintenance', price: 'Starting from ₹8,000', category: 'networking' },
      { id: 3, title: 'EPABX Systems', description: 'Advanced office communication systems', price: 'Starting from ₹12,000', category: 'communication' },
      { id: 4, title: 'Biometric Access Control', description: 'Smart biometric solutions for security and attendance', price: 'Starting from ₹10,000', category: 'security' }
    ]
  });
});

app.post('/api/services', (req, res) => {
  const { title, description, price, category } = req.body;
  if (!title || !description) {
    return res.status(400).json({ success: false, error: 'Title and description required' });
  }
  res.json({
    success: true,
    service: { id: Date.now(), title, description, price, category, created_at: new Date().toISOString() }
  });
});

// Mock FAQ endpoints
app.get('/api/faq', (req, res) => {
  res.json({
    success: true,
    faqs: [
      { id: 1, question: 'What services do you provide?', answer: 'We provide CCTV installation, networking solutions, EPABX systems, and biometric access control.', category: 'services' },
      { id: 2, question: 'Do you offer maintenance services?', answer: 'Yes, we provide 24/7 support and maintenance for all installations.', category: 'support' },
      { id: 3, question: 'What areas do you serve?', answer: 'We serve Hyderabad and surrounding areas.', category: 'coverage' },
      { id: 4, question: 'How long does installation take?', answer: 'CCTV systems take 1-2 days; networking solutions take 3-5 days.', category: 'installation' },
      { id: 5, question: 'Do you provide warranty?', answer: '1 year warranty on installations; 6 months on service calls.', category: 'warranty' }
    ]
  });
});

app.post('/api/faq', (req, res) => {
  const { question, answer, category } = req.body;
  if (!question || !answer) {
    return res.status(400).json({ success: false, error: 'Question and answer are required' });
  }
  res.json({
    success: true,
    faq: { id: Date.now(), question, answer, category: category || 'general', created_at: new Date().toISOString() }
  });
});

// Contact form with email (real functionality)
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Name, email, and message are required' });
  }
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.NOTIFY_EMAIL,
      subject: `New Contact Inquiry: ${subject || 'General'}`,
      html: `
        <h3>New Inquiry</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || '(none)'}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `
    });
    res.json({ success: true, message: 'Contact form submitted successfully!' });
  } catch (error) {
    console.error('Contact email error:', error);
    res.status(500).json({ success: false, error: 'Failed to send inquiry' });
  }
});

// Appointment booking with email (real functionality)
app.post('/api/appointments', async (req, res) => {
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
        <h3>Appointment Details</h3>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Address:</strong> ${address || 'N/A'}</p>
        <p><strong>Message:</strong> ${message || 'None'}</p>
      `
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Appointment Confirmed - Aravind & Co',
      html: `
        <h3>Your Appointment is Confirmed</h3>
        <p>Dear ${name},</p>
        <p>Your appointment for <strong>${service}</strong> on <strong>${date}</strong> at <strong>${time}</strong> is confirmed.</p>
        <p>We will contact you 24 hours before to reconfirm.</p>
        <p>Thanks,<br/>Aravind & Co Team</p>
      `
    });
    res.json({ success: true, message: 'Appointment booked successfully!' });
  } catch (error) {
    console.error('Appointment error:', error);
    res.status(500).json({ success: false, error: 'Failed to book appointment' });
  }
});

// Newsletter subscription with email (real functionality)
app.post('/api/blog/subscribe', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required' });
  }
  try {
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
  console.log('Running with mock APIs - no database required');
});
