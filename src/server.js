import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

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
  res.json({ 
    message: 'Server is live',
    dbTime: { now: new Date().toISOString() }
  });
});

// Mock API endpoints that actually work
app.get('/api/leads', (req, res) => {
  res.json({ 
    success: true, 
    leads: [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+91-9876543210', message: 'Interested in CCTV installation' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+91-9876543211', message: 'Need networking setup' }
    ]
  });
});

app.post('/api/leads', (req, res) => {
  const { name, email, phone, message } = req.body;
  
  if (!name || !phone) {
    return res.status(400).json({ success: false, error: 'Name and phone required' });
  }
  
  res.json({ 
    success: true, 
    lead: { id: Date.now(), name, email, phone, message, created_at: new Date() }
  });
});

app.get('/api/services', (req, res) => {
  res.json({ 
    success: true, 
    services: [
      {
        id: 1,
        title: 'CCTV Surveillance',
        description: 'Professional CCTV installation and monitoring services for complete security coverage',
        price: 'Starting from ₹15,000',
        category: 'security'
      },
      {
        id: 2,
        title: 'Networking Solutions',
        description: 'Complete networking infrastructure setup and maintenance for homes and businesses',
        price: 'Starting from ₹8,000',
        category: 'networking'
      },
      {
        id: 3,
        title: 'EPABX Systems',
        description: 'Advanced communication systems for seamless office communication',
        price: 'Starting from ₹12,000',
        category: 'communication'
      },
      {
        id: 4,
        title: 'Biometric Access Control',
        description: 'Smart biometric solutions for enhanced security and attendance management',
        price: 'Starting from ₹10,000',
        category: 'security'
      }
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
    service: { id: Date.now(), title, description, price, category, created_at: new Date() }
  });
});

app.get('/api/contact', (req, res) => {
  res.json({ 
    success: true, 
    submissions: [
      { id: 1, name: 'Contact Form', message: 'Contact endpoint working', created_at: new Date() }
    ]
  });
});

app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ 
      success: false, 
      error: 'Name, email, and message are required' 
    });
  }
  
  res.json({ 
    success: true, 
    message: 'Contact form submitted successfully!',
    submission: { id: Date.now(), name, email, subject, message, created_at: new Date() }
  });
});

app.get('/api/faq', (req, res) => {
  res.json({ 
    success: true, 
    faqs: [
      {
        id: 1,
        question: 'What services do you provide?',
        answer: 'We provide CCTV installation, networking solutions, EPABX systems, and biometric access control systems for homes and businesses.',
        category: 'services'
      },
      {
        id: 2,
        question: 'Do you offer maintenance services?',
        answer: 'Yes, we provide comprehensive maintenance and 24/7 support for all our installations including regular check-ups and emergency repairs.',
        category: 'support'
      },
      {
        id: 3,
        question: 'What areas do you serve?',
        answer: 'We serve across Hyderabad and surrounding areas. Contact us to confirm service availability in your location.',
        category: 'coverage'
      },
      {
        id: 4,
        question: 'How long does installation take?',
        answer: 'Installation time varies by project size. Typical CCTV systems take 1-2 days, while comprehensive networking solutions may take 3-5 days.',
        category: 'installation'
      },
      {
        id: 5,
        question: 'Do you provide warranty?',
        answer: 'Yes, we provide 1-year warranty on all installations and 6 months warranty on service calls.',
        category: 'warranty'
      }
    ]
  });
});

app.post('/api/faq', (req, res) => {
  const { question, answer, category } = req.body;
  
  if (!question || !answer) {
    return res.status(400).json({ 
      success: false, 
      error: 'Question and answer are required' 
    });
  }
  
  res.json({ 
    success: true, 
    faq: { id: Date.now(), question, answer, category: category || 'general', created_at: new Date() }
  });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on ${PORT}`);
  console.log('All API endpoints ready with mock data');
});
