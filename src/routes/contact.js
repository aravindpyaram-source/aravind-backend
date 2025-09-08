import express from 'express';
import { submitContactForm, getContactSubmissions } from '../controllers/contactController.js';

const router = express.Router();

router.post('/', submitContactForm);
router.get('/', getContactSubmissions);

export default router;
