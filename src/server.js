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

// 📅 APPOINTMENTS - ENHANCED WITH STORAGE
app.post('/api/appointments', (req, res) => {
  console.log('📅 NEW APPOINTMENT:', req.body);
  const { service, date, time, name, email, phone, address, message } = req.body;

  if (!service || !date || !time || !name || !email || !phone) {
    return res.status(400).json({
      success: false,
      error: 'Required fields missing'
    });
  }

  // 💾 STORE APPOINTMENT
  const appointment = {
    id: Date.now().toString(),
    service, date, time, name, email, phone,
    address: address || '',
    message: message || '',
    status: 'pending',
    created_at: new Date().toISOString()
  };
  
  appointments.push(appointment);
  console.log(`✅ Stored! Total appointments: ${appointments.length}`);

  res.json({ 
    success: true, 
    message: 'Appointment booked successfully!',
    view_url: `http://localhost:${PORT}/admin/appointments`
  });
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
