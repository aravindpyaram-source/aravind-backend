import express from 'express';

const router = express.Router();

// Mock leads data
const mockLeads = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91-9876543210',
    message: 'Interested in CCTV installation',
    created_at: '2025-09-10T10:30:00Z'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+91-9876543211',
    message: 'Need networking setup',
    created_at: '2025-09-09T14:15:00Z'
  },
  {
    id: 3,
    name: 'Raj Kumar',
    email: 'raj@example.com',
    phone: '+91-9876543212',
    message: 'Biometric system inquiry',
    created_at: '2025-09-08T09:45:00Z'
  }
];

// GET all leads
router.get('/', (req, res) => {
  res.json({
    success: true,
    leads: mockLeads
  });
});

// POST new lead
router.post('/', (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !phone) {
    return res.status(400).json({
      success: false,
      error: 'Name and phone are required'
    });
  }

  const newLead = {
    id: Date.now(),
    name,
    email,
    phone,
    message,
    created_at: new Date().toISOString()
  };

  mockLeads.push(newLead);

  res.json({
    success: true,
    lead: newLead
  });
});

export default router;