import { Router } from 'express';

import { prisma } from '../../app/core/prisma';

const router = Router();

// Test endpoint to get all users
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

export default router;
