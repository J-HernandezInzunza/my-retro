import { Request, Response } from 'express';
import { UserSessionService } from '../business/user-session.service';

const userSessionService = new UserSessionService();

/**
* @route   POST /api/user-session/initialize
* @desc    Initialize user session
* @access  Public
*/
export const initializeSession = async (req: Request, res: Response) => {
  try {
    // Check if user already has a session
    let sessionId = req.session?.user?.id;
    
    const result = await userSessionService.initializeSession(sessionId);
    
    // Store user data in express session (single source of truth)
    if (req.session) {
      req.session.user = result.session;
    }
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Error initializing session:', error);
    res.status(500).json({ error: 'Failed to initialize session' });
  }
};

/**
* @route   PUT /api/user-session/update-name
* @desc    Update display name
* @access  Public
*/
export const updateDisplayName = async (req: Request, res: Response) => {
  try {
    const { displayName } = req.body;
    
    // Get session ID from express session (single source of truth)
    const sessionId = req.session?.user?.id;
    
    if (!sessionId) {
      return res.status(401).json({ error: 'No active session' });
    }

    if (!displayName || typeof displayName !== 'string' || displayName.trim() === '') {
      return res.status(400).json({ error: 'Valid display name is required' });
    }

    const updatedSession = await userSessionService.updateSession(sessionId, { displayName });
    
    if (!updatedSession) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Update user data in express session
    if (req.session) {
      req.session.user = updatedSession;
    }

    res.status(200).json({ session: updatedSession });
  } catch (error) {
    console.error('Failed to update display name:', error);
    res.status(500).json({ error: 'Failed to update display name' });
  }
};

/**
* @route   POST /api/user-session/join-team
* @desc    Join team with session
* @access  Public
*/
export const joinTeam = async (req: Request, res: Response) => {
  try {
    const { teamId } = req.body;
    
    // Get session ID from express session (single source of truth)
    const sessionId = req.session?.user?.id;

    if (!sessionId) {
      return res.status(401).json({ error: 'No active session' });
    }

    if (!teamId) {
      return res.status(400).json({ error: 'Team ID is required' });
    }

    // In a future implementation, we'd check if the team exists
    // For now, we'll simply update the session with the team ID
    const updatedSession = await userSessionService.updateSession(sessionId, { teamId });
    
    if (!updatedSession) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Update user data in express session
    if (req.session) {
      req.session.user = updatedSession;
    }

    res.status(200).json({ session: updatedSession });
  } catch (error) {
    console.error('Failed to join team:', error);
    res.status(500).json({ error: 'Failed to join team' });
  }
};

/**
* @route   DELETE /api/user-session/clear
* @desc    Clear session
* @access  Public
*/
export const clearSession = async (req: Request, res: Response) => {
  try {
    // Get session ID from express session (single source of truth)
    const sessionId = req.session?.user?.id;

    // Delete from database if session exists
    if (sessionId) {
      await userSessionService.deleteSession(sessionId);
    }
    
    // Always attempt to destroy express session (idempotent operation)
    // This handles both cases: session exists or doesn't exist
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destruction error:', err);
          return res.status(500).json({ error: 'Failed to clear session' });
        }
        // Success: session cleared (or was already cleared)
        res.status(204).end();
      });
    } else {
      // No session to clear, but that's still a successful "clear" operation
      res.status(204).end();
    }
  } catch (error) {
    console.error('Failed to clear session:', error);
    res.status(500).json({ error: 'Failed to clear session' });
  }
};
