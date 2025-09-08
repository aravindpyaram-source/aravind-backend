import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import leadsRouter from './routes/leads.js';
import servicesRouter from './routes/services.js';
import contactRouter from './routes/contact.js';
import faqRouter from './routes/faq.js';
import { testDB } from './db.js';

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

app.get('/', (req, res) => res.json({ 
  app: 'Aravind & Co API',
  status: 'running',
  timestamp: new Date().toISOString()
}));

app.use('/api/leads', leadsRouter);
app.use('/api/services', servicesRouter);
app.use('/api/contact', contactRouter);
app.use('/api/faq', faqRouter);

const PORT = process.env.PORT || 10000;

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Server listening on ${PORT}`);
  try {
    const now = await testDB();
    console.log('DB connected:', now);
  } catch (err) {
    console.warn('DB connection failed:', err.message);
  }
});
