import { Router } from 'express';
import {
  getRetroFormats,
  createRetroSession,
  createRetroItem,
  getRetroItemsForSession,
  getRetroSession,
  updateRetroItem,
  deleteRetroItem,
  updateRetroSession,
  deleteRetroSession,
} from './retrospective-board.controller';
import { requireSession, optionalSession } from '../../app/session-validation.middleware';

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
// Public route - no session required
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
 *             required: [name, teamId, formatId]
 *             properties:
 *               name: { type: 'string', description: 'The name of the retrospective session.' }
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
// Requires active session to create retro session
router.post('/session', requireSession, createRetroSession);

/**
 * @openapi
 * /api/retrospective/session/{sessionId}:
 *   patch:
 *     tags:
 *       - Retrospective Board
 *     summary: Update a retrospective session
 *     description: Updates the name or status of an existing retrospective session.
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the retrospective session to update.
 *     requestBody:
 *       description: The fields to update on the session. All fields are optional.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The new name for the session.
 *               status:
 *                 type: string
 *                 description: The new status for the session.
 *                 enum: [ACTIVE, COMPLETED, ARCHIVED]
 *     responses:
 *       '200':
 *         description: The session was updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RetroSession'
 *       '404':
 *         description: The session with the specified ID was not found.
 *       '500':
 *         description: Internal Server Error.
 */
// Requires active session to update retro session
router.patch('/session/:sessionId', requireSession, updateRetroSession);

/**
 * @openapi
 * /api/retrospective/session/{sessionId}:
 *   delete:
 *     tags:
 *       - Retrospective Board
 *     summary: Delete a retrospective session
 *     description: Permanently removes a retrospective session and all of its associated items from the database.
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the retrospective session to delete.
 *     responses:
 *       '204':
 *         description: The session and its items were deleted successfully.
 *       '404':
 *         description: The session with the specified ID was not found.
 *       '500':
 *         description: Internal Server Error.
 */
// Requires active session to delete retro session
router.delete('/session/:sessionId', requireSession, deleteRetroSession);

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
// Optional session - can view items with or without session
router.get('/session/:sessionId/items', optionalSession, getRetroItemsForSession);

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
// Optional session - can view session details with or without session
router.get('/session/:sessionId', optionalSession, getRetroSession);

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
// Requires active session to create retro items
router.post('/item', requireSession, createRetroItem);

/**
 * @openapi
 * /api/retrospective/item/{itemId}:
 *   patch:
 *     tags:
 *       - Retrospective Board
 *     summary: Update a retrospective item
 *     description: Updates the content, position, or metadata of an existing retrospective item.
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the retrospective item to update.
 *     requestBody:
 *       description: The fields to update on the retrospective item. All fields are optional.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The new text content of the item.
 *               positionData:
 *                 type: object
 *                 description: The new position data for rendering the item.
 *                 additionalProperties: true
 *               metadata:
 *                 type: object
 *                 description: Any other metadata for the item.
 *                 additionalProperties: true
 *     responses:
 *       '200':
 *         description: The retrospective item was updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RetroItem'
 *       '404':
 *         description: The retrospective item with the specified ID was not found.
 *       '500':
 *         description: Internal Server Error.
 */
// Requires active session to update retro items
router.patch('/item/:itemId', requireSession, updateRetroItem);

/**
 * @openapi
 * /api/retrospective/item/{itemId}:
 *   delete:
 *     tags:
 *       - Retrospective Board
 *     summary: Delete a retrospective item
 *     description: Permanently removes a retrospective item from the database.
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the retrospective item to delete.
 *     responses:
 *       '204':
 *         description: The retrospective item was deleted successfully.
 *       '404':
 *         description: The retrospective item with the specified ID was not found.
 *       '500':
 *         description: Internal Server Error.
 */
// Requires active session to delete retro items
router.delete('/item/:itemId', requireSession, deleteRetroItem);

export default router;
