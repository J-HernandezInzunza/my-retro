import { Request, Response } from 'express';
import { UserManagementService } from '../business/user-management.service';
import { UserRole } from '../../../generated/prisma';

const userService = new UserManagementService();

/**
 * Upgrade a user session to a permanent user account
 * POST /api/users/upgrade
 */
export const upgradeSession = async (req: Request, res: Response) => {
  try {
    const { email, role } = req.body;
    
    // Get session ID from the authenticated session
    const sessionId = req.userSession!.id;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Default to MEMBER role if not specified
    const userRole = role && Object.values(UserRole).includes(role) ? role : UserRole.MEMBER;

    const user = await userService.upgradeSessionToUser(sessionId, {
      email,
      role: userRole
    });
    
    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Upgrade session error:', error);
    
    if (error instanceof Error) {
      return res.status(400).json({ 
        error: error.message 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to upgrade session' 
    });
  }
};

/**
 * Get current user info
 * GET /api/users/me
 */
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const session = req.userSession!;
    
    // If session is linked to a permanent user, get user details
    if (session.userId) {
      const user = await userService.getUser(session.userId);

      if (user) {
        return res.status(200).json({
          type: 'permanent_user',
          user: {
            id: user.id,
            email: user.email,
            displayName: user.displayName,
            role: user.role
          },
          session: {
            id: session.id,
            displayName: session.displayName
          }
        });
      }
    }
    
    // Return session-only user
    res.status(200).json({
      type: 'session_user',
      session: {
        id: session.id,
        displayName: session.displayName
      }
    });

  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ 
      error: 'Failed to get user info' 
    });
  }
};

/**
 * Link current session to existing user account
 * POST /api/users/link
 */
export const linkToExistingUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    // Get session ID from the authenticated session
    const sessionId = req.userSession!.id;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await userService.linkSessionToExistingUser(sessionId, email);
    
    res.status(200).json({
      success: true,
      message: 'Successfully linked to existing account',
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Link to existing user error:', error);    
    res.status(500).json({ error: 'Failed to link to existing account' });
  }
};
