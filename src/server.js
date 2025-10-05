import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 10000;

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://aravindpyaram-source.github.io',
    'https://ppl-ai-code-interpreter-files.s3.amazonaws.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
};

app.use(cors(corsOptions));
app.use(express.json());

// 📊 DATA STORAGE (In-memory - will persist until server restart)
let appointments = [];
let contacts = [];
let subscribers = [];

console.log('🚀 Starting Aravind & Co Backend with Complete Admin Dashboard...');

// Configure Nodemailer for email notifications
let transporter = null;
try {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    console.log('📧 Email service configured');
  } else {
    console.log('📧 Email service not configured (missing credentials)');
  }
} catch (error) {
  console.log('📧 Email service error:', error.message);
}

// ===== ADMIN DASHBOARD ROUTES =====

// 📊 MAIN ADMIN DASHBOARD
app.get('/admin/dashboard', (req, res) => {
  const stats = {
    total_appointments: appointments.length,
    pending_appointments: appointments.filter(a => a.status === 'pending').length,
    confirmed_appointments: appointments.filter(a => a.status === 'confirmed').length,
    completed_appointments: appointments.filter(a => a.status === 'completed').length,
    cancelled_appointments: appointments.filter(a => a.status === 'cancelled').length,
    total_contacts: contacts.length,
    total_subscribers: subscribers.length,
    active_subscribers: subscribers.filter(s => s.active).length
  };

  const recent_appointments = appointments
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 10);

  const recent_contacts = contacts
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  console.log('📊 Admin dashboard accessed');
  res.json({
    success: true,
    stats: stats,
    recent_appointments: recent_appointments,
    recent_contacts: recent_contacts,
    server_info: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    }
  });
});

// 📅 VIEW ALL APPOINTMENTS
app.get('/admin/appointments', (req, res) => {
  const sortedAppointments = appointments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  console.log(`📅 Admin viewing ${appointments.length} appointments`);
  res.json({
    success: true,
    total: appointments.length,
    appointments: sortedAppointments
  });
});

// 📅 UPDATE APPOINTMENT STATUS
app.put('/admin/appointments/:id/status', (req, res) => {
  const { status } = req.body;
  const appointmentIndex = appointments.findIndex(a => a.id === req.params.id);

  if (appointmentIndex === -1) {
    return res.status(404).json({ success: false, error: 'Appointment not found' });
  }

  const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid status. Must be: pending, confirmed, completed, or cancelled' 
    });
  }

  appointments[appointmentIndex].status = status;
  appointments[appointmentIndex].updated_at = new Date().toISOString();

  console.log(`📅 Appointment ${req.params.id} status updated to ${status}`);
  res.json({ 
    success: true, 
    message: `Appointment status updated to ${status}`,
    appointment: appointments[appointmentIndex]
  });
});

// 📞 VIEW ALL CONTACTS
app.get('/admin/contacts', (req, res) => {
  const sortedContacts = contacts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  console.log(`📞 Admin viewing ${contacts.length} contacts`);
  res.json({
    success: true,
    total: contacts.length,
    contacts: sortedContacts
  });
});

// 📧 VIEW ALL SUBSCRIBERS
app.get('/admin/subscribers', (req, res) => {
  const sortedSubscribers = subscribers.sort((a, b) => new Date(b.subscribed_at) - new Date(a.subscribed_at));

  console.log(`📧 Admin viewing ${subscribers.length} subscribers`);
  res.json({
    success: true,
    total: subscribers.length,
    active: subscribers.filter(s => s.active).length,
    subscribers: sortedSubscribers
  });
});

// 📊 EXPORT APPOINTMENTS TO CSV
app.get('/admin/export/appointments', (req, res) => {
  const csvHeader = 'ID,Service,Date,Time,Name,Email,Phone,Address,Message,Status,Created At';
  const csvRows = appointments.map(a => 
    `"${a.id}","${a.service}","${a.date}","${a.time}","${a.name}","${a.email}","${a.phone}","${a.address || ''}","${(a.message || '').replace(/"/g, '""')}","${a.status}","${a.created_at}"`
  );
  const csv = [csvHeader, ...csvRows].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="appointments.csv"');
  res.send(csv);

  console.log('📊 Appointments exported to CSV');
});

