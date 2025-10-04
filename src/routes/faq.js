import express from 'express';
import { getFAQs, createFAQ } from '../controllers/faqController.js';

const router = express.Router();

router.get('/', getFAQs);
router.post('/', createFAQ);

export default router;
import express from 'express';

const router = express.Router();

// Mock FAQ data
const mockFaqs = [
  {
    id: 1,
    question: 'What services do you provide?',
    answer: 'We provide CCTV installation, networking solutions, EPABX systems, and biometric access control.',
    category: 'services'
  },
  {
    id: 2,
    question: 'Do you offer maintenance services?',
    answer: 'Yes, we provide 24/7 support and maintenance for all installations.',
    category: 'support'
  },
  {
    id: 3,
    question: 'What areas do you serve?',
    answer: 'We serve Hyderabad and surrounding areas.',
    category: 'coverage'
  },
  {
    id: 4,
    question: 'How long does installation take?',
    answer: 'CCTV systems take 1-2 days; networking solutions take 3-5 days.',
    category: 'installation'
  },
  {
    id: 5,
    question: 'Do you provide warranty?',
    answer: '1 year warranty on installations; 6 months on service calls.',
    category: 'warranty'
  }
];

// GET all FAQs
router.get('/', (req, res) => {
  res.json({
    success: true,
    faqs: mockFaqs
  });
});

// POST new FAQ
router.post('/', (req, res) => {
  const { question, answer, category } = req.body;

  if (!question || !answer) {
    return res.status(400).json({
      success: false,
      error: 'Question and answer are required'
    });
  }

  const newFaq = {
    id: Date.now(),
    question,
    answer,
    category: category || 'general',
    created_at: new Date().toISOString()
  };

  mockFaqs.push(newFaq);

  res.json({
    success: true,
    faq: newFaq
  });
});

export default router;