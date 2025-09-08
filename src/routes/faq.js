import express from 'express';
import { getFAQs, createFAQ } from '../controllers/faqController.js';

const router = express.Router();

router.get('/', getFAQs);
router.post('/', createFAQ);

export default router;
