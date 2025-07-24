import { Router } from 'express';
import { upgradeSession, getCurrentUser, linkToExistingUser } from './user-management.controller';
import { requireSession } from '../../../app/session-validation.middleware';

const router = Router();

router.get('/me', requireSession, getCurrentUser);
router.post('/upgrade', requireSession, upgradeSession);
router.post('/link', requireSession, linkToExistingUser);

export default router;
