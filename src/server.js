import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import contactRouter from './routes/contact.js';
import appointmentsRouter from './routes/appointments.js';
import blogRouter from './routes/blog.js';

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

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Server is live', timestamp: new Date().toISOString() });
});

// Mock leads endpoints (unchanged)
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
  res.json({ success: true, lead: { id: Date.now(), name, email, phone, message, created_at: new Date().toISOString() } });
});

// Mock services endpoints (unchanged)
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
  res.json({ success: true, service: { id: Date.now(), title, description, price, category, created_at: new Date().toISOString() } });
});

// Mock FAQ endpoints (unchanged)
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
  res.json({ success: true, faq: { id: Date.now(), question, answer, category: category || 'general', created_at: new Date().toISOString() } });
});

// Use routers for modular routes
app.use('/api/contact', contactRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/blog', blogRouter);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
