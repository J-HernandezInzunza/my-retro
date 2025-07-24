import { Router } from 'express';
import { createTeam, joinTeam } from './team-management.controller';
import { requireSession } from '../../../app/session-validation.middleware';

const router = Router();

// POST /api/teams - Create a new team
router.post('/', requireSession, createTeam);

// POST /api/teams/join - Join a team with invite code
router.post('/join', requireSession, joinTeam);

export default router
