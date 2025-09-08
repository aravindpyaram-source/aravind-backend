import express from 'express';
import { createLead, listLeads } from '../controllers/leadController.js';
const router = express.Router();

router.post('/', createLead);
router.get('/', listLeads);

export default router;