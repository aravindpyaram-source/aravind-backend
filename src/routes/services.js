import express from 'express';

const router = express.Router();

// Mock services data
const mockServices = [
  {
    id: 1,
    title: 'CCTV Surveillance',
    description: 'Professional CCTV installation and monitoring services',
    price: 'Starting from ₹15,000',
    category: 'security'
  },
  {
    id: 2,
    title: 'Networking Solutions',
    description: 'Complete networking infrastructure setup and maintenance',
    price: 'Starting from ₹8,000',
    category: 'networking'
  },
  {
    id: 3,
    title: 'EPABX Systems',
    description: 'Advanced office communication systems',
    price: 'Starting from ₹12,000',
    category: 'communication'
  },
  {
    id: 4,
    title: 'Biometric Access Control',
    description: 'Smart biometric solutions for security and attendance',
    price: 'Starting from ₹10,000',
    category: 'security'
  }
];

// GET all services
router.get('/', (req, res) => {
  res.json({
    success: true,
    services: mockServices
  });
});

// POST new service
router.post('/', (req, res) => {
  const { title, description, price, category } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      success: false,
      error: 'Title and description required'
    });
  }

  const newService = {
    id: Date.now(),
    title,
    description,
    price,
    category,
    created_at: new Date().toISOString()
  };

  mockServices.push(newService);

  res.json({
    success: true,
    service: newService
  });
});

export default router;