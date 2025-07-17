import { Router } from 'express';
import {
  initializeSession,
  updateDisplayName,
  joinTeam,
  clearSession
} from './user-session.controller';

const router = Router();

/**
 * @swagger
 * /api/user-session/initialize:
 *   post:
 *     summary: Initialize or retrieve user session
 *     tags: [User Session]
 *     responses:
 *       200:
 *         description: Session initialized successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 session:
 *                   $ref: '#/components/schemas/UserSession'
 *                 isNew:
 *                   type: boolean
 */
router.post('/initialize', initializeSession);

/**
 * @swagger
 * /api/user-session/update-name:
 *   put:
 *     summary: Update user display name
 *     tags: [User Session]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               displayName:
 *                 type: string
 *                 example: "John Doe"
 *     responses:
 *       200:
 *         description: Display name updated successfully
 */
router.put('/update-name', updateDisplayName);

/**
 * @swagger
 * /api/user-session/join-team:
 *   put:
 *     summary: Associate user session with a team
 *     tags: [User Session]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teamId:
 *                 type: string
 *                 example: "team-uuid-123"
 *     responses:
 *       200:
 *         description: Successfully joined team
 */
router.put('/join-team', joinTeam);

/**
 * @swagger
 * /api/user-session/clear:
 *   delete:
 *     summary: Clear user session
 *     tags: [User Session]
 *     responses:
 *       200:
 *         description: Session cleared successfully
 */
router.delete('/clear', clearSession);

export default router;
