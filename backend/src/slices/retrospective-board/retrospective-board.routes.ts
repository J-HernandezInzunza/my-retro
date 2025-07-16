import { Router } from 'express';
import {
  createRetroSession,
  getRetroFormats,
  createRetroItem,
  getRetroItemsForSession,
  getRetroSession,
} from './retrospective-board.controller';

const router = Router();

/**
 * @openapi
 * /api/retrospective/formats:
 *   get:
 *     tags:
 *       - Retrospective Board
 *     summary: Retrieve all available retrospective formats
 *     responses:
 *       200:
 *         description: A list of retrospective formats.
 */
router.get('/formats', getRetroFormats);

/**
 * @openapi
 * /api/retrospective/session:
 *   post:
 *     tags:
 *       - Retrospective Board
 *     summary: Create a new retrospective session
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [teamId, formatId]
 *             properties:
 *               teamId: { type: 'string', description: 'The ID of the team.' }
 *               formatId: { type: 'string', description: 'The ID of the retrospective format.' }
 *     responses:
 *       201:
 *         description: The session was successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RetroSession'
 *       404:
 *         description: The specified team or format was not found.
 */
router.post('/session', createRetroSession);

/**
 * @openapi
 * /api/retrospective/session/{sessionId}/items:
 *   get:
 *     tags:
 *       - Retrospective Board
 *     summary: Get all items for a specific retrospective session
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the retrospective session.
 *     responses:
 *       200:
 *         description: A list of items for the session.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RetroItem'
 */
router.get('/session/:sessionId/items', getRetroItemsForSession);

/**
 * @openapi
 * /api/retrospective/session/{sessionId}:
 *   get:
 *     tags:
 *       - Retrospective Board
 *     summary: Get a single retrospective session by its ID, including all items
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the retrospective session.
 *     responses:
 *       200:
 *         description: The requested retrospective session.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RetroSession'
 *       404:
 *         description: Session not found.
 */
router.get('/session/:sessionId', getRetroSession);

/**
 * @openapi
 * /api/retrospective/item:
 *   post:
 *     tags:
 *       - Retrospective Board
 *     summary: Create a new retrospective item (card)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content, authorId, sessionId]
 *             properties:
 *               content: { type: 'string', description: 'The text content of the item.' }
 *               authorId: { type: 'string', description: 'The ID of the user creating the item.' }
 *               sessionId: { type: 'string', description: 'The ID of the session this item belongs to.' }
 *               positionData: { type: 'object', description: 'Flexible JSON for positioning.' }
 *               metadata: { type: 'object', description: 'Flexible JSON for metadata like color.' }
 *     responses:
 *       201:
 *         description: The item was successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RetroItem'
 *       404:
 *         description: The specified author or session was not found.
 */
router.post('/item', createRetroItem);

export default router;
