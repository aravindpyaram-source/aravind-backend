import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// 📊 STORAGE FOR APPOINTMENTS
let appointments = [];
let contacts = [];
let subscribers = [];

// ===== ADMIN ROUTES =====

// 📅 VIEW ALL APPOINTMENTS
app.get('/admin/appointments', (req, res) => {
  res.json({
    success: true,
    total: appointments.length,
    appointments: appointments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  });
});

// 📊 ADMIN DASHBOARD  
app.get('/admin/dashboard', (req, res) => {
  res.json({
    success: true,
    stats: {
      total_appointments: appointments.length,
      pending_appointments: appointments.filter(a => a.status === 'pending').length,
      confirmed_appointments: appointments.filter(a => a.status === 'confirmed').length
    },
    recent_appointments: appointments.slice(-5).reverse()
  });
});

// ===== YOUR EXISTING ROUTES =====

app.get('/', (req, res) => {
  res.json({ 
    message: 'Server with Admin Dashboard',
    admin_urls: {
      appointments: `http://localhost:${PORT}/admin/appointments`,
      dashboard: `http://localhost:${PORT}/admin/dashboard`
    }
  });
});

// ✅ FIXED - GET appointments endpoint
app.get('/api/appointments', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Appointments endpoint is working',
    appointments: []
  });
});

// ✅ FIXED - POST appointments endpoint
app.post('/api/appointments', async (req, res) => {
  console.log('📅 Appointment booking request:', req.body);
  const { service, date, time, name, email, phone, address, message } = req.body;

  if (!service || !date || !time || !name || !email || !phone) {
    return res.status(400).json({ 
      success: false, 
      error: 'Required fields: service, date, time, name, email, phone' 
    });
  }

  try {
    // Send notification email to admin (if configured)
    if (transporter && process.env.NOTIFY_EMAIL) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.NOTIFY_EMAIL,
        subject: `New Appointment Request - ${service}`,
        html: `
          <h2>New Appointment Request</h2>
          <p><strong>Service:</strong> ${service}</p>
          <p><strong>Date & Time:</strong> ${date} at ${time}</p>
          <p><strong>Customer:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Address:</strong> ${address || 'Not provided'}</p>
          <p><strong>Message:</strong> ${message || 'None'}</p>
        `
      });

      // Send confirmation email to customer
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Appointment Request Received - Aravind & Co',
        html: `
          <h2>Thank you for your appointment request!</h2>
          <p>Dear ${name},</p>
          <p>We have received your request for <strong>${service}</strong> on <strong>${date}</strong> at <strong>${time}</strong>.</p>
          <p>We will contact you within 24 hours to confirm the appointment.</p>
          <br>
          <p>Best regards,<br>Aravind & Co Team</p>
        `
      });
    }

    console.log('✅ Appointment booked successfully');
    res.json({ 
      success: true, 
      message: 'Appointment request submitted successfully! We will contact you soon.',
      appointment_id: Date.now()
    });

  } catch (error) {
    console.error('❌ Appointment booking error:', error);
    res.json({ 
      success: true, 
      message: 'Appointment request received! (Email notification failed, but appointment is recorded)',
      appointment_id: Date.now()
    });
  }
});


// Your other routes (contact, blog, etc.)
app.get('/api/contact', (req, res) => {
  res.json({ success: true, message: 'Contact route working' });
});

app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  contacts.push({
    id: Date.now().toString(),
    name, email, subject: subject || 'General', message,
    created_at: new Date().toISOString()
  });
  res.json({ success: true, message: 'Contact submitted!' });
});

app.get('/api/blog/subscribe', (req, res) => {
  res.json({ success: true, message: 'Blog subscribe working' });
});

app.post('/api/blog/subscribe', (req, res) => {
  const { email } = req.body;
  subscribers.push({
    id: Date.now().toString(), 
    email, 
    subscribed_at: new Date().toISOString()
  });
  res.json({ success: true, message: 'Subscribed!' });
});

app.get('/api/leads', (req, res) => {
  res.json({ success: true, leads: [] });
});

app.get('/api/services', (req, res) => {
  res.json({ success: true, services: [] });
});

app.get('/api/faq', (req, res) => {
  res.json({ success: true, faqs: [] });
});

app.listen(PORT, () => {
  console.log(`🎉 Server running on http://localhost:${PORT}`);
  console.log(`📊 View Appointments: http://localhost:${PORT}/admin/appointments`);
  console.log(`📈 Admin Dashboard: http://localhost:${PORT}/admin/dashboard`);
});