// 📊 EXPORT CONTACTS TO CSV
app.get('/admin/export/contacts', (req, res) => {
  const csvHeader = 'ID,Name,Email,Subject,Message,Created At';
  const csvRows = contacts.map(c => 
    `"${c.id}","${c.name}","${c.email}","${c.subject}","${(c.message || '').replace(/"/g, '""')}","${c.created_at}"`
  );
  const csv = [csvHeader, ...csvRows].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="contacts.csv"');
  res.send(csv);

  console.log('📊 Contacts exported to CSV');
});

// ===== PUBLIC API ROUTES =====

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Aravind & Co Backend Server with Complete Admin Dashboard',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    admin_urls: {
      dashboard: `https://aravind-backend.onrender.com/admin/dashboard`,
      appointments: `https://aravind-backend.onrender.com/admin/appointments`,
      contacts: `https://aravind-backend.onrender.com/admin/contacts`,
      subscribers: `https://aravind-backend.onrender.com/admin/subscribers`
    },
    stats: {
      appointments: appointments.length,
      contacts: contacts.length,
      subscribers: subscribers.length
    }
  });
});

// 📅 APPOINTMENTS API (COMPLETE WITH STORAGE)
app.get('/api/appointments', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Appointments API is working',
    total: appointments.length,
    recent_appointments: appointments.slice(-5).reverse()
  });
});

app.post('/api/appointments', async (req, res) => {
  console.log('📅 NEW APPOINTMENT RECEIVED:', req.body);
  const { service, date, time, name, email, phone, address, message } = req.body;

  // Validation
  if (!service || !date || !time || !name || !email || !phone) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: service, date, time, name, email, phone'
    });
  }

  // 💾 CREATE AND STORE APPOINTMENT
  const appointment = {
    id: Date.now().toString(),
    service,
    date,
    time,
    name,
    email,
    phone,
    address: address || '',
    message: message || '',
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // Store in memory
  appointments.push(appointment);

  console.log(`✅ APPOINTMENT STORED! ID: ${appointment.id}`);
  console.log(`📊 Total appointments: ${appointments.length}`);

  // Send email notifications
  let emailStatus = 'not_configured';
  try {
    if (transporter && process.env.NOTIFY_EMAIL) {
      // Notify admin
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.NOTIFY_EMAIL,
        subject: `🔔 New Appointment Request - ${service}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">New Appointment Request</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Service:</td><td style="padding: 10px; border: 1px solid #ddd;">${service}</td></tr>
              <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Date & Time:</td><td style="padding: 10px; border: 1px solid #ddd;">${date} at ${time}</td></tr>
              <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Customer:</td><td style="padding: 10px; border: 1px solid #ddd;">${name}</td></tr>
              <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email:</td><td style="padding: 10px; border: 1px solid #ddd;">${email}</td></tr>
              <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Phone:</td><td style="padding: 10px; border: 1px solid #ddd;">${phone}</td></tr>
              <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Address:</td><td style="padding: 10px; border: 1px solid #ddd;">${address || 'Not provided'}</td></tr>
              <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Message:</td><td style="padding: 10px; border: 1px solid #ddd;">${message || 'None'}</td></tr>
            </table>
            <p style="margin-top: 20px; color: #666;">
              <strong>Appointment ID:</strong> ${appointment.id}<br>
              <strong>View Admin Dashboard:</strong> <a href="https://aravind-backend.onrender.com/admin/dashboard">Admin Dashboard</a>
            </p>
          </div>
        `
      });

      // Send confirmation to customer
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: '✅ Appointment Request Received - Aravind & Co',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #16a34a;">Thank you for your appointment request!</h2>
            <p>Dear ${name},</p>
            <p>We have successfully received your appointment request for <strong>${service}</strong> on <strong>${date}</strong> at <strong>${time}</strong>.</p>

            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Appointment Details:</h3>
              <p><strong>Service:</strong> ${service}</p>
              <p><strong>Date:</strong> ${date}</p>
              <p><strong>Time:</strong> ${time}</p>
              <p><strong>Reference ID:</strong> ${appointment.id}</p>
            </div>

            <p><strong>What's Next?</strong></p>
            <ul>
              <li>Our team will contact you within <strong>24 hours</strong> to confirm the appointment</li>
              <li>We'll discuss any specific requirements you may have</li>
              <li>A final confirmation will be sent before the scheduled date</li>
            </ul>

            <p>If you have any questions or need to make changes, please contact us at <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a> or call us directly.</p>

            <hr style="margin: 30px 0; border: none; height: 1px; background: #e5e7eb;">
            <p style="color: #666; font-size: 14px;">
              Best regards,<br>
              <strong>Aravind & Co Team</strong><br>
              Professional CCTV & Networking Solutions
            </p>
          </div>
        `
      });

      emailStatus = 'sent';
      console.log('📧 Email notifications sent successfully');
    }
  } catch (error) {
    console.error('❌ Email sending error:', error);
    emailStatus = 'failed';
  }

  res.json({ 
    success: true, 
    message: 'Appointment booked successfully! We will contact you within 24 hours to confirm.',
    appointment: {
      id: appointment.id,
      service: appointment.service,
      date: appointment.date,
      time: appointment.time,
      status: appointment.status
    },
    email_status: emailStatus,
    admin_url: `https://aravind-backend.onrender.com/admin/appointments`
  });
});

