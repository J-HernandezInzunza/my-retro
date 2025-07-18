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
    let sessionId = req.userSession?.id;
    
    const result = await userSessionService.initializeSession(sessionId, req.body);
    
    // Generate token (for now, just use session ID)
    // Later, implement proper token generation
    const token = result.session.id;
    
    res.status(200).json({
      ...result,
      token
    });
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
    const sessionId = req.userSession!.id; // Get session ID from token-based authentication

    if (!displayName || typeof displayName !== 'string' || displayName.trim() === '') {
      return res.status(400).json({ error: 'Valid display name is required' });
    }

    const updatedSession = await userSessionService.updateSession(sessionId, { displayName });
    
    if (!updatedSession) {
      return res.status(404).json({ error: 'Session not found' });
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
export const joinTeam = async (req: Request, res: Response)=> {
  try {
    const { teamId } = req.body;
    const sessionId = req.userSession!.id; // Get session ID from token-based authentication

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
    const sessionId = req.userSession!.id; // Get session ID from token-based authentication

    // Delete from database if session exists
    if (sessionId) {
      await userSessionService.deleteSession(sessionId);
    }
    
    res.status(204).end();
  } catch (error) {
    console.error('Failed to clear session:', error);
    res.status(500).json({ error: 'Failed to clear session' });
  }
};
