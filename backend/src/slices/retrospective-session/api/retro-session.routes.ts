import { Router } from 'express';
import { PrismaClient } from '../../../generated/prisma';
import { RetroSessionRepository } from '../../../shared/repositories';
import { RetroSessionService } from '../business/retro-session.service';
import { RetroSessionController } from './retro-session.controller';
import { requireSession } from '../../../app/session-validation.middleware';

const router = Router();
const prisma = new PrismaClient();

// Initialize dependencies
const retroSessionRepository = new RetroSessionRepository(prisma);
const retroSessionService = new RetroSessionService(retroSessionRepository);
const retroSessionController = new RetroSessionController(retroSessionService);

// Apply session validation middleware to all routes
router.use(requireSession);

/**
 * @swagger
 * /api/retro-sessions:
 *   post:
 *     summary: Create a new retrospective session
 *     tags: [Retro Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - teamId
 *               - formatId
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the retrospective session
 *               teamId:
 *                 type: string
 *                 description: ID of the team
 *               formatId:
 *                 type: string
 *                 description: ID of the retro format to use
 *     responses:
 *       201:
 *         description: Retro session created successfully
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Server error
 */
router.post('/', (req, res) => retroSessionController.createRetroSession(req, res));

/**
 * @swagger
 * /api/retro-sessions:
 *   get:
 *     summary: Get retro sessions for a team
 *     tags: [Retro Sessions]
 *     parameters:
 *       - in: query
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the team
 *     responses:
 *       200:
 *         description: List of retro sessions
 *       400:
 *         description: Missing teamId parameter
 *       500:
 *         description: Server error
 */
router.get('/', (req, res) => retroSessionController.getTeamRetroSessions(req, res));

/**
 * @swagger
 * /api/retro-sessions/{sessionId}:
 *   get:
 *     summary: Get detailed information about a retro session
 *     tags: [Retro Sessions]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the retro session
 *     responses:
 *       200:
 *         description: Retro session details
 *       404:
 *         description: Retro session not found
 *       500:
 *         description: Server error
 */
router.get('/:sessionId', (req, res) => retroSessionController.getRetroSessionDetail(req, res));

/**
 * @swagger
 * /api/retro-sessions/{sessionId}:
 *   put:
 *     summary: Update a retro session
 *     tags: [Retro Sessions]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the retro session
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, COMPLETED, ARCHIVED]
 *                 description: Updated status
 *     responses:
 *       200:
 *         description: Retro session updated successfully
 *       500:
 *         description: Server error
 */
router.put('/:sessionId', (req, res) => retroSessionController.updateRetroSession(req, res));

/**
 * @swagger
 * /api/retro-sessions/{sessionId}:
 *   delete:
 *     summary: Delete a retro session
 *     tags: [Retro Sessions]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the retro session
 *     responses:
 *       204:
 *         description: Retro session deleted successfully
 *       500:
 *         description: Server error
 */
router.delete('/:sessionId', (req, res) => retroSessionController.deleteRetroSession(req, res));

export default router;
