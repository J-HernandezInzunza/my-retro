import { Router } from 'express';
import { createUser, getUsers } from './user-management.controller';

const router = Router();

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags:
 *       - User Management
 *     summary: Retrieve a list of users filtered by team
 *     parameters:
 *       - in: query
 *         name: teamId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the team to filter users by.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request, teamId is required.
 */
router.get('/', getUsers);

/**
 * @openapi
 * /api/users:
 *   post:
 *     tags:
 *       - User Management
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - displayName
 *               - sessionId
 *             properties:
 *               displayName:
 *                 type: string
 *                 example: 'John Doe'
 *               sessionId:
 *                 type: string
 *                 example: 'some-unique-session-id'
 *     responses:
 *       201:
 *         description: The user was successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       409:
 *         description: Conflict, a user with this sessionId already exists.
 */
router.post('/', createUser);

export default router;
