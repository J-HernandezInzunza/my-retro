import { Router } from 'express';
import { initializeSession, updateDisplayName, joinTeam, clearSession } from './user-session.controller';
import SessionCleanupScheduler from '../business/user-session-cleanup.scheduler';

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

/**
 * @swagger
 * /api/user-session/cleanup-status:
 *   get:
 *     summary: Get session cleanup status
 *     tags: [User Session]
 *     responses:
 *       200:
 *         description: Session cleanup status retrieved successfully
 */
router.get('/cleanup-status', async (req, res) => {
  try {
    const schedulerInfo = SessionCleanupScheduler.getSchedulerInfo();
    const sessionStats = await SessionCleanupScheduler.getSessionStats();
    
    res.status(200).json({
      scheduler: schedulerInfo,
      sessions: sessionStats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting session cleanup status:', error);
    res.status(500).json({ error: 'Failed to get session cleanup status' });
  }
});

/**
 * @swagger
 * /api/user-session/cleanup:
 *   post:
 *     summary: Manually trigger session cleanup
 *     tags: [User Session]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               inactiveThresholdMinutes:
 *                 type: number
 *                 example: 60
 *     responses:
 *       200:
 *         description: Session cleanup completed successfully
 */
router.post('/cleanup', async (req, res) => {
  try {
    const { inactiveThresholdMinutes = 60 } = req.body;
    await SessionCleanupScheduler.runCleanupNow(inactiveThresholdMinutes);
    
    res.status(200).json({ 
      message: 'Session cleanup completed',
      thresholdMinutes: inactiveThresholdMinutes
    });
  } catch (error) {
    console.error('Error running manual session cleanup:', error);
    res.status(500).json({ error: 'Failed to run session cleanup' });
  }
});

export default router;
