import express from 'express';
import cors from 'cors';
import { db, testDB } from './db.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Test route
app.get('/', async (req, res) => {
  try {
    const time = await testDB();
    res.json({ message: 'Server is live', dbTime: time });
  } catch (err) {
    res.status(500).json({ error: 'DB connection failed', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
