import { Request, Response } from 'express';
import { prisma } from '../../app/core/prisma';

// A temporary store for session IDs to ensure uniqueness for this example
const usedSessionIds = new Set<string>();

/**
* @route   GET /users?teamId={teamId}
* @desc    Get all users in a team
* @access  Public
*/
export const getUsers = async (req: Request, res: Response) => {
  try {
    const { teamId } = req.query;

    if (!teamId) {
      return res.status(400).json({ message: 'A teamId query parameter is required.' });
    }

    const users = await prisma.user.findMany({
      where: {
        teamId: teamId as string,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}

/**
 * @route   POST /users
 * @desc    Create a new user
 * @access  Public
 */
export const createUser = async (req: Request, res: Response) => {
  try {
    const { displayName, sessionId } = req.body;

    // Basic validation
    if (!displayName || !sessionId) {
      return res.status(400).json({ message: 'displayName and sessionId are required' });
    }

    if (usedSessionIds.has(sessionId)) {
        return res.status(400).json({ message: 'sessionId is already in use' });
    }

    // For now, add all new users to the default 'Alpha Team'
    const alphaTeamId = 'clg000000000000000000000';

    const newUser = await prisma.user.create({
      data: {
        displayName,
        sessionId,
        teamId: alphaTeamId,
      },
    });

    usedSessionIds.add(sessionId);

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    // Check for unique constraint violation
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
        return res.status(409).json({ message: 'A user with this sessionId already exists.' });
    }
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
