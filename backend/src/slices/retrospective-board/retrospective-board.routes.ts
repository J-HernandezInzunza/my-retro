import { Router } from 'express';
import {
  createRetroSession,
  getRetroFormats,
  createRetroItem,
  getRetroItemsForSession,
  getRetroSession,
} from './retrospective-board.controller';

const router = Router();

// Route to get all available retrospective formats
router.get('/formats', getRetroFormats);

// Route to create a new retrospective session
router.post('/session', createRetroSession);

// Route to get all items for a specific session
router.get('/session/:sessionId/items', getRetroItemsForSession);

// Route to get a single session by ID
router.get('/session/:sessionId', getRetroSession);

// Route to create a new retrospective item
router.post('/item', createRetroItem);

export default router;