// 📞 CONTACT API (COMPLETE WITH STORAGE)
app.get('/api/contact', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Contact API is working',
    total: contacts.length
  });
});

app.post('/api/contact', async (req, res) => {
  console.log('📞 NEW CONTACT RECEIVED:', req.body);
  const { name, email, subject, message } = req.body;

  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: name, email, message'
    });
  }

  // 💾 CREATE AND STORE CONTACT
  const contact = {
    id: Date.now().toString(),
    name,
    email,
    subject: subject || 'General Inquiry',
    message,
    created_at: new Date().toISOString()
  };

  // Store in memory
  contacts.push(contact);

  console.log(`✅ CONTACT STORED! ID: ${contact.id}`);
  console.log(`📊 Total contacts: ${contacts.length}`);

  // Send email notifications
  let emailStatus = 'not_configured';
  try {
    if (transporter && process.env.NOTIFY_EMAIL) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.NOTIFY_EMAIL,
        subject: `📧 New Contact Message: ${subject || 'General Inquiry'}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">New Contact Message</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Name:</td><td style="padding: 10px; border: 1px solid #ddd;">${name}</td></tr>
              <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email:</td><td style="padding: 10px; border: 1px solid #ddd;">${email}</td></tr>
              <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Subject:</td><td style="padding: 10px; border: 1px solid #ddd;">${subject || 'General Inquiry'}</td></tr>
              <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Message:</td><td style="padding: 10px; border: 1px solid #ddd;">${message}</td></tr>
            </table>
            <p style="margin-top: 20px; color: #666;">
              <strong>Contact ID:</strong> ${contact.id}<br>
              <strong>Received:</strong> ${new Date().toLocaleString()}
            </p>
          </div>
        `
      });

      emailStatus = 'sent';
      console.log('📧 Contact notification email sent');
    }
  } catch (error) {
    console.error('❌ Contact email error:', error);
    emailStatus = 'failed';
  }

  res.json({ 
    success: true, 
    message: 'Thank you for your message! We will get back to you soon.',
    contact_id: contact.id,
    email_status: emailStatus
  });
});

// 📧 BLOG SUBSCRIPTION API (COMPLETE WITH STORAGE)
app.get('/api/blog/subscribe', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Blog subscription API is working',
    total: subscribers.length,
    active: subscribers.filter(s => s.active).length
  });
});

