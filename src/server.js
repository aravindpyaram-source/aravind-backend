import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import leadsRouter from './routes/leads.js';
import { testDB } from './db.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ app: 'Aravind & Co API' }));
app.use('/api/leads', leadsRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server listening on ${PORT}`);
  try {
    const now = await testDB();
    console.log('DB connected:', now);
  } catch (err) {
    console.warn('DB connection failed:', err.message);
  }
});