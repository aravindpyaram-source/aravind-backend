import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

console.log('Server starting...');

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Server is working', timestamp: new Date() });
});

// Contact routes - BOTH GET and POST
app.get('/api/contact', (req, res) => {
  console.log('GET /api/contact called');
  res.json({ success: true, message: 'Contact GET route working' });
});

app.post('/api/contact', (req, res) => {
  console.log('POST /api/contact called with:', req.body);
  res.json({ success: true, message: 'Contact POST route working', data: req.body });
});

// Appointments routes - BOTH GET and POST  
app.get('/api/appointments', (req, res) => {
  console.log('GET /api/appointments called');
  res.json({ success: true, message: 'Appointments GET route working' });
});

app.post('/api/appointments', (req, res) => {
  console.log('POST /api/appointments called with:', req.body);
  res.json({ success: true, message: 'Appointments POST route working', data: req.body });
});

// Blog subscribe routes - BOTH GET and POST
app.get('/api/blog/subscribe', (req, res) => {
  console.log('GET /api/blog/subscribe called');
  res.json({ success: true, message: 'Blog subscribe GET route working' });
});

app.post('/api/blog/subscribe', (req, res) => {
  console.log('POST /api/blog/subscribe called with:', req.body);
  res.json({ success: true, message: 'Blog subscribe POST route working', data: req.body });
});

// Your existing working routes
app.get('/api/leads', (req, res) => {
  res.json({ success: true, leads: [] });
});

app.get('/api/services', (req, res) => {
  res.json({ success: true, services: [] });
});

app.get('/api/faq', (req, res) => {
  res.json({ success: true, faqs: [] });
});

// Catch all route to see what's being requested
app.use('*', (req, res) => {
  console.log(`Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: 'Route not found', 
    method: req.method, 
    path: req.originalUrl 
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log('Available routes:');
  console.log('  GET  /');
  console.log('  GET  /api/contact');
  console.log('  POST /api/contact'); 
  console.log('  GET  /api/appointments');
  console.log('  POST /api/appointments');
  console.log('  GET  /api/blog/subscribe');
  console.log('  POST /api/blog/subscribe');
  console.log('  GET  /api/leads');
  console.log('  GET  /api/services');
  console.log('  GET  /api/faq');
});
