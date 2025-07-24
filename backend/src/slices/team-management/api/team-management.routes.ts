import { Router } from 'express';
import { createTeam, joinTeam, getUserTeams, getTeamDetails } from './team-management.controller';
import { requireSession } from '../../../app/session-validation.middleware';

const router = Router();

/**
 * @swagger
 * /api/teams:
 *   get:
 *     summary: Get list of teams user is a member of
 *     tags: [Team Management]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: List of user's teams retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TeamMemberResponse'
 */
router.get('/', requireSession, getUserTeams);

/**
 * @swagger
 * /api/teams/create:
 *   post:
 *     summary: Create a new team
 *     tags: [Team Management]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "My Awesome Team"
 *                 description: "The name of the team to create"
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Team created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TeamResponse'
 *       400:
 *         description: Invalid request data
 *       403:
 *         description: Only ADMIN users can create teams
 */
router.post('/create', requireSession, createTeam);

/**
 * @swagger
 * /api/teams/join:
 *   post:
 *     summary: Join a team using invite code
 *     tags: [Team Management]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               inviteCode:
 *                 type: string
 *                 example: "ABC123XY"
 *                 description: "8-character invite code for the team"
 *             required:
 *               - inviteCode
 *     responses:
 *       200:
 *         description: Successfully joined team
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TeamResponse'
 *       400:
 *         description: Invalid invite code format
 *       404:
 *         description: Team not found or invalid invite code
 *       409:
 *         description: User is already a member of this team
 */
router.post('/join', requireSession, joinTeam);

/**
 * @swagger
 * /api/teams/{teamId}:
 *   get:
 *     summary: Get detailed information about a specific team
 *     tags: [Team Management]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *         description: The team ID
 *     responses:
 *       200:
 *         description: Team details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 team:
 *                   $ref: '#/components/schemas/TeamResponse'
 *                 members:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TeamMemberResponse'
 *                 userRole:
 *                   type: string
 *                   enum: [FACILITATOR, MEMBER]
 *       403:
 *         description: User is not a member of this team
 *       404:
 *         description: Team not found
 */
router.get('/:teamId', requireSession, getTeamDetails);

export default router;
