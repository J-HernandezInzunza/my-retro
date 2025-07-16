import { Router } from 'express';
import { createUser, getUsers } from './user-management.controller';

const router = Router();

// Route to get all users for a specific team
router.get('/', getUsers);

// Route to create a new user
router.post('/', createUser);

export default router;