app.post('/api/blog/subscribe', async (req, res) => {
  console.log('📧 NEW BLOG SUBSCRIBER:', req.body);
  const { email } = req.body;

  // Validation
  if (!email) {
    return res.status(400).json({
      success: false,
      error: 'Email is required'
    });
  }

  // Check if already subscribed
  const existingSubscriber = subscribers.find(s => s.email === email);
  if (existingSubscriber) {
    console.log(`📧 Email ${email} already subscribed`);
    return res.json({ 
      success: true, 
      message: 'You are already subscribed to our blog updates!' 
    });
  }

  // 💾 CREATE AND STORE SUBSCRIBER
  const subscriber = {
    id: Date.now().toString(),
    email,
    subscribed_at: new Date().toISOString(),
    active: true
  };

  // Store in memory
  subscribers.push(subscriber);

  console.log(`✅ BLOG SUBSCRIBER STORED! Email: ${email}`);
  console.log(`📊 Total subscribers: ${subscribers.length}`);

  // Send welcome email
  let emailStatus = 'not_configured';
  try {
    if (transporter) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: '🎉 Welcome to Aravind & Co Blog!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #16a34a;">Welcome to our blog!</h2>
            <p>Thank you for subscribing to Aravind & Co updates!</p>
            <p>You'll receive:</p>
            <ul>
              <li>Latest industry insights and tips</li>
              <li>New service announcements</li>
              <li>Special offers and promotions</li>
              <li>Technical guides and tutorials</li>
            </ul>
            <p>Stay tuned for valuable content!</p>
            <hr style="margin: 30px 0;">
            <p style="color: #666; font-size: 14px;">
              Best regards,<br>
              <strong>Aravind & Co Team</strong>
            </p>
          </div>
        `
      });

      emailStatus = 'sent';
      console.log('📧 Welcome email sent to subscriber');
    }
  } catch (error) {
    console.error('❌ Subscriber email error:', error);
    emailStatus = 'failed';
  }

  res.json({ 
    success: true, 
    message: 'Successfully subscribed! Thank you for joining our blog.',
    subscriber_id: subscriber.id,
    email_status: emailStatus
  });
});

// 📊 LEADS API (Enhanced with stored data)
app.get('/api/leads', (req, res) => {
  const leads = appointments.map(a => ({
    id: a.id,
    name: a.name,
    email: a.email,
    phone: a.phone,
    service: a.service,
    status: a.status,
    source: 'appointment',
    created_at: a.created_at
  })).concat(
    contacts.map(c => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: 'N/A',
      service: c.subject,
      status: 'inquiry',
      source: 'contact',
      created_at: c.created_at
    }))
  ).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  console.log(`📊 Leads API accessed - returning ${leads.length} leads`);
  res.json({
    success: true,
    total: leads.length,
    leads: leads
  });
});

// 🛠️ SERVICES API (Enhanced)
app.get('/api/services', (req, res) => {
  res.json({ 
    success: true, 
    services: [
      { 
        id: 1, 
        name: 'CCTV Installation', 
        price: 'Starting ₹15,000', 
        category: 'Security', 
        popular: true,
        description: 'Professional CCTV camera installation and setup'
      },
      { 
        id: 2, 
        name: 'Networking Setup', 
        price: 'Starting ₹8,000', 
        category: 'Networking', 
        popular: true,
        description: 'Complete network infrastructure setup and configuration'
      },
      { 
        id: 3, 
        name: 'EPABX Systems', 
        price: 'Starting ₹12,000', 
        category: 'Communication', 
        popular: false,
        description: 'Digital telephone exchange systems for businesses'
      },
      { 
        id: 4, 
        name: 'Biometric Systems', 
        price: 'Starting ₹10,000', 
        category: 'Security', 
        popular: true,
        description: 'Fingerprint and facial recognition access control'
      },
      { 
        id: 5, 
        name: 'Intercom Systems', 
        price: 'Starting ₹6,000', 
        category: 'Communication', 
        popular: false,
        description: 'Audio and video intercom solutions'
      },
      { 
        id: 6, 
        name: 'Fire Alarm Systems', 
        price: 'Starting ₹20,000', 
        category: 'Safety', 
        popular: false,
        description: 'Comprehensive fire detection and alarm systems'
      }
    ] 
  });
});

// ❓ FAQ API (Enhanced)
app.get('/api/faq', (req, res) => {
  res.json({ 
    success: true, 
    faqs: [
      { 
        id: 1, 
        question: 'What services do you provide?', 
        answer: 'We provide CCTV installation, networking solutions, EPABX systems, biometric access control, intercom systems, and fire alarm installations.',
        category: 'Services'
      },
      { 
        id: 2, 
        question: 'Do you offer maintenance and support?', 
        answer: 'Yes, we provide 24/7 support and maintenance services for all our installations with regular health checks and quick response times.',
        category: 'Support'
      },
      { 
        id: 3, 
        question: 'What areas do you serve?', 
        answer: 'We serve Hyderabad and surrounding areas within a 50km radius. We also provide remote support for existing installations.',
        category: 'Coverage'
      },
      { 
        id: 4, 
        question: 'How long does installation take?', 
        answer: 'CCTV installations typically take 1-2 days, networking setups take 2-3 days, and larger projects may take up to a week depending on complexity.',
        category: 'Installation'
      },
      { 
        id: 5, 
        question: 'Do you provide warranty?', 
        answer: 'Yes, we provide 1 year comprehensive warranty on all installations and 6 months warranty on service calls and repairs.',
        category: 'Warranty'
      },
      {
        id: 6,
        question: 'What are your payment terms?',
        answer: 'We accept cash, bank transfer, and digital payments. Typically 50% advance and 50% on completion. EMI options available for large projects.',
        category: 'Payment'
      },
      {
        id: 7,
        question: 'Do you provide free consultation?',
        answer: 'Yes, we provide free on-site consultation and quotation. Our experts will assess your requirements and suggest the best solutions.',
        category: 'Consultation'
      }
    ] 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// 404 handler for unmatched routes
app.use('*', (req, res) => {
  console.log(`❓ Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    available_endpoints: [
      'GET /',
      'GET /admin/dashboard',
      'GET /admin/appointments',
      'GET /admin/contacts',
      'GET /admin/subscribers',
      'POST /api/appointments',
      'POST /api/contact',
      'POST /api/blog/subscribe',
      'GET /api/leads',
      'GET /api/services',
      'GET /api/faq'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('🎉 ================================');
  console.log('🚀 ARAVIND & CO BACKEND SERVER');
  console.log('🎉 ================================');
  console.log('');
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
  console.log(`🌍 Production URL: https://aravind-backend.onrender.com`);
  console.log('');
  console.log('📊 ADMIN DASHBOARD URLS:');
  console.log(`   📈 Main Dashboard: /admin/dashboard`);
  console.log(`   📅 Appointments: /admin/appointments`);
  console.log(`   📞 Contacts: /admin/contacts`);
  console.log(`   📧 Subscribers: /admin/subscribers`);
  console.log(`   📄 Export Appointments: /admin/export/appointments`);
  console.log(`   📄 Export Contacts: /admin/export/contacts`);
  console.log('');
  console.log('🔧 PUBLIC API ENDPOINTS:');
  console.log(`   POST /api/appointments - Book appointment`);
  console.log(`   POST /api/contact - Submit contact form`);
  console.log(`   POST /api/blog/subscribe - Subscribe to blog`);
  console.log(`   GET /api/leads - View all leads`);
  console.log(`   GET /api/services - View services`);
  console.log(`   GET /api/faq - View FAQs`);
  console.log('');
  console.log('📊 Current Data:');
  console.log(`   Appointments: ${appointments.length}`);
  console.log(`   Contacts: ${contacts.length}`);
  console.log(`   Subscribers: ${subscribers.length}`);
  console.log('');
  console.log('✅ Server ready for business!');
  console.log('🎯 Visit the admin dashboard to manage your business');
  console.log('🌐 Online Dashboard: https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/95f191754a466ea5589f166ad11ac5ed/bc91f9e7-36f7-4471-97f7-84264e59fbb0/index.html');
  console.log('');
});
